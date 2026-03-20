/**
 * ChartGen AI API helper — portable tool for OpenClaw skill.
 *
 * Zero external dependencies — uses only Node.js built-ins.
 *
 * When a task finishes, artifact images are automatically saved to
 * the OpenClaw media directory (~/.openclaw/media/) and the
 * `image_base64` field is replaced with `image_path` (full local path)
 * so the agent can send the file directly via `message send`.
 *
 * Usage:
 *   npx tsx tools/chartgen_api.ts submit  <base_url> <api_key> <query> [lang] [session_id]
 *   npx tsx tools/chartgen_api.ts poll    <base_url> <api_key> <task_id>
 *   npx tsx tools/chartgen_api.ts wait    <base_url> <api_key> <task_id>
 *       (poll repeatedly until finished — designed for background exec)
 *   npx tsx tools/chartgen_api.ts run     <base_url> <api_key> <query> [lang] [session_id]
 *       (submit + wait combined — one-shot convenience)
 */

import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { URL } from "url";

const POLL_INTERVAL_MS = 20_000;
const MAX_POLLS = 30;

// ---------------------------------------------------------------------------
// OpenClaw media directory resolution
// ---------------------------------------------------------------------------

function getMediaDir(): string {
  const stateDir = process.env.OPENCLAW_STATE_DIR;
  if (stateDir) {
    const media = path.join(stateDir, "media");
    if (ensureDir(media)) return media;
    const workspace = path.join(stateDir, "workspace");
    if (ensureDir(workspace)) return workspace;
  }

  const home = os.homedir();
  const candidates = [
    path.join(home, ".openclaw", "media"),
    path.join(home, ".openclaw", "workspace"),
  ];
  for (const dir of candidates) {
    if (ensureDir(dir)) return dir;
  }

  return os.tmpdir();
}

function ensureDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// HTTP helper — works with both http and https, no external deps
// ---------------------------------------------------------------------------

interface RequestOptions {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
}

function request(opts: RequestOptions): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(opts.url);
    const lib = parsed.protocol === "https:" ? https : http;

    const reqOpts: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: opts.method ?? "GET",
      headers: opts.headers ?? {},
      timeout: opts.timeoutMs ?? 30_000,
    };

    const req = lib.request(reqOpts, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode ?? 0,
          body: Buffer.concat(chunks).toString("utf-8"),
        });
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    if (opts.body) {
      req.write(opts.body);
    }
    req.end();
  });
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

interface SubmitResult {
  task_id?: string;
  session_id?: string;
  status?: string;
  poll_url?: string;
  error?: string;
}

interface PollResult {
  task_id?: string;
  status?: string;
  session_id?: string;
  text_reply?: string;
  artifacts?: Array<{
    artifact_id?: number;
    type: string;
    title: string;
    image_base64?: string;
    image_path?: string;
    raw_data?: unknown;
    download_url?: string;
  }>;
  progress?: string;
  error?: string;
}

async function submit(
  baseUrl: string,
  apiKey: string,
  query: string,
  lang = "en",
  sessionId?: string,
): Promise<SubmitResult> {
  const payload: Record<string, string> = { query, lang };
  if (sessionId) payload.session_id = sessionId;
  const body = JSON.stringify(payload);

  try {
    const res = await request({
      url: `${baseUrl}/api/agent/chat`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": apiKey,
      },
      body,
    });
    return JSON.parse(res.body);
  } catch (err: unknown) {
    return { error: `Connection failed: ${(err as Error).message}`, status: "error" };
  }
}

async function poll(baseUrl: string, apiKey: string, taskId: string): Promise<PollResult> {
  try {
    const res = await request({
      url: `${baseUrl}/api/agent/task/${taskId}`,
      method: "GET",
      headers: { "access-token": apiKey },
      timeoutMs: 15_000,
    });
    const result: PollResult = JSON.parse(res.body);
    return saveArtifacts(result);
  } catch (err: unknown) {
    return { error: `Poll failed: ${(err as Error).message}`, status: "error" };
  }
}

function saveBase64(dataUri: string, tag?: string): string | null {
  try {
    const marker = "base64,";
    const idx = dataUri.indexOf(marker);
    const raw = idx !== -1 ? dataUri.slice(idx + marker.length) : dataUri;
    const buf = Buffer.from(raw, "base64");
    const mediaDir = getMediaDir();
    const name = `chartgen_${tag ?? Date.now()}.png`;
    const dest = path.join(mediaDir, name);
    fs.writeFileSync(dest, buf);
    return dest;
  } catch {
    return null;
  }
}

function saveArtifacts(result: PollResult): PollResult {
  if (result.status !== "finished" || !result.artifacts) return result;

  for (const art of result.artifacts) {
    if (art.image_base64) {
      const tag = art.artifact_id ? String(art.artifact_id) : String(Date.now());
      const saved = saveBase64(art.image_base64, tag);
      if (saved) {
        art.image_path = saved;
        delete art.image_base64;
      }
    }
  }
  return result;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTask(
  baseUrl: string,
  apiKey: string,
  taskId: string,
  intervalMs = POLL_INTERVAL_MS,
  maxPolls = MAX_POLLS,
): Promise<PollResult> {
  for (let attempt = 1; attempt <= maxPolls; attempt++) {
    await sleep(intervalMs);
    const result = await poll(baseUrl, apiKey, taskId);
    const st = result.status ?? "";

    if (st === "finished" || st === "error" || st === "not_found") {
      return result;
    }

    if (attempt % 3 === 0) {
      const progress = result.progress ?? "processing";
      process.stderr.write(JSON.stringify({ poll: attempt, status: st, progress }) + "\n");
    }
  }

  return { error: "Polling timed out", task_id: taskId, status: "timeout" } as PollResult;
}

async function run(
  baseUrl: string,
  apiKey: string,
  query: string,
  lang = "en",
  sessionId?: string,
): Promise<PollResult> {
  const submitRes = await submit(baseUrl, apiKey, query, lang, sessionId);
  if (submitRes.error) return { error: submitRes.error, status: "error" };

  const taskId = submitRes.task_id;
  if (!taskId) return { error: "No task_id in submit response", status: "error" };

  return waitForTask(baseUrl, apiKey, taskId);
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv;

  let result: unknown;

  switch (cmd) {
    case "submit": {
      const [baseUrl, apiKey, query, lang, sessionId] = args;
      if (!baseUrl || !apiKey || !query) {
        process.stderr.write("Usage: chartgen_api.ts submit <base_url> <api_key> <query> [lang] [session_id]\n");
        process.exit(1);
      }
      result = await submit(baseUrl, apiKey, query, lang || "en", sessionId || undefined);
      break;
    }
    case "poll": {
      const [baseUrl, apiKey, taskId] = args;
      if (!baseUrl || !apiKey || !taskId) {
        process.stderr.write("Usage: chartgen_api.ts poll <base_url> <api_key> <task_id>\n");
        process.exit(1);
      }
      result = await poll(baseUrl, apiKey, taskId);
      break;
    }
    case "wait": {
      const [baseUrl, apiKey, taskId] = args;
      if (!baseUrl || !apiKey || !taskId) {
        process.stderr.write("Usage: chartgen_api.ts wait <base_url> <api_key> <task_id>\n");
        process.exit(1);
      }
      result = await waitForTask(baseUrl, apiKey, taskId);
      break;
    }
    case "run": {
      const [baseUrl, apiKey, query, lang, sessionId] = args;
      if (!baseUrl || !apiKey || !query) {
        process.stderr.write("Usage: chartgen_api.ts run <base_url> <api_key> <query> [lang] [session_id]\n");
        process.exit(1);
      }
      result = await run(baseUrl, apiKey, query, lang || "en", sessionId || undefined);
      break;
    }
    default:
      process.stderr.write(
        "ChartGen AI API Tool\n\n" +
          "Commands:\n" +
          "  submit  <base_url> <api_key> <query> [lang] [session_id]\n" +
          "  poll    <base_url> <api_key> <task_id>          (single check)\n" +
          "  wait    <base_url> <api_key> <task_id>          (poll until done, for background exec)\n" +
          "  run     <base_url> <api_key> <query> [lang] [session_id]  (submit + wait)\n\n" +
          "When a task finishes, artifact images are auto-saved to the\n" +
          "OpenClaw media directory. The 'image_path' field in each artifact\n" +
          "contains the full local path ready for message send.\n",
      );
      process.exit(1);
  }

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main().catch((err) => {
  process.stderr.write(JSON.stringify({ error: String(err) }) + "\n");
  process.exit(1);
});
