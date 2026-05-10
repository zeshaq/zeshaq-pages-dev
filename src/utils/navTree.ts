import type { CollectionEntry } from "astro:content";

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
};

type BlogItem = CollectionEntry<"blog">;

const prettify = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toLowerCase());

export function buildTree(items: BlogItem[], base: string): NavNode[] {
  const root: NavNode = { label: "", children: [] };
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));

  for (const item of sorted) {
    const parts = item.id.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      let child = cursor.children!.find(
        (c) => c.label === prettify(dir) && !c.href
      );
      if (!child) {
        child = { label: prettify(dir), children: [] };
        cursor.children!.push(child);
      }
      cursor = child;
    }
    cursor.children!.push({
      label: (item.data as { title: string }).title,
      href: `${base}/${item.id}`,
    });
  }

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
      label: prettify(cat),
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
