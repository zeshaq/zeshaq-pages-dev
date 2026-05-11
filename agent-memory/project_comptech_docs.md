---
name: comptech platform docs section
description: A second content collection on the zahid blog at /docs/ — internal-style platform documentation for "comptech platform", with numbered-prefix folder ordering
type: project
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
The blog now has a second content collection beyond the `blog` posts: a **docs** collection mounted at `/docs/`.

- **URL:** https://zeshaq.pages.dev/docs/
- **Source folder:** `src/content/docs/`
- **Schema fields (per `src/content.config.ts`):** `title`, `description?`, `sidebar_label?`, `last_reviewed?`, `draft?` (no `category` — different from blog posts)
- **Size:** ~216 mdx files at last check (2026-05-10), organized into 9 top-level numbered sections

**Top-level structure** (numeric prefixes drive sort order via `stripPrefix` in `buildDocsTree`):

- `00-welcome.mdx`
- `01-foundations/` — platform overview, naming, network map, credential custody, glossary
- `02-lab-infrastructure/`
- `03-openshift-platform/` — fleet overview, platform-services subtree (cloudnative-pg, gatekeeper, open-liberty-operator, quay-on-cluster, etc.)
- `04-application-delivery/`
- `05-operations/` — overview, admin handoff, GitOps MR mechanics, known gotchas, on-call escalation
- `06-architecture-decisions/` — ADRs (ADR-0013 DefectDojo etc.)
- `07-references/` — endpoint tables, vault paths, DNS records, MinIO buckets, Nexus endpoints, glossary, etc.
- `08-history-and-replay/` — rebuild timeline, install failures, transition notes

**Why:** The user maintains this as the working documentation for an OpenShift-based platform ("comptech platform") — internal-style content, separate audience and tone from the public-facing `blog` posts. The blog has the opinionated technical writing; docs is the operational reference.

**How to apply:**
- **Don't conflate.** Blog posts go in `src/content/blog/*.mdx` with `category:` frontmatter. Platform docs go in `src/content/docs/<NN-section>/<NN-name>.mdx` with `sidebar_label?` and `last_reviewed?`.
- **Numbered-prefix convention.** Folder and file names use `NN-name` (e.g., `01-foundations`, `02-naming-conventions.mdx`). The prefix is stripped from the URL by `stripIdPrefixes` in `navTree.ts` and used only for sort order. **Preserve this convention** when adding new docs — don't drop the prefix or the sort order breaks.
- **Independent sidebar.** Docs uses a `buildDocsTree` function in `src/utils/navTree.ts` separate from the blog's `buildCategoryTree`. Don't merge them.
- **No `category` on docs.** The blog category metadata convention doesn't apply.

The home page also has a `Full-Platform` filter section on `src/pages/index.astro` for blog posts tagged `category: Full-Platform` — that's a separate convention, related to highlighting comptech-platform-adjacent blog posts on the home page.
