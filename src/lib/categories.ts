export type BusinessCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  status?: string;
  sortOrder?: number;
  coverImage?: string;
  businessCount?: number;
  _count?: { businesses: number };
};

export function categoryPath(categories: BusinessCategory[], id: string) {
  const path: BusinessCategory[] = [];
  const visited = new Set<string>();
  let node = categories.find((item) => item.id === id);
  while (node && !visited.has(node.id)) {
    visited.add(node.id);
    path.unshift(node);
    node = categories.find((item) => item.id === node!.parentId);
  }
  return path;
}

export function orderedCategories(categories: BusinessCategory[]) {
  const result: { category: BusinessCategory; depth: number }[] = [];
  const seen = new Set<string>();
  const visit = (parentId: string | null, depth: number) => {
    categories
      .filter((item) => (item.parentId || null) === parentId)
      .sort(
        (a, b) =>
          (a.sortOrder || 0) - (b.sortOrder || 0) ||
          a.name.localeCompare(b.name),
      )
      .forEach((category) => {
        if (seen.has(category.id)) return;
        seen.add(category.id);
        result.push({ category, depth });
        visit(category.id, depth + 1);
      });
  };
  visit(null, 0);
  return result;
}
