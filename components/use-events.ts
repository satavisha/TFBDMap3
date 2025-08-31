"use client"

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

export function useEvents() {
  const { data, error, isLoading } = useSWR<EventItem[]>("/data/events.csv", fetcher)

  return {
    events: data ?? [],
    isLoading,
    error,
  }
}
