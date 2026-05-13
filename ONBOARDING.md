# Onboarding & Operations Manual

Welcome. This repo is the source of **https://zeshaq.pages.dev** — a personal blog plus platform docs, learning tracks, and an interactive whiteboard. This document is the entry point for anyone (human or AI agent) about to contribute.

Read this once end-to-end, then keep it open as a reference. When you finish a contribution, if you noticed something missing or wrong here, fix it in the same PR.

---

## Table of contents

1. [What this site is](#1-what-this-site-is)
2. [Audiences and roles](#2-audiences-and-roles)
3. [Getting access](#3-getting-access)
4. [Local setup (10-minute path)](#4-local-setup-10-minute-path)
5. [Repo tour](#5-repo-tour)
6. [Where content goes (blog vs docs vs learn)](#6-where-content-goes-blog-vs-docs-vs-learn)
7. [Authoring workflow](#7-authoring-workflow)
8. [Branching and PR policy](#8-branching-and-pr-policy)
9. [Writing conventions](#9-writing-conventions)
10. [Diagrams: use ReactFlow, never Mermaid](#10-diagrams-use-reactflow-never-mermaid)
11. [Common tasks (recipes)](#11-common-tasks-recipes)
12. [Deploy pipeline and verification](#12-deploy-pipeline-and-verification)
13. [Rollback and incident response](#13-rollback-and-incident-response)
14. [Security and secrets](#14-security-and-secrets)
15. [For AI agents specifically](#15-for-ai-agents-specifically)
16. [Ownership and where to ask](#16-ownership-and-where-to-ask)

---

## 1. What this site is

- **Live URL:** https://zeshaq.pages.dev
- **GitHub repo:** https://github.com/zeshaq/zeshaq-pages-dev (renamed from `zahid` on 2026-05-13)
- **Hosting:** Cloudflare Pages, project name `zeshaq`
- **Stack:** Astro 5 + MDX, React islands (`@xyflow/react` for diagrams), Tailwind v4
- **Deploy:** GitHub Actions → Wrangler → Cloudflare Pages, on every push to `main`

The site has four public surfaces:

| Surface | URL prefix | Purpose |
|---|---|---|
| Blog | `/blog/*` | Opinionated public technical writing |
| Docs (OpenShift Platform) | `/docs/openshift-platform/*` | Operating reference for the comptech OpenShift platform |
| Docs (BRAC POC) | `/docs/brac-poc/*` | POC deliverables for a customer engagement |
| Learn | `/learn/<track>/*` | Self-paced curriculum (Agentic AI, Cloudflare, ACM, Kubeflow, DevSecOps) |
| Whiteboard | `/whiteboard` | Interactive ReactFlow editor (personal tool, not a content surface) |

---

## 2. Audiences and roles

Two kinds of contributors work in this repo:

**Humans** — collaborators invited to draft posts, expand docs, fix typos, add diagrams. You will typically work on a feature branch and open a PR.

**AI agents** — Claude Code (or another assistant) instructed by the owner to draft, expand, or fix content. Agents push directly to `main` *only* when the owner has authorized that working style for a given session. Otherwise agents follow the same PR flow as humans.

Roles are not enforced by GitHub permissions alone — they're a social convention. If you are uncertain whether you should push directly or open a PR, **open a PR**. PRs are reversible; surprise main-branch pushes are not.

---

## 3. Getting access

1. **GitHub access.** Ask the owner (`@zeshaq`) to add you as a collaborator on `zeshaq/zeshaq-pages-dev`. Specify whether you need **Write** (for normal contributors) or **Admin** (rarely needed).
2. **Cloudflare access.** You do **not** need Cloudflare access to author content. The GitHub Actions workflow already has the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets it needs to deploy. Only ask for Cloudflare access if you're going to change DNS, Pages settings, or rotate tokens.
3. **AI agents.** Agents authenticate via the owner's `gh` CLI (already logged in on their machine). If you're spinning up an agent on a new machine, install `gh` and `gh auth login` first.

There is no internal Slack / chat for this project. Conversation happens in PR review and GitHub Issues.

---

## 4. Local setup (10-minute path)

Prerequisites: **Node 22** (the Actions workflow uses it; older versions may build but won't match CI), **git**, and `gh` (optional, but the deploy verification commands assume it).

```bash
git clone https://github.com/zeshaq/zeshaq-pages-dev.git
cd zeshaq-pages-dev
npm install
npm run dev
```

This serves the site at **http://localhost:4321**. Edits hot-reload.

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build + `pagefind` search index → `dist/` |
| `npm run preview` | Serve the production build locally |

**Always run `npm run build` before committing content.** Astro/MDX parse errors only surface at build time, not in dev. A broken build that lands on `main` means a failed Cloudflare deploy and a stale site for everyone else.

---

## 5. Repo tour

```
.
├── ONBOARDING.md                        ← you are here
├── CLAUDE.md                            ← AI-agent-specific operating manual (deeper conventions)
├── README.md                            ← short pointer
├── astro.config.mjs                     ← Astro config (MDX, React, sitemap, Tailwind v4)
├── package.json
├── public/
│   ├── _redirects                       ← Cloudflare Pages 301/302 rules
│   ├── og-default.svg                   ← default Open Graph image (1200×630)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content.config.ts                ← collection schemas (blog, docs, learn)
│   ├── content/
│   │   ├── blog/*.mdx                   ← flat list, category in frontmatter
│   │   ├── docs/openshift-platform/...  ← numbered NN-prefix sections
│   │   ├── docs/brac-poc/...            ← customer POC docs
│   │   └── learn/<track>/NN-*.mdx       ← numbered modules per track
│   ├── components/                      ← Astro + React components (Whiteboard, sidebars, search…)
│   ├── layouts/                         ← Layout / DocsLayout / LearnLayout / BareLayout
│   ├── pages/
│   │   ├── index.astro                  ← blog home
│   │   ├── blog/[...slug].astro
│   │   ├── docs/[...slug].astro
│   │   ├── learn/[...slug].astro        ← + learn/[track]/index.astro, learn/index.astro
│   │   ├── whiteboard.astro             ← /whiteboard
│   │   ├── rss.xml.js
│   │   └── 404.astro
│   ├── styles/global.css                ← all CSS; theme tokens at top
│   └── utils/
│       ├── navTree.ts                   ← sidebar tree builders
│       └── tracks.ts                    ← learn track titles + taglines
├── agent-memory/                        ← in-repo notes for AI agents (writing voice, MDX gotchas)
└── .github/workflows/deploy.yml         ← GitHub Actions → Wrangler → Cloudflare Pages
```

For a deeper architectural tour and rationale (why ReactFlow over Mermaid, why the docs/brac-poc folding, etc.), read **CLAUDE.md** — it's the canonical conventions doc.

---

## 6. Where content goes (blog vs docs vs learn)

Picking the right collection matters more than picking the right filename. Use this rubric:

| If you're writing… | Put it in… | Frontmatter required |
|---|---|---|
| A standalone, opinionated technical post for a general technical audience | `src/content/blog/<slug>.mdx` | `title`, `date`, `category?`, `description?` |
| Operating reference for the comptech OpenShift platform (runbooks, ADRs, infra references) | `src/content/docs/openshift-platform/<NN-section>/<NN-page>.mdx` | `title`, `description?`, `sidebar_label?`, `last_reviewed?` |
| Customer engagement POC docs (BRAC Bank) | `src/content/docs/brac-poc/<NN-page>.mdx` | Same as docs |
| A self-paced learning module that's part of a sequenced track | `src/content/learn/<track>/<NN-module>.mdx` | `title`, `sidebar_label?`, `description?`, `estimated_minutes?`, `last_updated?` |

**Schema reference:** `src/content.config.ts`.

### Blog categories

Categories are free-form strings declared in post frontmatter (`category: OPENSHIFT`). The sidebar groups by category automatically — no code change required. Use **ALL CAPS** for consistency. Current categories include: `AI`, `DATA`, `IDENTITY`, `INTEGRATION`, `OBSERVABILITY`, `OPENSHIFT`, `SECURITY`, `WORKFLOWS`. Uncategorized posts fall to a flat list at the bottom.

### Numbered prefixes for docs and learn

Folder and file names use `NN-name` (e.g., `01-foundations`, `02-naming-conventions.mdx`). The number drives sort order and is stripped from the URL. **Preserve the convention** when adding new content — leaving a gap is fine (`01`, `02`, `05` works), but skipping the prefix entirely breaks ordering.

---

## 7. Authoring workflow

Whether you're writing a blog post, a doc, or a learning module, the loop is the same:

1. **Create a branch** (see [§8 Branching policy](#8-branching-and-pr-policy)).
2. **Write the file.** Use the right collection (see §6) and the right frontmatter.
3. **Preview locally.** `npm run dev` and navigate to the page. Check that the sidebar entry appears in the expected position.
4. **Build locally.** `npm run build`. MDX parse errors surface here, not in dev.
5. **Commit.** Use a short, conventional-style subject. Examples from history:
   - `Add post: <title>`
   - `docs(learn/devsecops): add process-flow diagram to overview module`
   - `learn: DevSecOps track — modules 03/04/05 (SAST/SCA/secrets, container security, supply chain)`
   - `fix(learn/kubeflow): correct module 05 → 06 forward-link`
6. **Push and open a PR** (or push to main if you're authorized — see §8).
7. **Verify deploy.** After merge to `main`, watch the GitHub Actions run complete and curl the page (see §12).

---

## 8. Branching and PR policy

**Recommended default — feature branch + PR:**

```bash
git checkout -b post/your-slug      # or docs/...  or learn/...  or fix/...
# … work …
git push -u origin post/your-slug
gh pr create --fill                 # or open via the GitHub UI
```

After review, squash-merge to `main`. The deploy workflow runs on the merge commit.

**Direct push to main is acceptable when:**

- You are the repo owner (`@zeshaq`).
- You are an AI agent the owner has explicitly authorized to push directly for this session — see `agent-memory/feedback_always_push_posts.md`. This is a working convention for the owner's own assistant; it is **not** the default for collaborators.
- You are making a trivial fix the owner has greenlit by name (e.g., "yes, just push the typo fix").

**Never:**

- `--force-push` to `main`.
- `--no-verify` to skip hooks.
- Commit with `git config` overrides.
- Delete `main` or rewrite its history.

If a PR's deploy preview breaks the site (CSS regression, broken page), revert the PR rather than ship a follow-up fix on top. See [§13 Rollback](#13-rollback-and-incident-response).

---

## 9. Writing conventions

The full writing-voice template for **blog posts** is captured in `agent-memory/feedback_post_voice.md` and summarized in `CLAUDE.md` §5. The short version:

**Post structure** (blog posts only — docs and learn modules are reference-style):

1. One-paragraph open framing *what it is and what it isn't*.
2. Problem statement — specific failure modes, not abstract benefits.
3. Architecture / model diagram, immediately followed by a "Reading the diagram:" bullet list.
4. Capability / component table, ordered by frequency of use.
5. "Closer look" subsection on the actual differentiator.
6. Limitations and pitfalls — concrete and opinionated.
7. Landscape comparison — competitors with one-line descriptions.
8. "Where to start" — numbered sequence ending in a trap to avoid.

**Voice rules:**

- Opinionated and specific. "The mistake to avoid is X" beats "consider X."
- Concrete naming over generic. "A 9.8 CVE in an image deployed once" beats "a critical vulnerability."
- Tables for comparison, not bullet lists.
- Paragraphs under ~5 sentences; full-width layout makes denser prose uncomfortable.
- Length: 1000–1400 words for a standard post.

**Don't:**

- Open with "In today's cloud-native landscape" or similar marketing language.
- Use *leverage*, *robust*, *enable*, or other meeting-room verbs.
- Write feature lists without ranking by importance.
- Include code blocks larger than ~10 lines unless they're load-bearing.

For **docs** and **learn modules**, the tone is operational rather than opinionated — reference, runbook, step-by-step.

---

## 10. Diagrams: use ReactFlow, never Mermaid

This is a hard rule. **Do not use the `<Mermaid>` component.** The conversion to ReactFlow (`<Whiteboard>`) was deliberate; Mermaid had rendering inconsistencies. The Mermaid component still exists in the tree but is unused — leave it that way.

Pattern for any diagram:

```mdx
import Whiteboard from "../../components/Whiteboard";

export const stage = { background: "#fafafa", border: "1px solid #9ca3af", borderRadius: 8, padding: 8, color: "#1f2937", width: 150, textAlign: "center", fontSize: 12 };
export const ctrl  = { background: "#e5e7eb", border: "1px solid #6b7280", borderRadius: 8, padding: 10, color: "#1f2937", width: 170, textAlign: "center", fontWeight: 600, fontSize: 12 };

export const nodes = [
  { id: "a", position: { x: 0,   y: 0 }, data: { label: "A" }, style: stage },
  { id: "b", position: { x: 220, y: 0 }, data: { label: "B" }, style: ctrl  },
];
export const edges = [
  { id: "ab", source: "a", target: "b", style: { stroke: "#1f2937" } },
];

<Whiteboard client:load data={{ nodes, edges }} height={500} />
```

**Edge convention** (consistent visual language across the site):

| Edge style | Meaning |
|---|---|
| Solid black `#1f2937` | Request path / data flow |
| Dashed green animated `#15803d` | Spoke-initiated / agent / pull connection |
| Dashed grey `#6b7280` | Telemetry / observability / metadata |
| Dashed red `#b91c1c` | Attack traffic / blocked path |

**Style guardrails:**

- **No `<MiniMap>`.** Standing preference — keep `Background` and `Controls` only.
- **`fontSize: 12`** is the floor for node labels.
- **No `//` line comments inside `export const ...` arrays.** MDX's parser rejects them with a `Unexpected content after expression` error. Use no comments, or `/* ... */` block comments above the array.
- **Escape `<digit` in prose.** `<200ms` trips MDX's JSX parser — write `&lt;200ms` or wrap in backticks.

For radial / mind-map diagrams, copy the `mkBranch()` helper from `src/content/blog/agentic-ai-mcp.mdx` or `openshift-ai-mindmap.mdx`.

---

## 11. Common tasks (recipes)

### Add a blog post

1. Create `src/content/blog/<slug>.mdx`.
2. Frontmatter:
   ```yaml
   ---
   title: "Post title"
   description: "One-line description for OG + sidebar."
   date: 2026-MM-DD
   category: OPENSHIFT
   ---
   ```
3. Follow the voice template from §9.
4. Build, commit on a branch, open a PR.

### Add a doc page (OpenShift platform)

1. Pick the right section under `src/content/docs/openshift-platform/<NN-section>/`.
2. Create `NN-page-name.mdx` using the next number.
3. Frontmatter:
   ```yaml
   ---
   title: "Page title"
   sidebar_label: "Optional shorter label"
   description: "..."
   last_reviewed: 2026-MM-DD
   ---
   ```
4. Build, commit, PR.

### Add a learning module

1. Pick a track under `src/content/learn/<track>/`.
2. Create `NN-module-name.mdx` with the next number.
3. Frontmatter:
   ```yaml
   ---
   title: "Module title"
   sidebar_label: "NN — Short label"
   description: "..."
   estimated_minutes: 45
   last_updated: 2026-MM-DD
   ---
   ```
4. End the module body with a "Next: Module N+1" link to the next module.
5. Build, commit, PR.

### Add a new learning track

1. Create `src/content/learn/<track-id>/` and drop `00-overview.mdx`, `01-...`, etc.
2. Register the track in `src/utils/tracks.ts` (`TRACK_TITLES` + `TRACK_TAGLINES`).
3. The `/learn` index and sidebar pick it up automatically.
4. Build, commit, PR.

### Fix a typo or broken link

Branch name `fix/<slug>-<what>`, single-file commit, PR with `Fixes #<issue>` if applicable.

### Write a Blog ADR (architectural decision)

If you're making a non-trivial structural change to the blog (new collection, new layout convention, new routing model), document it as an ADR:

1. Create `src/content/docs/openshift-platform/06-architecture-decisions/12-blog/NN-adr-NNNN-name.mdx`.
2. Sections: **Status / Context / Decision / Consequences / Alternatives / Related**.
3. Update the index at `12-blog/00-overview.mdx`.
4. Also update `ONBOARDING.md` and `CLAUDE.md` if the change affects how contributors work.

---

## 12. Deploy pipeline and verification

```
push to main
  → .github/workflows/deploy.yml
    → npm ci
    → npm run build (Astro + pagefind)
    → cloudflare/wrangler-action@v3 pages deploy dist --project-name=zeshaq --branch=main
      → Cloudflare Pages publishes to zeshaq.pages.dev
```

The whole pipeline runs in ~1–2 minutes.

**Verification commands after a merge:**

```bash
gh run list --repo zeshaq/zeshaq-pages-dev --branch main --limit 3
gh run watch <run-id> --repo zeshaq/zeshaq-pages-dev --exit-status
curl -I https://zeshaq.pages.dev/blog/<your-slug>/
```

Expect `HTTP/2 200`. Cloudflare's edge cache propagates within ~30s of the Action completing.

**Deploy secrets** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) live on the repo, not on individual workflows. They survive repo renames. You don't need to touch them unless they're being rotated.

---

## 13. Rollback and incident response

**The site is broken on production. What now?**

1. **Identify the bad commit.** `git log origin/main --oneline -10`.
2. **Revert it.** `git revert <sha>` on `main` (or via PR if you'd rather have review). Push.
3. **Watch the deploy.** A revert push triggers a fresh build; the previous good state is back at the edge in ~2 minutes.

Do **not** try to fix forward by stacking patches on a broken `main`. Revert first, fix in a branch, re-merge clean.

**The Actions build is failing but nothing seems wrong locally.**

- Confirm Node version locally matches CI (`node --version` against `.github/workflows/deploy.yml`).
- Delete `node_modules/` and `package-lock.json` is checked in; reinstall with `npm ci` (the same command CI runs).
- Read the Actions log for the actual error before guessing.

**Cloudflare Pages is failing to publish but the build is green.**

- Check the wrangler-action step's log. Most common cause: `CLOUDFLARE_API_TOKEN` expired. Get a new one via the Cloudflare dashboard (token needs `Cloudflare Pages: Edit` permission on the account) and update the GitHub repo secret.

**Old Cloudflare deployments stay viewable** in the Pages dashboard under the `zeshaq` project. You can also "promote" a previous deployment back to production from there if reverting via git is too slow.

---

## 14. Security and secrets

- **Never commit a secret.** Tokens, API keys, kubeconfigs, full Secret manifests, internal-only IPs. If you accidentally commit one, rotate it immediately — git history is durable and the repo is public.
- **Deploy secrets** live as GitHub repo secrets. Read them in workflows via `${{ secrets.NAME }}`; don't echo them into logs.
- **The blog is public.** Anything you write here is on the public internet. Redact lab-internal endpoints, role mappings, or anything an operator would not want publicly tied to their infrastructure.
- **For docs containing live system references**, add `last_reviewed: YYYY-MM-DD` in frontmatter so readers know how stale the page is.

---

## 15. For AI agents specifically

If you are an AI agent reading this, your **mandatory next read is `CLAUDE.md`** at the repo root. It captures conventions in more detail and lists the standing user preferences with their rationale.

Also read `agent-memory/MEMORY.md` and the linked files. Those are the agent-side memory notes — they capture preferences like "no Mermaid", "always push after writing a post", "no `<MiniMap>`", and the post-voice template. Treat them as binding.

Notes specific to agents:

- **Push policy.** The owner's own assistant pushes directly to `main` after writing a post (see `agent-memory/feedback_always_push_posts.md`). An agent acting on behalf of a guest contributor should default to the PR flow unless the owner has explicitly authorized direct push for that session.
- **Build before pushing.** Run `npm run build` to catch MDX parse errors. A broken build means a broken deploy.
- **Update memory.** When the user expresses a new preference that's likely to recur, save it as a new memory file under `agent-memory/` and link it from `agent-memory/MEMORY.md`.
- **Update this manual and CLAUDE.md** if a convention changes structurally. Out-of-date instructions cause regressions in the next session.

---

## 16. Ownership and where to ask

- **Repo owner:** Zahid (`@zeshaq`, zeshaq@gmail.com).
- **Questions or proposals:** open a GitHub Issue on `zeshaq/zeshaq-pages-dev`. PR review conversation works for change-specific questions.
- **Live site status:** Cloudflare Pages dashboard → `zeshaq` project.
- **Build status:** GitHub Actions tab on the repo.

If you find this manual unclear, contradictory, or out of date — fix it in your next PR. This file is canonical; out-of-date instructions cost everyone time.
