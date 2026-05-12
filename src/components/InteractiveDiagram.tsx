import {
  useId,
  useState,
  useCallback,
  useMemo,
  type CSSProperties,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Props {
  nodes: Node[];
  edges: Edge[];
  height?: number | string;
}

/**
 * An interactive ReactFlow diagram:
 *   - All nodes are draggable (rearrange the canvas to your liking)
 *   - Click a node to invert its colors (foreground ↔ background)
 *   - All edges animate by default (the "marching ants" effect)
 *
 * Pan/zoom + fitView controls come from the shared @xyflow/react `Controls`
 * component. The fullscreen toggle uses the existing repo convention.
 */
export default function InteractiveDiagram({
  nodes: inputNodes,
  edges: inputEdges,
  height = 600,
}: Props) {
  const id = `idx_${useId().replace(/:/g, "_")}`;
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  }, []);

  const renderedNodes = useMemo<Node[]>(
    () =>
      inputNodes.map((n) => {
        if (!flipped.has(n.id)) return n;
        const base = (n.style ?? {}) as CSSProperties;
        const bg = (base.background as string) ?? "#ffffff";
        const fg = (base.color as string) ?? "#1f2937";
        return {
          ...n,
          style: {
            ...base,
            background: fg,
            color: bg,
            borderColor: bg,
            fontWeight: 600,
          },
        };
      }),
    [inputNodes, flipped]
  );

  const renderedEdges = useMemo<Edge[]>(
    () =>
      inputEdges.map((e) => ({
        ...e,
        animated: e.animated !== false,
      })),
    [inputEdges]
  );

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div id={id} className="diagram" style={{ height: heightStyle }}>
      <button
        type="button"
        className="fs-btn"
        data-fullscreen-target={id}
        title="Toggle fullscreen"
        aria-label="Toggle fullscreen"
      >
        ⛶ fullscreen
      </button>
      <ReactFlow
        nodes={renderedNodes}
        edges={renderedEdges}
        fitView
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d1d5db" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
