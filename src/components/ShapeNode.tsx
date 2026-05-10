import {
  Handle,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type Shape = "rect" | "ellipse" | "text";

export interface ShapeData {
  label: string;
  shape: Shape;
  [key: string]: unknown;
}

export const EditableContext = createContext<boolean>(false);

export default function ShapeNode({ id, data, selected }: NodeProps) {
  const editable = useContext(EditableContext);
  const { setNodes } = useReactFlow();
  const d = data as ShapeData;
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(d.label ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setLabel(d.label ?? ""), [d.label]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label } } : n
      )
    );
    setEditing(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      setLabel(d.label ?? "");
      setEditing(false);
    }
  };

  return (
    <div
      className={`shape shape-${d.shape}${selected ? " selected" : ""}`}
      onDoubleClick={() => editable && setEditing(true)}
    >
      <Handle id="t" type="source" position={Position.Top} />
      <Handle id="r" type="source" position={Position.Right} />
      <Handle id="b" type="source" position={Position.Bottom} />
      <Handle id="l" type="source" position={Position.Left} />

      {editing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          className="shape-input"
        />
      ) : (
        <span>{label || (editable ? "double-click to edit" : "")}</span>
      )}
    </div>
  );
}
