# Skill Upgrade Procedure

When the tool returns `"error": "upgrade_required"`, the tool version is outdated.
The response includes `current_version` and `min_version`.

## Steps

1. **Locate the skill root** — the directory containing `SKILL.md`. Determine
   its absolute path from your runtime context (do NOT assume a fixed location).

2. **Check if it's a git repo** — run `git -C <SKILL_ROOT> rev-parse --is-inside-work-tree`.

---

### Path A — Git repo (auto-upgrade)

If the skill directory is a git repository:

1. Inform the user: `⬆️ Updating ChartGen skill...`
2. Run:
   ```bash
   cd <SKILL_ROOT> && git fetch origin main && git reset --hard origin/main && touch SKILL.md references/*.md
   ```
3. Read new version: `npx tsx tools/chartgen_api.ts version`
4. Inform the user:
   > ✅ ChartGen skill upgraded from **{old}** to **{new}**. Retrying now...
5. If upgrade fails, inform user and **stop** — do not retry.
6. On success, go back to STEP 2 and resubmit automatically (no re-confirmation needed).

---

### Path B — Not a git repo (manual upgrade)

If the skill directory is NOT a git repository, tell the user to update manually
(adapt to their language):

> ⚠️ ChartGen skill version **{current_version}** is outdated 
> Please update the skill:
> - ClawHub: search "chartgen" and reinstall
> - Or: `openclaw skill install https://github.com/chartgen-ai/chartgen-skill`

**Stop here** — do not retry or continue the task.
