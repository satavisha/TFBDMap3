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
  lang?: "en" | "ru"
}

export function EventsTable({ title, events, defaultOpen = true, collapsible = false, lang = "en" }: Props) {
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

  const tt = {
    search: lang === "en" ? "Search all fields..." : "Поиск по всем полям...",
    filterByLocation: lang === "en" ? "Filter by location" : "Фильтр по локации",
    type: lang === "en" ? "Type" : "Тип",
    teachers: lang === "en" ? "Teachers" : "Преподаватели",
    clear: lang === "en" ? "Clear" : "Очистить",
    eventName: lang === "en" ? "Event Name" : "Название события",
    location: lang === "en" ? "Location" : "Место",
    startDate: lang === "en" ? "Start Date" : "Дата начала",
    endDate: lang === "en" ? "End Date" : "Дата окончания",
    website: lang === "en" ? "Website" : "Сайт",
    visit: lang === "en" ? "Visit" : "Перейти",
    hidePast: lang === "en" ? "Hide Past Events ⬆️" : "Скрыть прошедшие события ⬆️",
    showPast: lang === "en" ? "Show Past Events ⬇️" : "Показать прошедшие события ⬇️",
    noEvents: lang === "en" ? "No events match your filters." : "Нет событий по текущим фильтрам.",
  }

  const section = (
    <section aria-label={title} className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="h-serif text-2xl md:text-3xl font-semibold text-(--color-brand)">{title}</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="search"
            placeholder={tt.search}
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-64 rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) placeholder:text-(--color-brand)/50 focus:outline-none focus:ring-2 focus:ring-(--color-teal)"
            aria-label={tt.search}
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.location}
              onChange={(e) => setLocation(e.target.value as any)}
              className="rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) focus:outline-none focus:ring-2 focus:ring-(--color-teal)"
              aria-label={tt.filterByLocation}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <details className="rounded-md border border-(--color-brand)/20 bg-white text-sm open:ring-2 open:ring-(--color-teal)">
              <summary className="cursor-pointer select-none px-3 py-2 text-(--color-brand)">{tt.type}</summary>
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
              <summary className="cursor-pointer select-none px-3 py-2 text-(--color-brand)">{tt.teachers}</summary>
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
              aria-label={tt.clear}
            >
              {tt.clear}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-(--color-brand)/15 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-(--color-cream)">
            <tr className="text-left text-(--color-brand)">
              <th className="px-3 py-2">{tt.eventName}</th>
              <th className="px-3 py-2">{tt.type}</th>
              <th className="px-3 py-2">{tt.location}</th>
              <th className="px-3 py-2">{tt.startDate}</th>
              <th className="px-3 py-2">{tt.endDate}</th>
              <th className="px-3 py-2">{tt.teachers}</th>
              <th className="px-3 py-2">{tt.website}</th>
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
                      {tt.visit}
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
                  {tt.noEvents}
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
        {open ? tt.hidePast : tt.showPast}
      </button>
      <div id="past-events" hidden={!open} className="mt-4">
        {section}
      </div>
    </div>
  )
}
