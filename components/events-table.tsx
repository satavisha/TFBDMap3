"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, ExternalLink, Search, SlidersHorizontal } from "lucide-react"
import { applyFilters, useFilters } from "./filters"
import type { EventItem } from "./types"
import { formatDate } from "./event-helpers"
type Props = { title: string; events: EventItem[]; defaultOpen?: boolean; collapsible?: boolean; lang?: "en" | "ru" }

export function EventsTable({ title, events, defaultOpen = true, collapsible = false, lang = "en" }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { filters, setQuery, setLocation, toggleType, toggleTeacher, clearAll, locations, typeOptions, teacherOptions } = useFilters(events)
  const filtered = useMemo(() => applyFilters(events, filters), [events, filters])
  const ru = lang === "ru"
  const tt = { search: ru ? "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0432\u0441\u0435\u043c \u043f\u043e\u043b\u044f\u043c..." : "Search all fields...", location: ru ? "\u041c\u0435\u0441\u0442\u043e" : "Location", type: ru ? "\u0422\u0438\u043f" : "Type", teachers: ru ? "\u041f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u0438" : "Teachers", clear: ru ? "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c" : "Clear", visit: ru ? "\u041f\u0435\u0440\u0435\u0439\u0442\u0438" : "Visit", noEvents: ru ? "\u041d\u0435\u0442 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e \u0442\u0435\u043a\u0443\u0449\u0438\u043c \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c." : "No events match your filters.", hidePast: ru ? "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435" : "Hide past events", showPast: ru ? "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435" : "Show past events" }
  const section = <section aria-label={title} className="events-section"><div className="events-heading"><div className="events-title-row"><h2 className="section-title section-title-small">{title}</h2><span className="result-count">{filtered.length} {ru ? "\u043d\u0430\u0439\u0434\u0435\u043d\u043e" : "listed"}</span></div>
    <div className="filters-toolbar"><label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">{tt.search}</span><input type="search" placeholder={tt.search} value={filters.query} onChange={(e) => setQuery(e.target.value)} className="search-input" /></label><div className="filter-actions"><select value={filters.location} onChange={(e) => setLocation(e.target.value as any)} className="filter-select" aria-label={tt.location}>{locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select>
      <details className="filter-menu"><summary><SlidersHorizontal size={15} />{tt.type}<ChevronDown size={14} /></summary><div className="filter-menu-panel">{typeOptions.map((t) => <label key={t} className="filter-check"><input type="checkbox" checked={filters.types.has(t)} onChange={() => toggleType(t)} /><span>{t}</span></label>)}</div></details>
      <details className="filter-menu"><summary><SlidersHorizontal size={15} />{tt.teachers}<ChevronDown size={14} /></summary><div className="filter-menu-panel teacher-panel">{teacherOptions.map((t) => <label key={t} className="filter-check"><input type="checkbox" checked={filters.teachers.has(t)} onChange={() => toggleTeacher(t)} /><span>{t}</span></label>)}</div></details>
      <button onClick={clearAll} className="clear-button">{tt.clear}</button></div></div></div>
    <div className="events-table-wrap"><table className="events-table"><thead><tr><th>Event</th><th>{tt.type}</th><th>{tt.location}</th><th>Start</th><th>End</th><th>{tt.teachers}</th><th>Web</th></tr></thead><tbody>
      {filtered.map((e, idx) => <tr key={e.Name + idx}><td className="event-name">{e.Name}<span>{e.Type}</span></td><td className="event-type">{e.Type}</td><td>{e.Location}</td><td>{formatDate(e["Start date"])}</td><td>{formatDate(e["End date"])}</td><td className="event-teachers">{e.Teachers}</td><td>{e.Website ? <Link href={e.Website} target="_blank" rel="noopener noreferrer" className="visit-link"><span>{tt.visit}</span><ExternalLink size={14} /></Link> : <span className="muted-dash">-</span>}</td></tr>)}
      {filtered.length === 0 && <tr><td className="empty-state" colSpan={7}>{tt.noEvents}</td></tr>}</tbody></table>
      <div className="event-cards">{filtered.map((e, idx) => <article className="event-card" key={"card-" + e.Name + idx}><div className="event-card-top"><span className="event-type-pill">{e.Type}</span><span className="event-card-date">{formatDate(e["Start date"])}</span></div><h3>{e.Name}</h3><p className="event-card-meta"><span>{e.Location}</span><span>{e.Teachers}</span></p><div className="event-card-bottom"><span>{formatDate(e["Start date"]) + " - " + formatDate(e["End date"])}</span>{e.Website && <Link href={e.Website} target="_blank" rel="noopener noreferrer" className="visit-link"><span>{tt.visit}</span><ExternalLink size={14} /></Link>}</div></article>)}{filtered.length === 0 && <div className="empty-state event-empty">{tt.noEvents}</div>}</div></div>
  </section>
  if (!collapsible) return section
  return <div className="past-events-wrap"><button className="past-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="past-events"><span>{open ? tt.hidePast : tt.showPast}</span><ChevronDown size={16} className={open ? "chevron-up" : ""} /></button><div id="past-events" hidden={!open} className="past-events-content">{section}</div></div>
}
