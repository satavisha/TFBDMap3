"use client"

import { useMemo } from "react"
import useSWR from "swr"
import Papa from "papaparse"
import type { EventItem } from "./types"

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
  const csvUrl = lang === "en" ? "/data/events.csv" : "/data/eventsRU.csv"

  const { data: csv, error, isLoading } = useSWR<string>(csvUrl, async (url) => {
    const res = await fetch(url, { cache: "no-store" })
    return res.text()
  })

  const events: EventItem[] = useMemo(() => {
    if (!csv) return []
    const parsed = Papa.parse<EventItem>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    })
    return (parsed.data || []).filter((r) => r && r.Name && r["Start date"] && r["End date"])
  }, [csv])

  return {
    events,
    isLoading,
    error,
  }
}
