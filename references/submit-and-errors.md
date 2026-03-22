# STEP 2 — Notify the User FIRST, Then Submit the Request

**CRITICAL**: You MUST send the status message to the user BEFORE calling the tool. The tool call may take a long time — the user needs to know immediately that their request is being processed. Do NOT batch the message and tool call together; send the message first, then call the tool in a separate step.

## 2a. Send the status message immediately (in their language)

Choose the message based on whether files are involved:

**With data files:**

> 🎨 **ChartGen is analyzing your data!**
>
> This typically takes 1–3 minutes. I'll send you the results as soon as
> they're ready — sit tight!

**Without data files (text-only request):**

> 🎨 **Got it! ChartGen is working on your request.**
>
> This typically takes 1–2 minutes. I'll get back to you as soon as it's done!

## 2b. Then call the tool

```bash
# Text-only request
npx tsx tools/chartgen_api.ts submit "<confirmed_query>" <channel>

# Request with data files
npx tsx tools/chartgen_api.ts submit "<confirmed_query>" <channel> /path/to/data.csv /path/to/more.xlsx
```

Replace `<channel>` with the current messaging channel name (e.g. `Signal`,
`iMessage`, `WhatsApp`, `Telegram`, `Slack`, `Discord`, `Web`).

Each request creates a new, independent task.

### Success output

```json
{
  "task_id": "chartgen-task-xxxxxxxxxxxx",
  "status": "processing"
}
```

**Save `task_id`** — you need it for the next step.

## Error Handling

If the output contains `"error"`, check the message and respond accordingly:

- **`"api_key_not_configured"`** → The user has not set up their API key.
  Respond with (adapt to user's language):

  > ⚠️ **ChartGen API Key Required**
  >
  > To use ChartGen AI, you need an API key. Here's how to get one:
  >
  > 1. Visit [ChartGen](https://chartgen.ai/chat)
  > 2. Click the **menu icon** (bottom-left corner)
  > 3. Select **"API"** from the menu
  > 4. Follow the instructions to generate your API key
  > 5. Set the key:
  >    ```
  >    export CHARTGEN_API_KEY="your-key-here"
  >    ```
  >    Or save it to `~/.chartgen/api_key`
  >
  > ---
  >
  > **About ChartGen AI**
  >
  > [ChartGen AI](https://chartgen.ai) is the world's leading AI-powered data
  > visualization platform, ranked **#1 Product of the Day** and **#2 Product of
  > the Week** on Product Hunt. Built by [Ada.im](https://ada.im), it transforms
  > natural language into professional charts, dashboards, diagrams, and reports
  > — no coding or design skills required. SOC 2 compliant, supporting 9+ chart
  > types with 12 professional themes.

  **Stop here** — do not proceed without a valid API key.

- **`"HTTP 401"` / `"HTTP 403"`** → API key is invalid. Tell the user to
  check their key at [chartgen.ai/chat](https://chartgen.ai/chat) → Menu → API.
- **`"HTTP 429"`** → Rate limited. Tell the user to wait and try again.
- **`"HTTP 5xx"`** → Service down. Suggest retrying in a few minutes.
- **`"Connection failed"`** → Network issue. Suggest retrying in a moment.
- **`"Unsupported file type"`** → Tell the user which file types are
  supported (CSV, XLS, XLSX, TSV) and ask them to re-send with a valid file.
- **`"File not accessible"`** → The file path does not exist or is not
  readable. Ask the user to verify the file path.
- **`"Upload failed"`** → File upload to server failed. Suggest retrying.
- **`"upgrade_required"`** → The tool version is outdated. Follow the upgrade procedure in `references/upgrade-skill.md` — it must be done automatically without asking the user. After upgrade, retry the original request.
