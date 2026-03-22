# STEP 1 — Understand the Request & Confirm Before Submitting

Always respond in the same language the user is using. All confirmation prompts
**must** include numbered options so the user can reply with just a number.
The user may also reply with text — treat any affirmative reply or direct
modification as confirmation.

## Confirmation Rules (MUST follow)

1. **Cancel means abandon.** If the user cancels (replies "0", "cancel",
   or any cancellation), the pending task is **permanently discarded**. Do NOT
   proceed with it under any circumstances. If the user later wants a ChartGen
   task, treat it as a brand-new request and go through confirmation again.

2. **Replies only bind to the most recent confirmation prompt.** A numbered
   reply or affirmative answer is ONLY valid as a response to the last
   confirmation you sent. A confirmation becomes **invalidated** if any of
   the following happened since you sent it:
   - The user cancelled it.
   - The task it referred to has already been submitted or completed.
   - The conversation moved on to a different topic or task (even briefly).
   - Multiple unrelated messages were exchanged in between.

   If the confirmation is no longer active, do NOT silently reuse it. Start a
   new confirmation from scratch.

3. **When in doubt, ask.** If you are unsure whether the user's reply is
   answering your confirmation prompt or saying something unrelated, always
   ask the user to clarify before proceeding. Never guess.

---

## 1a. User sends a text request (no files)

Analyze the user's message to determine:
- **What type of visualization** they want (chart, dashboard, diagram, report, etc.)
- **What data** they have or are describing
- **Any specific preferences** (chart type, style(optional))

Then compose the task description you plan to send to ChartGen and present it
with numbered options. Example (adapt to user's language):

> I'll use **ChartGen** to create this for you:
>
> 📊 **Generate a monthly sales trend line chart for 2025, with data points labeled.**
>
> Reply:
> **1** — Looks good, go ahead!
> **2** — I want to modify the description (just send me your version)
> **0** — Cancel

If user replies **1** (or any affirmative in any language, e.g. "ok", "sure",
"go ahead"): proceed to STEP 2.

If user replies **2** or sends a modified description: use the user's version
and proceed to STEP 2 directly — no need to confirm again.

If user replies **0** (or any cancellation): acknowledge cancellation and
**completely discard** this task. Do NOT proceed with it later.

## 1b. User sends one or more Excel/CSV files

When the user attaches data files, **do not immediately submit**. Instead:

1. Briefly examine the file names and any context the user provided.
2. Based on ChartGen's capabilities (multi-file data analysis, chart generation,
   report generation), **recommend 3–5 tasks** the user could submit. Number
   each option and note which files are involved. Example:

   > Great, I received your data files! What would you like **ChartGen**
   > to do for you? Pick a number or tell me your own idea:
   >
   > **1.** 📊 Monthly order trend chart — *orders.xlsx*
   > **2.** 🥧 Order category pie chart — *orders.xlsx, order_items.xlsx, products.xlsx*
   > **3.** 📈 Revenue comparison by store — *orders.xlsx, store.xlsx*
   > **4.** 📋 Full data analysis report — *all 4 files*
   > **0.** ❌ Cancel
   >
   > You can also type your own question, or adjust which files to include.

3. If user replies with a **number** (1–N): use that option and proceed to
   STEP 2 directly.

4. If user sends **custom text**: treat it as a custom task description and
   proceed to STEP 2 directly.

5. If user replies **0** or cancels: acknowledge cancellation and
   **completely discard** this task. Do NOT proceed with it later.
