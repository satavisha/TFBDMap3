"use client"

import { useMemo, useState } from "react"
import type { EventItem } from "./types"
import { uniqueSorted } from "./event-helpers"

export type Filters = {
  query: string
  types: Set<string>
  location: string | "All"
  teachers: Set<string>
}

export function useFilters(events: EventItem[]) {
  const [query, setQuery] = useState("")
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [location, setLocation] = useState<string | "All">("All")
  const [teachers, setTeachers] = useState<Set<string>>(new Set())

  const locations = useMemo(() => ["All", ...uniqueSorted(events.map((e) => e.Location).filter(Boolean))], [events])
  const typeOptions = useMemo(() => uniqueSorted(events.map((e) => e.Type).filter(Boolean)), [events])
  const teacherOptions = useMemo(() => {
    const all = new Set<string>()
    for (const e of events) {
      if (!e.Teachers) continue
      e.Teachers.split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => all.add(t))
    }
    return uniqueSorted([...all])
  }, [events])

  const filters: Filters = { query, types, location, teachers }

  const toggleType = (t: string) => {
    const next = new Set(types)
    if (next.has(t)) next.delete(t)
    else next.add(t)
    setTypes(next)
  }

  const toggleTeacher = (t: string) => {
    const next = new Set(teachers)
    if (next.has(t)) next.delete(t)
    else next.add(t)
    setTeachers(next)
  }

  const clearAll = () => {
    setQuery("")
    setTypes(new Set())
    setLocation("All")
    setTeachers(new Set())
  }

  return {
    filters,
    setQuery,
    setLocation,
    toggleType,
    toggleTeacher,
    clearAll,
    locations,
    typeOptions,
    teacherOptions,
  }
}

export function applyFilters(events: EventItem[], f: Filters) {
  const q = f.query.trim().toLowerCase()
  return events.filter((e) => {
    // Global search
    const hay =
      `${e.Name} ${e.Type} ${e.Location} ${e["Start date"]} ${e["End date"]} ${e.Teachers} ${e.Website}`.toLowerCase()
    if (q && !hay.includes(q)) return false

    // Location single-select
    if (f.location !== "All" && e.Location !== f.location) return false

    // Type multi-select
    if (f.types.size > 0 && !f.types.has(e.Type)) return false

    // Teachers multi-select: event must include at least one selected teacher
    if (f.teachers.size > 0) {
      const evTeachers = (e.Teachers || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      const intersects = evTeachers.some((t) => f.teachers.has(t))
      if (!intersects) return false
    }

    return true
  })
}
