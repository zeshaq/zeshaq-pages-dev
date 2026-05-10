import type { CollectionEntry } from "astro:content";

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
};

type CollectionItem = CollectionEntry<"blog"> | CollectionEntry<"sessions">;

const prettify = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toLowerCase());

export function buildTree(items: CollectionItem[], base: string): NavNode[] {
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
