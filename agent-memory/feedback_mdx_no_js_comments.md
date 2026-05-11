---
name: No JavaScript // comments inside MDX export blocks
description: MDX expression parser rejects // line comments inside top-level export const arrays/objects; use no comments or block /* */ if needed
type: feedback
originSessionId: e5c8cfa6-8d55-47b1-8d94-01389d3ac4b9
---
When writing `<Whiteboard>` node/edge arrays as `export const` in MDX, do NOT use `//` line comments inside the array. They cause MDX parse errors like:

```
Caused by:
Unexpected content after expression
  at eventsToAcorn (.../micromark-util-events-to-acorn/lib/index.js:96:7)
```

**Why:** The MDX (micromark-acorn) expression parser is stricter than plain JS; `//` inside an expression block breaks tokenization. Even `// section header` style comments above a row of node definitions fails.

**How to apply:**
- Skip comments entirely in `export const ...Nodes = [ ... ]` blocks.
- If you must annotate, put plain prose *outside* the export block, or use block comments `/* ... */` (untested but generally safer for MDX).
- Also watch for: bare `<digit` patterns (`<200ms`) — separate known issue, escape with `&lt;` or surrounding backticks.
