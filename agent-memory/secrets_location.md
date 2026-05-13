---
name: local secrets directory
description: Where the user keeps API tokens and credentials on local machines, with file naming conventions
type: reference
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
On the Linux lab host, tokens live in `/home/ze/secrets/` as plain text or JSON files. Known files as of 2026-05-13:

- `/home/ze/secrets/cloudflare-token` — Cloudflare API token.
- `/home/ze/secrets/github-token` — GitHub PAT.
- `/home/ze/secrets/cloudflare-access-zeshaq-docs-service-token.json` — Cloudflare Access service token for `zeshaq.pages.dev/docs`; use `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers from this JSON for protected docs access.
- `/home/ze/secrets/security-lab/credentials.md` — security lab credentials.
- `/home/ze/secrets/security-lab/wazuh-passwords.txt` — generated Wazuh service passwords.

On the older Mac environment, tokens lived in `/Users/ze/Desktop/mysecrets/` as plain text files (one secret per file). Known files as of 2026-05-10:

- `cloud-flare-token` — Cloudflare API token (starts with `cfut_`)
- `github_token` — GitHub PAT (starts with `ghp_`)
- `gitlab-md-pat` — GitLab personal access token
- `openai-api-key` — OpenAI API key
- `redhat-offline-token` — Red Hat offline token
- `redhat-pull-secret.json` — Red Hat container pull secret
- `rhel-activation-org` — RHEL activation org info
- `ssh-keys.txt` — SSH key notes

When the user says "my X token is in mysecrets" or "in /home/ze/secrets," read the matching file locally. Don't echo token values back into chat or commit them — pass them as env vars, headers, or repo secrets.
