import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface SessionData {
  nodes: Node[];
  edges: Edge[];
}

interface Props {
  data: SessionData;
  height?: number;
}

export default function Whiteboard({ data, height = 520 }: Props) {
  const nodes = useMemo(() => data.nodes ?? [], [data]);
  const edges = useMemo(() => data.edges ?? [], [data]);

  return (
    <div
      style={{ height }}
      className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)]"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d1d5db" gap={20} />
        <MiniMap pannable zoomable maskColor="rgba(243,244,246,0.6)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
