export function chunkText(
  text: string,
  chunkSize = 600,
  overlap = 100
): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let start = 0;
  while (start < words.length) {
    const end = start + chunkSize;
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }

  return chunks;
}
