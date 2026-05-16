import type { CollectionEntry } from "astro:content";

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
  /** raw sort key, used for ordering before pretty labels are computed */
  sortKey?: string;
};

type BlogItem = CollectionEntry<"blog">;
type DocItem = CollectionEntry<"docs">;
type LearnItem = CollectionEntry<"learn">;

const prettify = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toLowerCase());

/** Strip a leading "NN-" or "NN_" numeric prefix, used for sort-only segments. */
const stripPrefix = (s: string) => s.replace(/^\d+[-_]/, "");

/** Slug after stripping numeric prefixes from each segment of a content id. */
export function stripIdPrefixes(id: string): string {
  return id
    .split("/")
    .map((seg) => stripPrefix(seg))
    .join("/");
}

export function buildTree(items: BlogItem[], base: string): NavNode[] {
  const root: NavNode = { label: "", children: [] };
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    const parts = item.id.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      const cleanDir = stripPrefix(dir);
      let child = cursor.children!.find(
        (c) => c.sortKey === dir && !c.href
      );
      if (!child) {
        child = { label: prettify(cleanDir), children: [], sortKey: dir };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    cursor.children!.push({
      label: (item.data as { title: string }).title,
      href: `${base}/${stripIdPrefixes(item.id)}`,
      sortKey: parts[parts.length - 1],
    });
  }

  // Sort children at every level by sortKey (so 01-foo comes before 02-bar).
  const sortRecursive = (nodes: NavNode[] | undefined) => {
    if (!nodes) return;
    nodes.sort((a, b) => (a.sortKey ?? a.label).localeCompare(b.sortKey ?? b.label));
    for (const n of nodes) sortRecursive(n.children);
  };
  sortRecursive(root.children);

  return root.children ?? [];
}

/** Like buildTree but for the `docs` collection — accepts a per-item `sidebar_label` override. */
export function buildDocsTree(items: DocItem[], base: string): NavNode[] {
  const root: NavNode = { label: "", children: [] };
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    const parts = item.id.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      const cleanDir = stripPrefix(dir);
      let child = cursor.children!.find(
        (c) => c.sortKey === dir && !c.href
      );
      if (!child) {
        child = { label: prettify(cleanDir), children: [], sortKey: dir };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    const data = item.data as { title: string; sidebar_label?: string };
    cursor.children!.push({
      label: data.sidebar_label ?? data.title,
      href: `${base}/${stripIdPrefixes(item.id)}`,
      sortKey: parts[parts.length - 1],
    });
  }

  const sortRecursive = (nodes: NavNode[] | undefined) => {
    if (!nodes) return;
    nodes.sort((a, b) => (a.sortKey ?? a.label).localeCompare(b.sortKey ?? b.label));
    for (const n of nodes) sortRecursive(n.children);
  };
  sortRecursive(root.children);

  return root.children ?? [];
}

/**
 * Build a docs tree scoped to a single module (a top-level folder under
 * `src/content/docs/`). Strips the `<moduleId>/` prefix from each item id
 * before building, so the resulting tree is rooted at the module — no
 * wrapping group for the module folder itself.
 *
 * Use this from sidebars and module-landing pages where the surrounding
 * UI already names the module; the tree only needs to show what's inside.
 */
export function buildModuleTree(
  items: DocItem[],
  moduleId: string,
  base: string,
): NavNode[] {
  const prefix = `${moduleId}/`;
  const scoped = items.filter((it) => it.id.startsWith(prefix));

  const root: NavNode = { label: "", children: [] };
  const sorted = [...scoped].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    // Walk only the segments *inside* the module folder.
    const inner = item.id.slice(prefix.length);
    const parts = inner.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      const cleanDir = stripPrefix(dir);
      let child = cursor.children!.find(
        (c) => c.sortKey === dir && !c.href
      );
      if (!child) {
        child = { label: prettify(cleanDir), children: [], sortKey: dir };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    const data = item.data as { title: string; sidebar_label?: string };
    cursor.children!.push({
      label: data.sidebar_label ?? data.title,
      href: `${base}/${stripIdPrefixes(item.id)}`,
      sortKey: parts[parts.length - 1],
    });
  }

  const sortRecursive = (nodes: NavNode[] | undefined) => {
    if (!nodes) return;
    nodes.sort((a, b) => (a.sortKey ?? a.label).localeCompare(b.sortKey ?? b.label));
    for (const n of nodes) sortRecursive(n.children);
  };
  sortRecursive(root.children);

  return root.children ?? [];
}

/**
 * Build a learn tree scoped to a single track. Strips the `<trackId>/`
 * prefix so the resulting tree is rooted at the track — same shape and
 * intent as `buildModuleTree` for docs.
 */
export function buildLearnTrackTree(
  items: LearnItem[],
  trackId: string,
  base: string,
): NavNode[] {
  const prefix = `${trackId}/`;
  const scoped = items.filter((it) => it.id.startsWith(prefix));

  const root: NavNode = { label: "", children: [] };
  const sorted = [...scoped].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    const inner = item.id.slice(prefix.length);
    const parts = inner.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      const cleanDir = stripPrefix(dir);
      let child = cursor.children!.find(
        (c) => c.sortKey === dir && !c.href
      );
      if (!child) {
        child = { label: prettify(cleanDir), children: [], sortKey: dir };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    const data = item.data as { title: string; sidebar_label?: string };
    cursor.children!.push({
      label: data.sidebar_label ?? data.title,
      href: `${base}/${stripIdPrefixes(item.id)}`,
      sortKey: parts[parts.length - 1],
    });
  }

  const sortRecursive = (nodes: NavNode[] | undefined) => {
    if (!nodes) return;
    nodes.sort((a, b) => (a.sortKey ?? a.label).localeCompare(b.sortKey ?? b.label));
    for (const n of nodes) sortRecursive(n.children);
  };
  sortRecursive(root.children);

  return root.children ?? [];
}

/** Same shape as buildDocsTree, scoped to the `learn` collection. */
export function buildLearnTree(items: LearnItem[], base: string): NavNode[] {
  const root: NavNode = { label: "", children: [] };
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    const parts = item.id.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      const cleanDir = stripPrefix(dir);
      let child = cursor.children!.find(
        (c) => c.sortKey === dir && !c.href
      );
      if (!child) {
        child = { label: prettify(cleanDir), children: [], sortKey: dir };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    const data = item.data as { title: string; sidebar_label?: string };
    cursor.children!.push({
      label: data.sidebar_label ?? data.title,
      href: `${base}/${stripIdPrefixes(item.id)}`,
      sortKey: parts[parts.length - 1],
    });
  }

  const sortRecursive = (nodes: NavNode[] | undefined) => {
    if (!nodes) return;
    nodes.sort((a, b) => (a.sortKey ?? a.label).localeCompare(b.sortKey ?? b.label));
    for (const n of nodes) sortRecursive(n.children);
  };
  sortRecursive(root.children);

  return root.children ?? [];
}

export function buildCategoryTree(items: BlogItem[], base: string): NavNode[] {
  const groups = new Map<string, BlogItem[]>();
  const uncategorized: BlogItem[] = [];

  for (const item of items) {
    const cat = (item.data as { category?: string }).category;
    if (!cat) {
      uncategorized.push(item);
      continue;
    }
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(item);
  }

  const result: NavNode[] = [];

  for (const cat of Array.from(groups.keys()).sort()) {
    const posts = groups
      .get(cat)!
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
    result.push({
      label: cat.replace(/[-_]+/g, " "),
      children: posts.map((p) => ({
        label: (p.data as { title: string }).title,
        href: `${base}/${p.id}`,
      })),
    });
  }

  if (uncategorized.length) {
    uncategorized.sort(
      (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
    );
    for (const p of uncategorized) {
      result.push({
        label: (p.data as { title: string }).title,
        href: `${base}/${p.id}`,
      });
    }
  }

  return result;
}

const norm = (p: string) => p.replace(/\/+$/, "");

export function containsPath(node: NavNode, path: string): boolean {
  const cur = norm(path);
  if (node.href && norm(node.href) === cur) return true;
  return node.children?.some((c) => containsPath(c, path)) ?? false;
}

export function isActive(href: string | undefined, path: string): boolean {
  if (!href) return false;
  return norm(href) === norm(path);
}
