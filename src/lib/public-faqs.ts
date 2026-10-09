export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}
export function faqCategories(items: PublicFaq[]) {
  const groups = new Map<
    string,
    { id: string; name: string; faqs: PublicFaq[] }
  >();
  for (const item of [...items].sort((a, b) => a.sortOrder - b.sortOrder)) {
    const id = item.category.trim().toLowerCase();
    if (!groups.has(id))
      groups.set(id, {
        id,
        name: id
          .replace(/[_-]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        faqs: [],
      });
    groups.get(id)!.faqs.push(item);
  }
  return [...groups.values()];
}
export function validFaqs(value: unknown): value is PublicFaq[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.question === "string" &&
        typeof item.answer === "string" &&
        typeof item.category === "string" &&
        !!item.category.trim() &&
        Number.isInteger(item.sortOrder),
    )
  );
}
