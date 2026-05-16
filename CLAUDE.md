# CLAUDE.md — operating manual for `zeshaq/zahid`

This file is for the **next AI agent** working on this repository. It captures the conventions, structure, and load-bearing decisions that aren't obvious from the code alone. Read this first; the per-session memory files under `~/.claude/projects/.../memory/` cover user preferences (which are also referenced from here).

---

## 1. What this repo is

- **Public blog + docs + learning tracks** at `https://zeshaq.pages.dev`.
- Built with **Astro 5**, **MDX**, **React islands** (`@xyflow/react` for diagrams), **Tailwind v4**, hosted on **Cloudflare Pages** via a GitHub Actions workflow.
- The author is **Zahid** (`zeshaq@gmail.com`, GH handle `zeshaq`). The CF project is named `zeshaq` because `zahid.pages.dev` was globally taken at the time of creation — see [Blog ADR 0001](src/content/docs/openshift-platform/06-architecture-decisions/12-blog/01-adr-0001-multi-collection-content-model.mdx) and the `project_zahid_blog.md` memory.
- The site has three audiences, served by three content collections:
  - **Blog posts** (`/blog/*`) — opinionated technical writing for the public.
  - **Docs** (`/docs/*`) — long-form documentation, organised into **modules**. Today: `openshift-platform`, `brac-poc`, `greenfield-ocp-deployment`, `security-lab`. Each module has its own landing page, scoped sidebar, breadcrumb, and TOC.
  - **Learning tracks** (`/learn/<track>/<module>`) — self-paced curriculum. Tracks are listed in `src/utils/tracks.ts`; today: `agentic-ai`, `aci-simulator`, `acm-multicluster`, `cloudflare`, `data-science`, `devsecops`, `kubeflow`, `openliberty`.
- Plus a `/whiteboard` interactive editor, a `/rss.xml` feed, and site-wide search via Pagefind (`⌘K` anywhere, or the search icon in any sidebar).

## 2. Deploy + push workflow

- `main` is the deployable branch. Every push triggers `.github/workflows/deploy.yml`, which builds with Astro and pushes the `dist/` to Cloudflare Pages via `cloudflare/wrangler-action@v3`.
- **Always commit and push after writing or expanding content.** This is enforced by user preference (`feedback_always_push_posts.md`). Don't ask "should I push?" — just push.
- The push sequence I use:
  1. `npm run build` to catch parse errors locally.
  2. `git fetch origin && git rebase origin/main` — the user often makes parallel edits; rebase is mandatory or pushes get rejected.
  3. `git add -A && git commit -m "..."` (use heredoc for multi-paragraph messages).
  4. `git push`.
  5. `gh run watch <id>` to confirm deploy.
- Don't bypass hooks. Don't `--force-push`. Don't change git config.

## 3. Repository layout

```
.
├── CLAUDE.md                            ← you are here
├── README.md
├── astro.config.mjs                     ← sitemap, MDX, React, Tailwind v4
├── package.json
├── public/
│   ├── og-default.svg                   ← shared OG image
│   ├── favicon.svg
│   └── robots.txt                       ← allows all + sitemap pointer
├── src/
│   ├── content.config.ts                ← three collections: blog, docs, learn
│   ├── content/
│   │   ├── blog/*.mdx                   ← posts (flat, category in frontmatter)
│   │   ├── docs/<module>/...            ← docs modules; each top-level folder is a module (openshift-platform, brac-poc, greenfield-ocp-deployment, security-lab)
│   │   └── learn/<track>/NN-*.mdx       ← learn modules, numbered for sort
│   ├── components/
│   │   ├── Whiteboard.tsx               ← ReactFlow viewer (NO minimap)
│   │   ├── WhiteboardEditor.tsx         ← /whiteboard interactive editor
│   │   ├── ShapeNode.tsx                ← custom node for editor + viewer
│   │   ├── InteractiveDiagram.tsx       ← inline interactive ReactFlow island for MDX
│   │   ├── DrawioEmbed.astro            ← embed for draw.io diagrams
│   │   ├── CodeCopyButtons.astro        ← copy-to-clipboard buttons on code blocks
│   │   ├── NavNode.astro                ← recursive sidebar tree renderer
│   │   ├── Sidebar.astro                ← blog sidebar (with category groups)
│   │   ├── DocsSidebar.astro            ← docs sidebar (module-aware: scopes the tree when inside a module)
│   │   ├── LearnSidebar.astro           ← learn sidebar (with track back-link)
│   │   ├── SectionNav.astro             ← cross-section icon row (Learn / Docs / Whiteboard / Search) atop every sidebar
│   │   ├── Search.astro                 ← Pagefind modal + ⌘K trigger
│   │   └── DocsTocNode.astro            ← reused by docs + learn TOC pages
│   ├── layouts/
│   │   ├── Layout.astro                 ← blog post + home layout
│   │   ├── DocsLayout.astro             ← docs layout (used by master + every module page)
│   │   ├── LearnLayout.astro            ← learn layout
│   │   └── BareLayout.astro             ← whiteboard (full-window, no sidebar)
│   ├── pages/
│   │   ├── index.astro                  ← blog home (lists posts)
│   │   ├── whiteboard.astro             ← /whiteboard
│   │   ├── rss.xml.js                   ← RSS feed
│   │   ├── blog/[...slug].astro
│   │   ├── docs/index.astro             ← /docs — master landing (module cards)
│   │   ├── docs/<module>/index.astro    ← /docs/<module>/ — module landing (breadcrumb + "Start here" + sections TOC)
│   │   ├── docs/[...slug].astro         ← /docs/<module>/... — page content
│   │   ├── learn/index.astro            ← /learn — track cards
│   │   ├── learn/[track]/index.astro    ← /learn/<track>/ — per-track TOC
│   │   └── learn/[...slug].astro        ← /learn/<track>/<module> — content
│   ├── styles/
│   │   └── global.css                   ← all CSS lives here; theme tokens at top
│   └── utils/
│       ├── navTree.ts                   ← buildTree, buildDocsTree, buildModuleTree, buildLearnTree, buildCategoryTree
│       ├── docModules.ts                ← MODULE_TITLES + MODULE_TAGLINES + parseDocsPath (source of truth for docs modules)
│       └── tracks.ts                    ← TRACK_TITLES + TRACK_TAGLINES + parseLearnPath
├── .github/workflows/deploy.yml
└── memory/                              ← (lives outside repo, in ~/.claude/...)
```

## 4. Content collections

Defined in `src/content.config.ts`.

### blog

- URL: `/blog/<slug>` (flat, slug = filename without `.mdx`).
- Schema: `title`, `description?`, `date` (required), `draft?`, **`category?`** (ALL CAPS).
- Sidebar groups by `category` via `buildCategoryTree`.
- Posts are dated; `category` is the primary navigation axis.
- Current categories: **AI, DATA, IDENTITY, INTEGRATION, OBSERVABILITY, OPENSHIFT, SECURITY, WORKFLOWS**.
- Posts without a `category` fall to a flat list at the bottom of the sidebar.

### docs

- URL: `/docs/<module>/<stripped-slug>` (numeric prefixes stripped from each path segment).
- Schema: `title`, `description?`, `sidebar_label?`, `last_reviewed?`, `draft?`.
- Every top-level folder under `src/content/docs/` is a **module** — a first-class section with its own landing page, scoped sidebar, breadcrumb, and TOC. Current modules:
  - `openshift-platform/` — operating manual for the comptech OpenShift platform (foundations, lab-infrastructure, fleet topology, GitOps, image supply, security, backup, ADRs).
  - `brac-poc/` — BRAC Bank engagement POC docs (eight-panel SPA, payment microservice, jboss-chat, demo scope).
  - `greenfield-ocp-deployment/` — source-of-truth guide for building a greenfield OpenShift platform with GitOps, VM provisioning, DNS, edge, registry, CI, observability.
  - `security-lab/` — private security/networking lab notes (Cisco NX-OS fabric track, SIEM, vuln mgmt, EVE-NG, NetApp/StorageGRID roadmaps).
- Module display titles and taglines live in `src/utils/docModules.ts` (`MODULE_TITLES`, `MODULE_TAGLINES`). That file is the source of truth for which modules render on the master `/docs/` landing.
- Numeric prefixes (`NN-`) drive sort order; they're stripped from URLs by `stripIdPrefixes` in `navTree.ts`. Folder hierarchy inside a module is preserved (e.g., `openshift-platform/06-architecture-decisions/03-adr-0001-cluster-list.mdx` → `/docs/openshift-platform/architecture-decisions/adr-0001-cluster-list`).
- Three-level navigation, mirroring `/learn`:
  1. `/docs/` — module cards.
  2. `/docs/<module>/` — per-module landing (breadcrumb, "Start here", sections TOC).
  3. `/docs/<module>/...` — page content.
- The `DocsSidebar` is module-aware: when the current URL is under `/docs/<module>/...` it scopes the tree to that module via `buildModuleTree()` and shows a "← back to all documentation" link.
- Blog-specific ADRs live under the openshift-platform module at `src/content/docs/openshift-platform/06-architecture-decisions/12-blog/`.

### learn

- URL: `/learn/<track>/<stripped-module-slug>`.
- Schema: `title`, `description?`, `sidebar_label?`, `track?`, `estimated_minutes?`, `prereqs?`, `last_updated?`, `draft?`.
- Top-level folders are tracks; files inside are numbered modules. Current tracks: `agentic-ai`, `aci-simulator`, `acm-multicluster`, `cloudflare`, `data-science`, `devsecops`, `kubeflow`, `openliberty`.
- Three-level navigation:
  1. `/learn/` — track cards.
  2. `/learn/<track>/` — per-track TOC.
  3. `/learn/<track>/<module>` — module content.
- Track display titles + taglines live in `src/utils/tracks.ts` (`TRACK_TITLES`, `TRACK_TAGLINES`). That file is the source of truth for which tracks render on the master `/learn/` landing.

### brac-poc (history)

The standalone `brac-poc` content collection (Blog ADR 0006) was **retired**, then the docs were absorbed as a first-class **module** under the `docs` collection at `src/content/docs/brac-poc/`, reachable at `/docs/brac-poc/...`. Old `/brac-poc/*` URLs are 301-redirected via `public/_redirects`. See [Blog ADR 0007](src/content/docs/openshift-platform/06-architecture-decisions/12-blog/07-adr-0007-docs-master-section.mdx) for the rationale; [Blog ADR 0006](src/content/docs/openshift-platform/06-architecture-decisions/12-blog/06-adr-0006-brac-poc-collection.mdx) is marked superseded.

## 5. Voice / writing style

Captured in the `feedback_post_voice.md` memory. Summary:

### Post structure (for blog posts)

1. **One-paragraph opening** that frames *what it is and what it isn't*.
2. **Problem statement** — specific failure modes of the prior status quo, not abstract benefits.
3. **Architecture / model diagram** — ReactFlow only (no mermaid), with a short "Reading the diagram:" bullet list immediately after.
4. **Capability / component table** — ordered by frequency-of-use, not alphabetically.
5. **A "closer look" subsection** on the genuinely differentiated piece.
6. **Limitations and pitfalls** — concrete, named, opinionated.
7. **Landscape comparison** — competitors with one-line descriptions.
8. **Where to start** — numbered sequence ending in a trap to avoid.

### Voice

- **Opinionated and specific.** "The mistake to avoid is X" beats "consider X."
- **Concrete naming** over generic. "A 9.8 CVE in an image deployed once" beats "a critical vulnerability."
- **Soft callouts** to past incidents and named tools (e.g., "XZ Utils backdoor of early 2024").
- **Tables for comparison**, not bullet lists.
- **Cross-link related posts** with `[the X post](/blog/x)` rather than restating prerequisites.
- **Paragraphs under ~5 sentences.** Full-width layout means dense prose is uncomfortable.
- **Length**: 1000–1400 words for a standard post. 1500–2000 for a "wide introduction" post. Anything past 2500 drags.

### Don't

- Open with "In today's cloud-native landscape" or similar marketing-prose phrases.
- Use "leverage," "robust," "enable," or other meeting-room verbs.
- Write feature lists without ordering them by importance.
- Include code blocks larger than ~10 lines unless they're load-bearing for the point.

## 6. Diagrams

### Use only ReactFlow

- **Never use Mermaid.** Captured as `feedback_no_mermaid.md`. The `<Mermaid>` component has been removed from the repo; do not reintroduce it. All previous mermaid was converted to ReactFlow.
- Use the `<Whiteboard>` component from `src/components/Whiteboard.tsx`. It auto-includes pan, zoom, fullscreen — and **no MiniMap** (captured as `feedback_no_minimap.md`).

### Style primitives (per-post `export const`)

Standard style objects used across the blog. Copy these into the top of any MDX with a diagram:

```ts
// Generic, white-ish node — for end-state things (apps, files, users).
export const stage = {
  background: "#fafafa", border: "1px solid #9ca3af",
  borderRadius: 8, padding: 8, color: "#1f2937",
  width: 150, textAlign: "center", fontSize: 12,
};

// Bold grey node — for control-plane components.
export const ctrl = {
  background: "#e5e7eb", border: "1px solid #6b7280",
  borderRadius: 8, padding: 10, color: "#1f2937",
  width: 170, textAlign: "center", fontWeight: 600, fontSize: 12,
};

// Dashed-green node — for spoke-initiated agents / sensors / hosted-on-spoke items.
export const agent = {
  background: "#fafafa", border: "1.5px dashed #15803d",
  borderRadius: 8, padding: 10, color: "#1f2937",
  width: 150, textAlign: "center", fontSize: 12,
};

// Dashed-grey node — for external systems (cloud APIs, third-party services).
export const ext = {
  background: "#fafafa", border: "1.5px dashed #9ca3af",
  borderRadius: 8, padding: 8, color: "#1f2937",
  width: 140, textAlign: "center", fontSize: 12,
};

// Dark-green bordered — used as cluster headers in mind maps.
export const branchHeader = {
  background: "#0c1812", border: "1px solid #15803d",
  borderRadius: 10, padding: 10, color: "#ffffff",
  width: 200, textAlign: "center",
  fontWeight: 700, fontSize: 12,
  letterSpacing: "0.03em", textTransform: "uppercase",
};
```

### Edge conventions

- **Solid black** (`stroke: "#1f2937"`) = request path / data flow.
- **Dashed green animated** (`stroke: "#15803d", strokeDasharray: "5,5", animated: true`) = spoke-initiated pull, agent connection, MCP/RPC, anything where the inside reaches out to the outside.
- **Dashed grey** (`stroke: "#6b7280"`) = telemetry, observability, metadata flow.
- **Dashed red** (`stroke: "#b91c1c"`) = attack traffic / blocked / DDoS-style.

### Mind-map helper

For radial diagrams, copy the `mkBranch()` helper used in many posts (see `src/content/blog/agentic-ai-mcp.mdx` or `openshift-ai-mindmap.mdx`). It positions branches at compass angles around a center, with leaves fanning outward in two columns. Critical parameters: `R_HEADER ≈ 380`, `FORWARD_STEP ≈ 170`, `PERP_OFFSET ≈ 95`. Smaller `FORWARD_STEP` causes label overlap on east/west branches.

### MDX gotchas with diagrams

- **No JS `//` comments inside `export const ...Nodes = [ ... ]`** — captured as `feedback_mdx_no_js_comments.md`. MDX's parser treats `//` as invalid expression syntax. Use no comments, or write them as `/* ... */` in JS blocks above the array.
- **Escape `<digit` patterns** in prose as `&lt;`. `<200ms`, `<1s`, `<10M` all trip MDX's JSX parser.
- **Escape literal `{...}` in prose** as `\{...\}` or wrap in backticks (`` `{...}` ``). The braces look like JSX expressions.
- **`fontSize: 12`** is the floor for node labels — smaller becomes unreadable on fullscreen.

## 7. Common tasks (recipes)

### Add a blog post

1. Create `src/content/blog/<slug>.mdx`.
2. Frontmatter:
   ```yaml
   ---
   title: "Post title"
   description: "One-line description for OG + sidebar."
   date: 2026-MM-DD
   category: OPENSHIFT          # or another existing category in ALL CAPS
   ---
   ```
3. If the post needs a diagram, import `Whiteboard` and write `export const` blocks at the top.
4. Follow the voice template from §5.
5. Build (`npm run build`), commit, push.

### Add a docs page

1. Pick the module: `src/content/docs/<module>/` (today: `openshift-platform`, `brac-poc`, `greenfield-ocp-deployment`, `security-lab`).
2. Drop the file in the right section folder (or at the module root for flatter modules): `NN-page-name.mdx`. Numeric prefix drives sort.
3. Frontmatter:
   ```yaml
   ---
   title: "Page title"
   sidebar_label: "Optional shorter label"
   description: "..."
   last_reviewed: 2026-MM-DD
   draft: false
   ---
   ```
4. Build / commit / push. The module sidebar and the module landing's TOC pick it up automatically.

### Add a learning module

1. Pick a track folder under `src/content/learn/<track>/`.
2. Create `NN-module-name.mdx`. Use the next number in sequence.
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
4. End the module with a "Next: Module N+1" link pointing at the next module's URL.
5. Build / commit / push.

### Add a new learning track

1. Create `src/content/learn/<track-id>/` directory.
2. Add numbered MDX files (`00-overview.mdx`, `01-foundations.mdx`, ...).
3. Add the track to `src/utils/tracks.ts`:
   ```ts
   export const TRACK_TITLES = {
     ...,
     "<track-id>": "<Display Title>",
   };
   export const TRACK_TAGLINES = {
     ...,
     "<track-id>": "One-paragraph track summary.",
   };
   ```
4. Build / commit / push. The /learn index, the /learn/<track>/ home, and the LearnSidebar pick up the new track automatically.

### Add a blog category

1. Just use the new category string (ALL CAPS) in a post's frontmatter.
2. The sidebar's `buildCategoryTree` discovers it and adds a group.
3. No code changes required.

### Add a new docs module

1. Create `src/content/docs/<module-id>/` (no numeric prefix on the module folder itself — module ordering on the master `/docs/` landing comes from the order of keys in `docModules.ts`). Add MDX files inside (use `NN-name.mdx` for sort).
2. Register the module in `src/utils/docModules.ts`:
   ```ts
   export const MODULE_TITLES = {
     ...,
     "<module-id>": "<Display Title>",
   };
   export const MODULE_TAGLINES = {
     ...,
     "<module-id>": "One-paragraph module summary.",
   };
   ```
3. Create the module landing at `src/pages/docs/<module-id>/index.astro`. Copy `src/pages/docs/openshift-platform/index.astro` as a template; only the `moduleId` constant changes.
4. Build / commit / push. The master `/docs/` landing, the module-scoped sidebar, and the catch-all `/docs/[...slug].astro` route pick it up automatically.

### Add a new section inside a docs module

1. Create `src/content/docs/<module>/NN-section-name/` (use the next available `NN` in that module).
2. Drop MDX files inside. `buildModuleTree` picks up the new section automatically.

### Write a Blog ADR

1. Create `src/content/docs/openshift-platform/06-architecture-decisions/12-blog/NN-adr-NNNN-name.mdx`.
2. Follow the existing ADR template — Status / Context / Decision / Consequences / Alternatives / Related.
3. Update the overview at `openshift-platform/06-architecture-decisions/12-blog/00-overview.mdx` with the new ADR in the table.

## 8. Memory rules — quick reference

The full memory is **git-tracked in this repo** at `agent-memory/`. The original Claude Code path `~/.claude/projects/-Users-ze-Documents-zeshaq-pages-dev/memory/` is a **symlink** to `agent-memory/` so Claude Code reads/writes it transparently. Changes to memory show up in `git status` like any other file. Summary of the standing rules:

| Memory | TL;DR |
| --- | --- |
| `feedback_layout_preferences.md` | **No max-width caps.** Content fills the main column. |
| `feedback_post_voice.md` | The voice template above. |
| `feedback_no_minimap.md` | **Never add `<MiniMap>`** to ReactFlow diagrams. |
| `feedback_no_mermaid.md` | **Never use `<Mermaid>`.** Always `<Whiteboard>`. |
| `feedback_always_push_posts.md` | **Push after every content commit.** Don't ask. |
| `feedback_mdx_no_js_comments.md` | **No `//` line comments inside `export const` arrays** in MDX. |

When the user expresses a new preference that's likely to recur, **save it as a new memory file** and add it to `MEMORY.md`.

## 9. ADRs as historical record

The repo has two ADR registries, both inside the openshift-platform module:

- **Comptech platform ADRs** at `src/content/docs/openshift-platform/06-architecture-decisions/` — the platform's load-bearing decisions (cluster list, hub topology, network/ingress/PKI, oc-mirror, federated GitOps, IPv6 baseline, etc.).
- **Blog ADRs** at `src/content/docs/openshift-platform/06-architecture-decisions/12-blog/` — decisions about this blog itself (multi-collection model, ReactFlow over Mermaid, category sidebar, learn section structure, SEO baseline, docs master section).

If you make a non-trivial architectural change to the blog, write a new ADR. Format: Status / Context / Decision / Consequences / Alternatives / Related.

## 10. Whiteboard (`/whiteboard`)

- Interactive ReactFlow editor; reachable via the **whiteboard ↗** CTA in the main sidebar.
- Lives at `src/pages/whiteboard.astro` with `BareLayout` (no main sidebar — full-window).
- Uses `WhiteboardEditor.tsx` with a custom `ShapeNode` that supports rectangle / ellipse / text shapes, drag-to-connect, double-click-to-edit, NodeResizer, border color picker, delete, copy/export as JSON, autosave to localStorage.
- It's a *personal* tool — not a publishable sessions surface. Don't reintroduce a `sessions` content collection unless the user asks; that was removed deliberately.

## 11. SEO + meta

- `@astrojs/sitemap` generates `/sitemap-index.xml` + `/sitemap-0.xml` at build.
- `/rss.xml` from `src/pages/rss.xml.js` lists all non-draft blog posts newest-first.
- Every layout (`Layout`, `DocsLayout`, `LearnLayout`, `BareLayout`) injects OG + Twitter Card meta + canonical URL.
- Blog post pages also inject `BlogPosting` JSON-LD into `<head>` via a slot.
- The default OG image is `public/og-default.svg` (1200×630). For per-post images, override via the layout's `image` prop.
- See [Blog ADR 0005](src/content/docs/openshift-platform/06-architecture-decisions/12-blog/05-adr-0005-seo-baseline.mdx) for the full setup.

## 12. Things to never do

- **Don't write to platform docs as if they're blog content.** The audiences are different — operators/on-call read docs; engineers-everywhere read the blog.
- **Don't reintroduce Mermaid.** The conversion to ReactFlow was deliberate; the user explicitly asked.
- **Don't reintroduce the `sessions` collection.** It was removed in favor of the `/whiteboard` personal tool.
- **Don't add `<MiniMap>`** to any ReactFlow diagram.
- **Don't set max-width caps** on content. The whole point of the layout is full-width.
- **Don't write `//` line comments inside `export const ...Nodes = [` arrays** in MDX — they break the parser.
- **Don't change git config, force-push, or skip hooks.**
- **Don't ask if you should push** after writing content — push.
- **Don't ask before adopting a clear user preference.** Save it to memory and use it.

## 13. If you find this incomplete

Update it. This file is canonical. Future agents read it before they touch anything; out-of-date instructions cause regressions.

When making non-trivial structural changes (new collection, new layout, new convention), update both:

1. This file (operating reality).
2. A new ADR in `src/content/docs/06-architecture-decisions/12-blog/` (the *why*).

Commit + push.

— End —
