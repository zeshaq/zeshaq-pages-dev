/**
 * Display titles and taglines for each docs "module".
 *
 * A docs module is a top-level folder under `src/content/docs/`. Every
 * page in the `docs` collection sits underneath one of these modules — its
 * id starts with `<moduleId>/`. The URL pattern (after numeric-prefix
 * stripping) is `/docs/<moduleId>/<section>/<page>` for the platform
 * module and `/docs/<moduleId>/<page>` for flatter modules.
 *
 * Keep this file in sync with the folder layout. Adding a new module is
 * a two-step change:
 *   1. Create `src/content/docs/<module-id>/` with numbered .mdx files.
 *   2. Add an entry to MODULE_TITLES and MODULE_TAGLINES below.
 * The master /docs landing picks up the new card automatically.
 */

export const MODULE_TITLES: Record<string, string> = {
  "openshift-platform": "Full Platform Documentation",
  "brac-poc": "BRAC Bank POC",
};

export const MODULE_TAGLINES: Record<string, string> = {
  "openshift-platform":
    "Operating manual for the comptech OpenShift platform — fleet topology, GitOps, image supply, observability, security, compliance, backup, and the ADRs behind it all.",
  "brac-poc":
    "Engagement-specific documentation for the BRAC Bank proof of concept — eight-panel SPA, payment microservice, jboss-chat, demo scope, and the operational decisions made for this engagement.",
};

export function moduleTitle(id: string): string {
  return MODULE_TITLES[id] ?? id;
}

export function moduleTagline(id: string): string {
  return MODULE_TAGLINES[id] ?? "";
}

/** Parse a path under /docs. Returns the module id (and whether path is a module page). */
export function parseDocsPath(path: string): {
  isDocs: boolean;
  moduleId?: string;
  isModuleHome: boolean;
  isModulePage: boolean;
} {
  const parts = path.replace(/\/+$/, "").split("/").filter(Boolean);
  const isDocs = parts[0] === "docs";
  if (!isDocs) {
    return { isDocs: false, isModuleHome: false, isModulePage: false };
  }
  const moduleId = parts[1];
  const isModuleHome = parts.length === 2 && !!moduleId;
  const isModulePage = parts.length >= 3 && !!moduleId;
  return { isDocs, moduleId, isModuleHome, isModulePage };
}
