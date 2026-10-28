type Block = { _type?: string; children?: { text?: string | null }[] | null };

/** Portable Text blocks to plain paragraphs. */
export function blocksToParagraphs(blocks: Block[] | null | undefined): string[] {
  return (blocks ?? [])
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter(Boolean);
}
