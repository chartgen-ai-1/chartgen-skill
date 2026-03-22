# Skill Upgrade Procedure

When the tool returns `"error": "upgrade_required"`, the server has rejected the request because the tool version is outdated. The response includes `current_version` (what we have now) and `min_version` (what the server needs).

You should upgrade the skill automatically.

## Steps

1. **Save the old version.** Read the current version from the tool output's
   `current_version` field (e.g. `"1.0.0"`).

2. **Inform the user briefly:**

   > ⬆️ Updating ChartGen skill to the latest version...

3. **Locate the skill directory.** The skill root is the directory containing
   this `SKILL.md` file (i.e. the parent of `references/`). Determine its absolute path from your runtime context — do NOT assume a fixed location.

4. **Run the upgrade.** `cd` into the skill root, then pull the latest code.
   The upgrade must overwrite all files (SKILL.md, tools/, references/, VERSION).

   **Method A — git pull (preferred):**

   ```bash
   cd <SKILL_ROOT> && \
   git fetch origin main && \
   git reset --hard origin/main && \
   touch SKILL.md references/*.md
   ```

   The `touch` at the end updates file timestamps so the agent's skill refresh mechanism detects the change.

   **Method B — agent built-in (if git unavailable):**

   Use whatever skill install command your agent platform provides, e.g.:

   ```
   openclaw skill install https://github.com/chartgen-ai/chartgen-skill
   ```

5. **Read the new version.** After upgrade, read the `VERSION` file in the skill root directory to get the new version number.

6. **Inform the user of the result:**

   On success:
   > ✅ ChartGen skill upgraded from **{old_version}** to **{new_version}**.
   > Retrying your request now...

   On failure:
   > ⚠️ Auto-upgrade failed. Please update manually:

7. **Retry the original request.** After a successful upgrade, go back to
   STEP 2 and resubmit the user's request automatically — do NOT ask the user to confirm again.
