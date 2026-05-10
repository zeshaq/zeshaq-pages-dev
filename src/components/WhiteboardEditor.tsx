import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
  ConnectionMode,
  MarkerType,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ShapeNode, { EditableContext, type Shape, type ShapeData } from "./ShapeNode";

const nodeTypes = { shape: ShapeNode };
const DRAFT_KEY = "session-draft-v1";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "session";

function EditorInner() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [copied, setCopied] = useState(false);
  const [restored, setRestored] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const hydrated = useRef(false);
  const canvasId = `wb_canvas_${useId().replace(/:/g, "_")}`;

  // Restore draft on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (typeof draft.title === "string") setTitle(draft.title);
        if (typeof draft.description === "string") setDescription(draft.description);
        if (Array.isArray(draft.nodes) && draft.nodes.length) setNodes(draft.nodes);
        if (Array.isArray(draft.edges) && draft.edges.length) setEdges(draft.edges);
        if ((draft.nodes?.length ?? 0) + (draft.title?.length ?? 0) > 0) setRestored(true);
      }
    } catch {
      // ignore parse errors
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave
  useEffect(() => {
    if (!hydrated.current) return;
    const draft = { title, description, nodes, edges };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota errors
    }
  }, [title, description, nodes, edges]);

  const onConnect = useCallback(
    (conn: Connection) =>
      setEdges((es) =>
        addEdge(
          {
            ...conn,
            style: { stroke: "#4b5563", strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#4b5563" },
          },
          es
        )
      ),
    [setEdges]
  );

  const addShape = (shape: Shape) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const center = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    const jitter = ((nodes.length * 23) % 80) - 40;
    const id = `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const labels: Record<Shape, string> = {
      rect: "node",
      ellipse: "node",
      text: "text",
    };
    setNodes((ns) => [
      ...ns,
      {
        id,
        type: "shape",
        position: { x: center.x - 60 + jitter, y: center.y - 20 + jitter },
        data: { label: labels[shape], shape },
      },
    ]);
  };

  const updateBorderColor = (id: string, color: string) => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, borderColor: color } } : n
      )
    );
  };

  const removeNode = (id: string) => {
    setNodes((ns) => ns.filter((n) => n.id !== id));
    setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
  };

  const buildPayload = () => ({
    title: title.trim() || "Untitled session",
    description: description.trim() || "",
    date: new Date().toISOString().slice(0, 10),
    nodes,
    edges,
  });

  const onExport = () => {
    const slug = slugify(title.trim() || "untitled");
    const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildPayload(), null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Clipboard not available — use export json instead.");
    }
  };

  const onClear = () => {
    if (!confirm("Clear all nodes and edges?")) return;
    setNodes([]);
    setEdges([]);
  };

  const onDiscardDraft = () => {
    if (!confirm("Discard saved draft and reset everything?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setDescription("");
    setNodes([]);
    setEdges([]);
    setRestored(false);
  };

  const selectedNode = nodes.find((n) => n.selected);
  const selectedShape = selectedNode?.data as ShapeData | undefined;

  return (
    <EditableContext.Provider value={true}>
      <div className="editor-root">
        <div className="editor-meta">
          <input
            type="text"
            placeholder="Session title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="editor-toolbar">
          <button
            type="button"
            className="editor-btn"
            data-fullscreen-target={canvasId}
            title="Fullscreen"
          >
            ⛶ fullscreen
          </button>
          <span className="editor-spacer" />
          <button type="button" className="editor-btn" onClick={onCopy}>
            {copied ? "copied!" : "copy json"}
          </button>
          <button
            type="button"
            className="editor-btn editor-btn-primary"
            onClick={onExport}
          >
            export json
          </button>
          <button type="button" className="editor-btn" onClick={onClear}>
            clear
          </button>
          {restored && (
            <button type="button" className="editor-btn editor-btn-warn" onClick={onDiscardDraft}>
              discard draft
            </button>
          )}
        </div>

        <div id={canvasId} ref={wrapperRef} className="diagram editor-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={["Delete"]}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#d1d5db" gap={20} />
            <Controls showInteractive={false} />

            <Panel position="top-left" className="canvas-panel">
              <button
                type="button"
                className="canvas-btn"
                onClick={() => addShape("rect")}
                title="Add rectangle"
                aria-label="Add rectangle"
              >
                ▭
              </button>
              <button
                type="button"
                className="canvas-btn"
                onClick={() => addShape("ellipse")}
                title="Add ellipse"
                aria-label="Add ellipse"
              >
                ◯
              </button>
              <button
                type="button"
                className="canvas-btn"
                onClick={() => addShape("text")}
                title="Add text"
                aria-label="Add text"
              >
                T
              </button>
            </Panel>

            {selectedNode && selectedShape && (
              <Panel position="top-right" className="canvas-panel canvas-panel-props">
                <span className="canvas-label">border</span>
                <input
                  type="color"
                  className="canvas-color"
                  value={selectedShape.borderColor ?? "#6b7280"}
                  onChange={(e) => updateBorderColor(selectedNode.id, e.target.value)}
                  title="Border color"
                />
                <span className="canvas-divider" />
                <button
                  type="button"
                  className="canvas-btn canvas-btn-danger"
                  onClick={() => removeNode(selectedNode.id)}
                  title="Delete selected (also: Delete key)"
                  aria-label="Delete selected"
                >
                  ✕ delete
                </button>
                <span className="canvas-divider" />
                <span className="canvas-hint">drag corners to resize</span>
              </Panel>
            )}
          </ReactFlow>
        </div>

        <p className="editor-hints">
          drag handles to connect • double-click a shape to edit text • select &amp; press <kbd>Delete</kbd> to remove • drag corners (when selected) to resize • autosaved to your browser
        </p>
      </div>
    </EditableContext.Provider>
  );
}

export default function WhiteboardEditor() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}
