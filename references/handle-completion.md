# STEP 4 — Handle the Completion Event

When the polling (STEP 3) finishes, read the output JSON and check the `status`
field to decide what to do next.

## `"finished"` — success

Example output:

```json
{
  "task_id": "chartgen-task-xxx",
  "status": "finished",
  "text_reply": "Here is your pie chart...",
  "edit_url": "https://chartgen.ai/chat/agent-20260321-082907-5716d011?artifactId=3315",
  "artifacts": [
    {
      "artifact_id": 3315,
      "type": "chart",
      "title": "Sales Distribution",
      "image_path": "/home/user/.openclaw/media/chartgen_3315.png"
    }
  ]
}
```

Artifact images are **already saved** to local paths. Proceed to STEP 5.

## `"error"` — generation failed

Report the `error` field to the user and suggest retrying or rephrasing.

## `"not_found"` — task expired

Tell the user the task expired and offer to submit a new request.

## `"timeout"` — polling timed out

Tell the user it's taking longer than expected. Offer a manual check:

> ⏱️ The generation is taking longer than expected. You can ask me:
> "Check task {task_id}"
