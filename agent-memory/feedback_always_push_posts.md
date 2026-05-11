---
name: Always push after writing a post
description: For the zahid blog (zeshaq-pages-dev), after writing/expanding a blog post always commit and push it without waiting to be asked
type: feedback
originSessionId: e5c8cfa6-8d55-47b1-8d94-01389d3ac4b9
---
After writing or substantially expanding a blog post in this repo, commit and push automatically — don't stop at "file written" and wait to be asked.

**Why:** The user gets frustrated having to follow up with "did you push it" each time. The post isn't useful until it's deployed via Cloudflare Pages, and the deploy is triggered by pushing to main.

**How to apply:**
- After Write/Edit completes for any new post under `src/content/blog/`, run the commit+push sequence.
- Standard sequence: `git status` + `git diff` (in parallel) → `git add <files>` + `git commit` → `git push`.
- Commit message style: match existing repo style (`Add post: <title fragment>` for new posts, descriptive for edits).
- Push to `main` (the deploy branch).
- Same applies for substantial expansions/rewrites of existing posts.
- Do NOT skip the push for trivial fixes the user explicitly says are WIP, but otherwise default to pushing.
