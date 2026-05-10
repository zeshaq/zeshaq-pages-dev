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
- **Whiteboard session**: drop a `.json` file in `src/content/sessions/` with `{ title, date, description?, nodes, edges }`. Export from any ReactFlow editor and paste in.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` → builds → uploads to Cloudflare Pages project `zeshaq`.
