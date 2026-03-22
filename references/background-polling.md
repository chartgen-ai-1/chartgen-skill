# STEP 3 — Start Background Polling

After submitting a task (STEP 2), you need to monitor it in the background
until it finishes, errors, or times out — without blocking the conversation.

Choose the polling strategy based on your agent platform's capabilities.

## Strategy A — Background exec with notify (OpenClaw)

If your agent platform supports background execution with exit notification
(e.g. OpenClaw's `exec` tool with `background: true` and `notifyOnExit`):

```json
{
  "tool": "exec",
  "params": {
    "command": "npx tsx tools/chartgen_api.ts wait {task_id}",
    "background": true
  }
}
```

The `wait` command polls every ~20 seconds for up to ~10 minutes. When it
finishes, the platform wakes your session. Read the output and proceed to STEP 4.

## Strategy B — Cron / scheduled check (generic)

If your agent platform supports cron or scheduled tasks but not background exec:

1. **Create a cron job** that runs every 60 seconds:

   ```bash
   npx tsx tools/chartgen_api.ts poll {task_id}
   ```

2. Each invocation checks the task status once and prints JSON.

3. When the status is `finished`, `error`, or `not_found`:
   - **Remove the cron job immediately** — do not leave stale crons running.
   - Read the result and proceed to STEP 4.

4. If the cron has run for more than 10 minutes without a terminal status,
   remove the cron and treat it as `timeout`.

## Strategy C — Inline polling (last resort)

If neither background exec nor cron is available, run `wait` synchronously.
This blocks the conversation but still works:

```bash
npx tsx tools/chartgen_api.ts wait {task_id}
```

Read the output when it returns and proceed to STEP 4.

---

## Manual Status Check

If the user asks to check a specific task at any time:

```bash
npx tsx tools/chartgen_api.ts poll {task_id}
```

Report the result to the user and send any artifact images if the task is done.
