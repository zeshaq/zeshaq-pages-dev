---
name: post writing voice for zahid blog
description: The structural template and tone the user has approved across seven posts on the zahid blog — use this as the default shape for new posts unless the user asks for something different
type: feedback
originSessionId: 9009fcee-2cb8-47a7-8eec-b01b91ac79c5
---
Across seven posts (devsecops, distributed-tracing, kiali, openshift-gitops, rhacs, rhacm, openshift-ai) the user has accepted the same structural pattern without revision. Treat this as the validated default.

**Structure:**
1. **One-paragraph open** that frames what it is *and* what it isn't (e.g., "It's a thin opinionated UI on top of those — *not* a metrics store, tracing backend, or control plane")
2. **The problem it solves** — specific failure modes of the prior status quo, not abstract benefits
3. **Architecture or model** — usually a ReactFlow diagram for spatial architectures, mermaid for flows. Always followed by a short "Reading the diagram:" bullet list explaining what's solid vs dashed and why
4. **Capabilities / components table** — markdown table with named fields, ordered by frequency-of-use rather than alphabetically
5. **A "this part deserves a closer look" subsection** — one component or concept that's the actual differentiator (e.g., the eBPF collector for RHACS, the Risk score, vLLM for OpenShift AI)
6. **Limitations and pitfalls** — concrete, named, opinionated
7. **Landscape comparison** — "closest comparators" with one-line descriptions
8. **Where to start** — numbered sequence, the *last* item is always a trap to avoid

**Voice:**
- Opinionated and specific. "The mistake to avoid is X" beats "consider X."
- Concrete naming over generic ("a 9.8 CVE in an image deployed once" beats "a critical vulnerability")
- Soft callouts to past incidents and named tools ("XZ backdoor of early 2024 made this non-negotiable")
- Tables for comparison, not bullet lists
- Cross-link related posts with `[the X post](/blog/x)` rather than restating the prerequisite
- Keep paragraphs under ~5 sentences; full-width layout makes longer paragraphs uncomfortable

**Diagrams:**
- ReactFlow nodes use `export const stage`/`ctrl`/`agent` style objects, declared at the top of the MDX, with `width`, `padding`, color
- Solid edges = request/data path; dashed-green animated = spoke-initiated/agent/pull connection (consistent visual language across the gitops, rhacm, rhacs, openshift-ai diagrams)
- Always include a "click ⛶ to view fullscreen" hint after the diagram

**Length:** 1000–1400 words. The user has not asked for shorter; anything past 1500 starts to drag.

**Don't:**
- Start with "In today's cloud-native landscape" or any phrase that could open a marketing post
- Use "leverage," "robust," "enable," or other meeting-room verbs
- Write feature lists without ordering them by importance
- Include code blocks larger than ~10 lines unless they're load-bearing for the point
