"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { EventItem } from "./types"
import { applyFilters, useFilters } from "./filters"

type Props = {
  title: string
  events: EventItem[]
  defaultOpen?: boolean
  collapsible?: boolean
}

export function EventsTable({ title, events, defaultOpen = true, collapsible = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const {
    filters,
    setQuery,
    setLocation,
    toggleType,
    toggleTeacher,
    clearAll,
    locations,
    typeOptions,
    teacherOptions,
  } = useFilters(events)

  const filtered = useMemo(() => applyFilters(events, filters), [events, filters])

  const section = (
    <section aria-label={title} className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="h-serif text-2xl md:text-3xl font-semibold text-(--color-brand)">{title}</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="search"
            placeholder="Search all fields..."
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-64 rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) placeholder:text-(--color-brand)/50 focus:outline-none focus:ring-2 focus:ring-(--color-teal)"
            aria-label="Search all fields"
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.location}
              onChange={(e) => setLocation(e.target.value as any)}
              className="rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) focus:outline-none focus:ring-2 focus:ring-(--color-teal)"
              aria-label="Filter by location"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <details className="rounded-md border border-(--color-brand)/20 bg-white text-sm open:ring-2 open:ring-(--color-teal)">
              <summary className="cursor-pointer select-none px-3 py-2 text-(--color-brand)">Type</summary>
              <div className="max-h-56 w-56 overflow-auto p-3">
                {typeOptions.map((t) => {
                  const checked = filters.types.has(t)
                  return (
                    <label key={t} className="mb-2 flex items-center gap-2 text-(--color-brand)">
                      <input type="checkbox" checked={checked} onChange={() => toggleType(t)} aria-checked={checked} />
                      <span>{t}</span>
                    </label>
                  )
                })}
              </div>
            </details>

            <details className="rounded-md border border-(--color-brand)/20 bg-white text-sm open:ring-2 open:ring-(--color-teal)">
              <summary className="cursor-pointer select-none px-3 py-2 text-(--color-brand)">Teachers</summary>
              <div className="max-h-56 w-64 overflow-auto p-3">
                {teacherOptions.map((t) => {
                  const checked = filters.teachers.has(t)
                  return (
                    <label key={t} className="mb-2 flex items-center gap-2 text-(--color-brand)">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTeacher(t)}
                        aria-checked={checked}
                      />
                      <span>{t}</span>
                    </label>
                  )
                })}
              </div>
            </details>

            <button
              onClick={clearAll}
              className="rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) hover:bg-(--color-gold)/20"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-(--color-brand)/15 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-(--color-cream)">
            <tr className="text-left text-(--color-brand)">
              <th className="px-3 py-2">Event Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Start Date</th>
              <th className="px-3 py-2">End Date</th>
              <th className="px-3 py-2">Teachers</th>
              <th className="px-3 py-2">Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, idx) => (
              <tr key={`${e.Name}-${idx}`} className="border-t border-(--color-brand)/10 text-(--color-brand)">
                <td className="px-3 py-2">{e.Name}</td>
                <td className="px-3 py-2">{e.Type}</td>
                <td className="px-3 py-2">{e.Location}</td>
                <td className="px-3 py-2">{e["Start date"]}</td>
                <td className="px-3 py-2">{e["End date"]}</td>
                <td className="px-3 py-2">{e.Teachers}</td>
                <td className="px-3 py-2">
                  {e.Website ? (
                    <Link
                      href={e.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--color-teal) underline hover:text-(--color-rose)"
                    >
                      Visit
                    </Link>
                  ) : (
                    <span className="text-(--color-brand)/60">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-(--color-brand)/70" colSpan={7}>
                  No events match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

  if (!collapsible) return section

  return (
    <div className="mx-auto max-w-6xl px-4">
      <button
        className="mt-8 w-full rounded-md border border-(--color-brand)/20 bg-white px-4 py-3 text-left text-(--color-brand) hover:bg-(--color-gold)/20 md:w-auto"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="past-events"
      >
        {open ? "Hide Past Events ⬆️" : "Show Past Events ⬇️"}
      </button>
      <div id="past-events" hidden={!open} className="mt-4">
        {section}
      </div>
    </div>
  )
}
