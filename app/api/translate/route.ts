import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { q, target = "ru", source = "en" } = await req.json();

  const payload = {
    q,
    source,
    target,
    format: "text",
  } as const;

  const res = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "translate_failed" }, { status: 500 });
  }

  const data = await res.json();
  const translations = Array.isArray(q)
    ? (data as any[]).map((d: any) => d.translatedText)
    : [data.translatedText];

  return NextResponse.json({ translations });
}


