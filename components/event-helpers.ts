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

// Country (English and Russian names) -> ISO 3166-1 alpha-2 code, for flag emoji
const COUNTRY_CODES: Record<string, string> = {
  australia: "AU", "\u0430\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f": "AU",
  austria: "AT", "\u0430\u0432\u0441\u0442\u0440\u0438\u044f": "AT",
  belgium: "BE", "\u0431\u0435\u043b\u044c\u0433\u0438\u044f": "BE",
  brazil: "BR", "\u0431\u0440\u0430\u0437\u0438\u043b\u0438\u044f": "BR",
  canada: "CA", "\u043a\u0430\u043d\u0430\u0434\u0430": "CA",
  france: "FR", "\u0444\u0440\u0430\u043d\u0446\u0438\u044f": "FR",
  germany: "DE", "\u0433\u0435\u0440\u043c\u0430\u043d\u0438\u044f": "DE",
  greece: "GR", "\u0433\u0440\u0435\u0446\u0438\u044f": "GR",
  hungary: "HU", "\u0432\u0435\u043d\u0433\u0440\u0438\u044f": "HU",
  india: "IN", "\u0438\u043d\u0434\u0438\u044f": "IN",
  indonesia: "ID", "\u0438\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f": "ID",
  ireland: "IE", "\u0438\u0440\u043b\u0430\u043d\u0434\u0438\u044f": "IE",
  italy: "IT", "\u0438\u0442\u0430\u043b\u0438\u044f": "IT",
  mexico: "MX", "\u043c\u0435\u043a\u0441\u0438\u043a\u0430": "MX",
  morocco: "MA", "\u043c\u0430\u0440\u043e\u043a\u043a\u043e": "MA",
  netherlands: "NL", "\u043d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b": "NL",
  norway: "NO", "\u043d\u043e\u0440\u0432\u0435\u0433\u0438\u044f": "NO",
  poland: "PL", "\u043f\u043e\u043b\u044c\u0448\u0430": "PL",
  portugal: "PT", "\u043f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f": "PT",
  "puerto rico": "PR", "\u043f\u0443\u044d\u0440\u0442\u043e-\u0440\u0438\u043a\u043e": "PR",
  russia: "RU", "\u0440\u043e\u0441\u0441\u0438\u044f": "RU",
  spain: "ES", "\u0438\u0441\u043f\u0430\u043d\u0438\u044f": "ES",
  sweden: "SE", "\u0448\u0432\u0435\u0446\u0438\u044f": "SE",
  switzerland: "CH", "\u0448\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f": "CH",
  turkey: "TR", "\u0442\u0443\u0440\u0446\u0438\u044f": "TR",
  uk: "GB", "united kingdom": "GB", "\u0432\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f": "GB",
  usa: "US", "united states": "US", "\u0441\u0448\u0430": "US",
}

// Flag emoji for the country in a "City, Region, Country" location; "" if unknown
export function countryFlag(location: string): string {
  const parts = location.split(",").map((p) => p.replace(/\(.*?\)/g, "").trim().toLowerCase())
  for (let i = parts.length - 1; i >= 0; i--) {
    const code = COUNTRY_CODES[parts[i]]
    if (code) return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
  }
  return ""
}
