"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import Papa from "papaparse"
import type { EventItem } from "./types"
import { translateBatch, readCached, writeCached } from "./translator"

const fetcher = async (url: string): Promise<EventItem[]> => {
  const res = await fetch(url, { cache: "no-store" })
  const text = await res.text()
  const parsed = Papa.parse<EventItem>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })
  // Filter out empty rows that may appear
  return (parsed.data || []).filter((r) => r && r.Name && r["Start date"] && r["End date"])
}

export function useEvents(lang: "en" | "ru" = "en") {
  const { data: csv, error, isLoading } = useSWR<string>("/data/events.csv", async (url) => {
    const res = await fetch(url, { cache: "no-store" })
    return res.text()
  })

  const baseEvents: EventItem[] = useMemo(() => {
    if (!csv) return []
    const parsed = Papa.parse<EventItem>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    })
    return (parsed.data || []).filter((r) => r && r.Name && r["Start date"] && r["End date"])
  }, [csv])

  const [ruEvents, setRuEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    if (lang === "en" || baseEvents.length === 0) { setRuEvents(null); return }
    const hash = String(csv?.length ?? 0)
    const cached = readCached(hash)
    if (cached) { setRuEvents(cached as EventItem[]); return }

    ;(async () => {
      const fields = ["Name", "Type", "Location", "Teachers"] as const
      const flat: string[] = []
      baseEvents.forEach(e => fields.forEach(f => flat.push((e as any)[f] ?? "")))

      const out = await translateBatch(flat, "ru")
      let idx = 0
      const rows = baseEvents.map((e) => {
        const copy: any = { ...e }
        fields.forEach((f) => { copy[f] = out[idx++] || (e as any)[f] })
        return copy as EventItem
      })
      writeCached(hash, rows)
      setRuEvents(rows)
    })().catch(() => setRuEvents(null))
  }, [lang, csv, baseEvents])

  return {
    events: lang === "ru" && ruEvents ? ruEvents : baseEvents,
    isLoading,
    error,
  }
}
