"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, ExternalLink, Search, SlidersHorizontal } from "lucide-react"
import { applyFilters, useFilters } from "./filters"
import type { EventItem } from "./types"
import { countryFlag, formatDate } from "./event-helpers"
type MenuId = "type" | "teachers"
const dateParts = (value: string) => formatDate(value).split("-")
type Props = { title: string; events: EventItem[]; defaultOpen?: boolean; collapsible?: boolean; lang?: "en" | "ru"; showFlags?: boolean }

export function EventsTable({ title, events, defaultOpen = true, collapsible = false, lang = "en", showFlags = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  // Only one filter menu is open at a time; the one being replaced dissolves instead of vanishing
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)
  const [leaving, setLeaving] = useState<{ id: MenuId; slow: boolean } | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const actionsRef = useRef<HTMLDivElement>(null)
  const dismiss = (id: MenuId, slow: boolean) => {
    clearTimeout(leaveTimer.current)
    setLeaving({ id, slow })
    leaveTimer.current = setTimeout(() => setLeaving(null), slow ? 1500 : 200)
  }
  const toggleMenu = (id: MenuId) => {
    if (openMenu === id) {
      setOpenMenu(null)
      dismiss(id, false)
      return
    }
    if (leaving?.id === id) {
      clearTimeout(leaveTimer.current)
      setLeaving(null)
    }
    if (openMenu) dismiss(openMenu, true)
    setOpenMenu(id)
  }
  useEffect(() => {
    if (!openMenu) return
    const close = () => {
      setOpenMenu(null)
      dismiss(openMenu, false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!actionsRef.current?.contains(e.target as Node)) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [openMenu])
  useEffect(() => () => clearTimeout(leaveTimer.current), [])
  const { filters, setQuery, setLocation, toggleType, toggleTeacher, clearAll, locations, typeOptions, teacherOptions } = useFilters(events)
  const filtered = useMemo(() => applyFilters(events, filters), [events, filters])
  const ru = lang === "ru"
  const tt = { search: ru ? "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0432\u0441\u0435\u043c \u043f\u043e\u043b\u044f\u043c..." : "Search all fields...", location: ru ? "\u041c\u0435\u0441\u0442\u043e" : "Location", type: ru ? "\u0422\u0438\u043f" : "Type", teachers: ru ? "\u041f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u0438" : "Teachers", clear: ru ? "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c" : "Clear", visit: ru ? "\u041f\u0435\u0440\u0435\u0439\u0442\u0438" : "Visit", noEvents: ru ? "\u041d\u0435\u0442 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e \u0442\u0435\u043a\u0443\u0449\u0438\u043c \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c." : "No events match your filters.", hidePast: ru ? "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435" : "Hide past events", showPast: ru ? "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435" : "Show past events" }
  const section = <section aria-label={title} className="events-section"><div className="events-heading"><div className="events-title-row"><h2 className="section-title section-title-small">{title}</h2><span className="result-count">{filtered.length} {ru ? "\u043d\u0430\u0439\u0434\u0435\u043d\u043e" : "listed"}</span></div>
    <div className="filters-toolbar"><label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">{tt.search}</span><input type="search" placeholder={tt.search} value={filters.query} onChange={(e) => setQuery(e.target.value)} className="search-input" /></label><div className="filter-actions" ref={actionsRef}><select value={filters.location} onChange={(e) => setLocation(e.target.value as any)} className="filter-select" aria-label={tt.location}>{locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select>
      {([{ id: "type", label: tt.type, options: typeOptions, selected: filters.types, toggle: toggleType, panelClass: "" }, { id: "teachers", label: tt.teachers, options: teacherOptions, selected: filters.teachers, toggle: toggleTeacher, panelClass: " teacher-panel" }] as const).map((m) => <div key={m.id} className="filter-menu" data-open={openMenu === m.id}><button type="button" className="filter-trigger" aria-expanded={openMenu === m.id} aria-haspopup="true" onClick={() => toggleMenu(m.id)}><SlidersHorizontal size={15} />{m.label}<ChevronDown size={14} /></button>{(openMenu === m.id || leaving?.id === m.id) && <div className={"filter-menu-panel" + m.panelClass + (openMenu === m.id ? "" : " is-leaving")} data-slow={leaving?.id === m.id && leaving.slow}>{m.options.map((o) => <label key={o} className="filter-check"><input type="checkbox" checked={m.selected.has(o)} onChange={() => m.toggle(o)} /><span>{o}</span></label>)}</div>}</div>)}
      <button onClick={clearAll} className="clear-button">{tt.clear}</button></div></div></div>
    <div className="events-table-wrap"><table className="events-table"><thead><tr><th>Event</th><th>{tt.type}</th><th>{tt.location}</th><th>Start</th><th>End</th><th>{tt.teachers}</th><th>Web</th></tr></thead><tbody>
      {filtered.map((e, idx) => <tr key={e.Name + idx} data-type={e.Type}><td className="event-name">{e.Name}<span>{e.Type}</span></td><td className="event-type">{e.Type}</td><td>{e.Location}</td><td>{formatDate(e["Start date"])}</td><td>{formatDate(e["End date"])}</td><td className="event-teachers">{e.Teachers}</td><td>{e.Website ? <Link href={e.Website} target="_blank" rel="noopener noreferrer" className="visit-link"><span>{tt.visit}</span><ExternalLink size={14} /></Link> : <span className="muted-dash">-</span>}</td></tr>)}
      {filtered.length === 0 && <tr><td className="empty-state" colSpan={7}>{tt.noEvents}</td></tr>}</tbody></table>
      <div className="event-cards">{filtered.map((e, idx) => <article className="event-card" key={"card-" + e.Name + idx} data-type={e.Type}><time className="event-date-block"><b>{dateParts(e["Start date"])[0]}</b><i>{dateParts(e["Start date"])[1]}</i></time><div className="event-card-top"><span className="event-type-pill">{e.Type}</span><span className="event-card-date">{formatDate(e["Start date"])}</span></div><h3>{e.Name}</h3><p className="event-card-meta"><span>{e.Location}{showFlags && countryFlag(e.Location) && <span className="event-flag" aria-hidden="true">{countryFlag(e.Location)}</span>}</span><span className="event-card-teachers" title={e.Teachers}>{e.Teachers}</span></p><div className="event-card-bottom"><span>{formatDate(e["Start date"]) + " - " + formatDate(e["End date"])}</span>{e.Website && <Link href={e.Website} target="_blank" rel="noopener noreferrer" className="visit-link" aria-label={tt.visit + ": " + e.Name}><span>{tt.visit}</span><ExternalLink size={14} /></Link>}</div></article>)}{filtered.length === 0 && <div className="empty-state event-empty">{tt.noEvents}</div>}</div></div>
  </section>
  if (!collapsible) return section
  return <div className="past-events-wrap"><button className="past-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="past-events"><span>{open ? tt.hidePast : tt.showPast}</span><ChevronDown size={16} className={open ? "chevron-up" : ""} /></button><div id="past-events" hidden={!open} className="past-events-content">{section}</div></div>
}
