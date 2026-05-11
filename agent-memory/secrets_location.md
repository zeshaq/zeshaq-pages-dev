---
name: local secrets directory
description: Where the user keeps API tokens and credentials on this Mac, with the file naming convention
type: reference
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
Tokens live in `/Users/ze/Desktop/mysecrets/` as plain text files (one secret per file). Known files as of 2026-05-10:

- `cloud-flare-token` — Cloudflare API token (starts with `cfut_`)
- `github_token` — GitHub PAT (starts with `ghp_`)
- `gitlab-md-pat` — GitLab personal access token
- `openai-api-key` — OpenAI API key
- `redhat-offline-token` — Red Hat offline token
- `redhat-pull-secret.json` — Red Hat container pull secret
- `rhel-activation-org` — RHEL activation org info
- `ssh-keys.txt` — SSH key notes

When the user says "my X token is in mysecrets," read the matching file here. Don't echo token values back into chat or commit them — pass them as env vars or repo secrets.
