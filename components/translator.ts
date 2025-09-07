export type Lang = "en" | "ru";

const cacheKey = (hash: string) => `events-ru-${hash}`;

export async function translateBatch(texts: string[], target: Lang): Promise<string[]> {
  if (target === "en" || texts.length === 0) return texts;

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: texts, source: "en", target: "ru" }),
  });
  if (!res.ok) throw new Error("Translate API failed");
  const data = await res.json();
  return (data.translations as string[]) || texts;
}

export function readCached(hash: string): any[] | null {
  try {
    const v = localStorage.getItem(cacheKey(hash));
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function writeCached(hash: string, rows: any[]) {
  try {
    localStorage.setItem(cacheKey(hash), JSON.stringify(rows));
  } catch {}
}


