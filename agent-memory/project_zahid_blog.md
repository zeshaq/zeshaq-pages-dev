---
name: zahid personal blog project
description: Astro blog with a standalone whiteboard tool, deployed to Cloudflare Pages — repo, project name, live URL, content model, categories, and the zahid.pages.dev collision history
type: project
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
Personal blog at `/Users/ze/Documents/zeshaq-pages-dev/`.

- GitHub repo: `zeshaq/zahid` (public) — kept as `zahid` per user preference
- Cloudflare Pages project: `zeshaq` (renamed 2026-05-10 from `zahid`)
- **Live URL: `https://zeshaq.pages.dev`** (clean subdomain)
- Auto-deploy: `.github/workflows/deploy.yml` runs on push to `main` using `cloudflare/wrangler-action@v3`
- GH repo secrets set: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

**The zahid.pages.dev rename history:** First attempt created CF project `zahid` and got subdomain `zahid-5m4.pages.dev` — the random suffix was added because `zahid.pages.dev` is already owned globally by another CF user ("Zahid Hasan's Cloud Index"). CF appends a 3-char fallback suffix only when the desired subdomain collides; it is NOT a default applied to all new projects. Renaming the CF project to `zeshaq` resolved cleanly. **Don't try to rename the CF project back to `zahid` thinking it'll work — it won't.**

**Content model:**
- Blog posts in `src/content/blog/*.mdx` — only collection. MDX supports inline `<Mermaid>`, `<DrawioEmbed>`, and `<Whiteboard>` (read-only ReactFlow with inline `nodes` / `edges` data declared via `export const`).
- Posts have an optional `category` frontmatter field; sidebar groups by category alphabetically with newest-first within each group. Uncategorized posts fall back to a flat list at the end.
- **Current categories:** `ai`, `observability`, `openshift`, `security`. Single-tier; can split later as the blog grows. Categorize via `category:` line in frontmatter — no folder moves required (URLs are flat `/blog/<slug>`).
- Whiteboard tool at `/whiteboard` — standalone full-window editor (BareLayout, no sidebar). In-canvas Panel toolbar with rectangle/ellipse/text shape adds, drag-to-connect handles (`ConnectionMode.Loose`), double-click-to-edit, NodeResizer for selected shapes, border-color picker, delete button, all visible in fullscreen alongside ReactFlow zoom controls. Autosave to localStorage. JSON export/copy. **Sessions as a content type were removed** — the editor is just a personal tool, not a publishing surface. Don't reintroduce a "sessions" collection unless the user asks.
- Sidebar: filter input at top (case-insensitive substring across post titles, recurses into category groups, auto-expands matching ones); flat blog-post list grouped by category; `whiteboard ↗` CTA at the bottom (`target="_blank"`, divider above it).

**Post catalog (as of 2026-05-10 close):** 7 posts, all written in a consistent house style — `what-is-devsecops`, `distributed-tracing`, `kiali`, `openshift-gitops`, `rhacs`, `rhacm`, `openshift-ai`. Cross-referenced (RHACM links to GitOps; OpenShift AI links to GitOps + RHACS).

Stack: Astro 5 + React islands, MDX blog posts, `@xyflow/react` (ReactFlow v12), mermaid (client-side React component), draw.io (iframe component), Tailwind v4 with white body + dark blackish-green sidebar (#0c1812), full-width content with generous paragraph spacing.
