# STEP 5 — Deliver Results to User

## 5a. Show the Analysis Report

Display the `text_reply` from the result to the user. This is the full analysis
report in Markdown format — present it directly.

## 5b. Send Artifact Images

For each artifact in the `artifacts` array:

- If it has `image_path`: send the image to the user via `message send`
  with `filePath` set to the `image_path` value. Use the artifact `title`
  as the caption.
- If it has `download_url` instead: provide the download link.
- If type is `"ppt"` with `raw_data`: inform the user a PPT was generated.

## 5c. Provide the Edit Link

The tool returns a ready-to-use `edit_url` in the result JSON. Show it to the
user (in their language):

> 🔗 Click the link below to further edit this chart on ChartGen:
> {edit_url}

## 5d. Send HTML Content (if available)

If the result JSON contains `html_content`, the current channel supports inline
HTML rendering. In that case, send the `html_content` as an HTML message —
it already contains the analysis text and images in a mobile-optimized layout.

When `html_content` is present, you may skip 5a and 5b (text_reply + separate
images) since the HTML already includes both. Still provide the `edit_url` and
the next-steps suggestion as separate messages.

If `html_content` is absent, deliver results normally via 5a + 5b.

## 5e. Offer Next Steps

After delivering results, suggest (in the user's language):

> You can ask me to generate another visualization — just describe what you need!
