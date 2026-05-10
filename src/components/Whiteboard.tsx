import { useId, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ShapeNode from "./ShapeNode";

interface SessionData {
  nodes: Node[];
  edges: Edge[];
}

interface Props {
  data: SessionData;
  height?: number | string;
}

const nodeTypes = { shape: ShapeNode };

export default function Whiteboard({ data, height = 560 }: Props) {
  const id = `wb_${useId().replace(/:/g, "_")}`;
  const nodes = useMemo(() => data.nodes ?? [], [data]);
  const edges = useMemo(() => data.edges ?? [], [data]);
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
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
