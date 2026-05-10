# zahid

Personal blog + whiteboard sessions. Astro + React islands, deployed to Cloudflare Pages at https://zeshaq.pages.dev.

## Local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## Adding content

- **Blog post**: drop a `.mdx` file in `src/content/blog/` with frontmatter (`title`, `date`, optional `description`, `draft`).
  - Mermaid: `import Mermaid from "../../components/Mermaid"` then `<Mermaid client:load chart={`graph TD; A-->B`} />`.
  - draw.io: `import DrawioEmbed from "../../components/DrawioEmbed.astro"` then `<DrawioEmbed src="https://viewer.diagrams.net/?...#R..." />`.
  - Inline ReactFlow: `import Whiteboard from "../../components/Whiteboard"` then declare `export const nodes = [...]; export const edges = [...]` and render `<Whiteboard client:load data={{ nodes, edges }} />`.

## Whiteboard

Open the whiteboard tool from the sidebar (or directly at `/whiteboard`). It opens in a new tab as a full-window editor with rectangle / ellipse / text shapes, drag-to-connect, double-click-to-edit, autosave-to-localStorage, and a `⛶ fullscreen` toolbar button.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` → builds → uploads to Cloudflare Pages project `zeshaq`.
