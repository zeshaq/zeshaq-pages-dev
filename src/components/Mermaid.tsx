import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
}

let initialized = false;

export default function Mermaid({ chart }: Props) {
  const rid = useId().replace(/:/g, "_");
  const wrapId = `mmd_wrap_${rid}`;
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
      .render(`mmd_${rid}`, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        if (!cancelled) setSvg(`<pre>mermaid error: ${String(err)}</pre>`);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, rid]);

  return (
    <div id={wrapId} className="diagram my-4 p-4">
      <button
        type="button"
        className="fs-btn"
        data-fullscreen-target={wrapId}
        title="Toggle fullscreen"
        aria-label="Toggle fullscreen"
      >
        ⛶ fullscreen
      </button>
      <div
        className="mermaid-svg-wrap overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
