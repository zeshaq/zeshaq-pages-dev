import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
}

let initialized = false;

export default function Mermaid({ chart }: Props) {
  const id = useId().replace(/:/g, "_");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "strict",
        themeVariables: {
          background: "#fafafa",
          primaryColor: "#e5e7eb",
          primaryBorderColor: "#9ca3af",
          primaryTextColor: "#1f2937",
          lineColor: "#6b7280",
        },
      });
      initialized = true;
    }
    let cancelled = false;
    mermaid
      .render(`mmd_${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        if (!cancelled) setSvg(`<pre>mermaid error: ${String(err)}</pre>`);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="my-4 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
