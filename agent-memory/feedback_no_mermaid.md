---
name: no mermaid diagrams
description: User wants ReactFlow for all diagrams on the zahid blog — mermaid is giving rendering errors; do not use it in new posts and prefer converting existing instances
type: feedback
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
**Don't use the `<Mermaid>` component** in any new blog posts on the zahid blog. User said "mermaid is giving error, use reactflow instead" — this is a standing preference going forward.

**Use `<Whiteboard>` (ReactFlow) for every diagram instead.** The pattern:

```mdx
import Whiteboard from "../../components/Whiteboard";

export const stage = { background: "#fafafa", border: "1px solid #9ca3af", borderRadius: 8, padding: 8, color: "#1f2937", width: 150, textAlign: "center", fontSize: 12 };
export const ctrl  = { background: "#e5e7eb", border: "1px solid #6b7280", borderRadius: 8, padding: 10, color: "#1f2937", width: 170, textAlign: "center", fontWeight: 600 };

export const nodes = [/* positions + labels */];
export const edges = [/* sources + targets + styles */];

<Whiteboard client:load data={{ nodes, edges }} height={500} />
```

**Convert types apply equally:**
- Flowcharts → ReactFlow with smoothstep edges
- Sequence diagrams → ReactFlow with labeled directional edges
- State diagrams → ReactFlow with self-loops
- Subgraph groupings → ReactFlow with distinct node `style` per group + visual proximity (no native subgraph in ReactFlow but spatial clustering works)
- Loops / cycles → ReactFlow nodes positioned circularly with edges closing the loop

**Why:** Mermaid was rendering inconsistently / failing for some diagrams. ReactFlow is the established diagram library on this blog already (every architecture diagram uses it), so converting everything to one tool removes the second-class fallback.

**Don't reintroduce mermaid** even for "simple" cases like a 4-node flowchart — the same `<Whiteboard>` works fine for small diagrams too.

**Still applicable:** the existing memory rules — no MiniMap in any ReactFlow diagram, full-width preferred, dark theme conventions.
