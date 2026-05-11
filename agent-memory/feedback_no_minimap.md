---
name: no minimap on diagrams
description: User does not want a minimap in ReactFlow diagrams on the zahid blog — applies to the viewer Whiteboard component and any future diagrams
type: feedback
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
When adding ReactFlow diagrams to blog posts on the zahid blog (or anywhere else on this project), **do not include the `<MiniMap>` component**.

**Why:** The user explicitly asked for the minimap to be removed and said "from now on" — this is a standing preference, not a one-time change. The minimap was previously visible in the bottom-right corner of every embedded ReactFlow diagram via `src/components/Whiteboard.tsx` (the viewer component used in all MDX posts). The whiteboard editor at `/whiteboard` had its minimap removed in an earlier change.

**How to apply:**
- Don't reintroduce `<MiniMap>` in `src/components/Whiteboard.tsx` (the viewer used in blog post embeds).
- Don't reintroduce `<MiniMap>` in `src/components/WhiteboardEditor.tsx`.
- For any new ReactFlow component or page you build, keep `<Background>` and `<Controls>` but omit `<MiniMap>`.
- Keep the existing `<Controls showInteractive={false} />` (zoom in/out/fit) — that wasn't part of this preference.
