/**
 * Display titles and taglines for each learning track.
 *
 * Tracks are folders under `src/content/learn/`. Their display title and
 * marketing tagline are kept centrally here so the /learn index page, the
 * per-track home pages, and the LearnSidebar stay consistent.
 *
 * Add a new track:
 *   1. Create `src/content/learn/<track-id>/` with numbered .mdx files.
 *   2. Add an entry to TRACK_TITLES and TRACK_TAGLINES below.
 * No other code changes required — pages and sidebar pick up the new track
 * from getStaticPaths / getCollection.
 */

export const TRACK_TITLES: Record<string, string> = {
  "agentic-ai": "Agentic AI",
  "cloudflare": "Cloudflare",
  "acm-multicluster": "ACM Multicluster",
  "kubeflow": "Kubeflow",
  "devsecops": "DevSecOps",
};

export const TRACK_TAGLINES: Record<string, string> = {
  "agentic-ai":
    "Build agents that loop, use tools, and produce results. From the agent loop and MCP to planning, evaluation, and production.",
  "cloudflare":
    "The unified network + edge + security + AI platform. Tunnels, Zero Trust, Magic networking, Workers, Pages, and the rest.",
  "acm-multicluster":
    "Operate ten or fifty OpenShift clusters from one control plane. Red Hat Advanced Cluster Management end-to-end — registration, policies, GitOps, applications, observability, hosted control planes, and disaster recovery.",
  "kubeflow":
    "The platform layer for the ML workflow on Kubernetes. Upstream Kubeflow end-to-end — notebooks, KFP pipelines, distributed training, Katib HPO, KServe model serving, multi-tenancy with Profiles, and production-grade install patterns.",
  "devsecops":
    "Shift security left into the SDLC, automate the gates at every stage, and treat security as a property of every commit. Threat modeling, SAST/SCA, container and supply-chain security (SLSA, SBOM, cosign), IaC scanning, runtime detection (RHACS, Falco), secrets, zero trust, compliance, and SIEM — ending in a fully gated deployment pipeline.",
};

export function trackTitle(id: string): string {
  return TRACK_TITLES[id] ?? id;
}

export function trackTagline(id: string): string {
  return TRACK_TAGLINES[id] ?? "";
}

/** Parse a path under /learn. Returns the track id (and whether the path is a module page). */
export function parseLearnPath(path: string): {
  isLearn: boolean;
  trackId?: string;
  isTrackHome: boolean;
  isModule: boolean;
} {
  const parts = path.replace(/\/+$/, "").split("/").filter(Boolean);
  const isLearn = parts[0] === "learn";
  if (!isLearn) return { isLearn: false, isTrackHome: false, isModule: false };
  const trackId = parts[1];
  const isTrackHome = parts.length === 2 && !!trackId;
  const isModule = parts.length >= 3 && !!trackId;
  return { isLearn, trackId, isTrackHome, isModule };
}
