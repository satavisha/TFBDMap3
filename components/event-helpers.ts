import type { EventItem } from "./types"

function parseDDMMYYYY(value: string): Date | null {
  if (!value) return null
  // Accept dd/mm/yyyy or dd-mm-yyyy
  const parts = value.includes("/") ? value.split("/") : value.split("-")
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts.map((p) => Number.parseInt(p, 10))
  if (!dd || !mm || !yyyy) return null
  return new Date(yyyy, mm - 1, dd)
}

export function getStartDate(e: EventItem): Date | null {
  return parseDDMMYYYY(e["Start date"])
}

export function getEndDate(e: EventItem): Date | null {
  return parseDDMMYYYY(e["End date"])
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Display as dd-Mmm-yy, e.g. 20-Jan-27
export function formatDate(value: string): string {
  const d = parseDDMMYYYY(value)
  if (!d) return value
  const dd = String(d.getDate()).padStart(2, "0")
  const yy = String(d.getFullYear() % 100).padStart(2, "0")
  return `${dd}-${MONTHS[d.getMonth()]}-${yy}`
}

export function splitEvents(events: EventItem[]) {
  const today = new Date()
  const upcoming: EventItem[] = []
  const past: EventItem[] = []

  for (const e of events) {
    const start = getStartDate(e)
    if (!start) continue
    if (start >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      upcoming.push(e)
    } else {
      past.push(e)
    }
  }

  // Sort rules
  upcoming.sort((a, b) => {
    const da = getStartDate(a)?.getTime() ?? 0
    const db = getStartDate(b)?.getTime() ?? 0
    return da - db // ascending
  })
  past.sort((a, b) => {
    const da = getStartDate(a)?.getTime() ?? 0
    const db = getStartDate(b)?.getTime() ?? 0
    return db - da // descending
  })

  return { upcoming, past }
}

export function uniqueSorted<T>(items: T[]): T[] {
  return Array.from(new Set(items)).sort((a, b) => String(a).localeCompare(String(b)))
}
