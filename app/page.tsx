"use client";
import { useState } from "react";
import { EventsTable } from "@/components/events-table";
import { useEvents } from "@/components/use-events";
import { splitEvents } from "@/components/event-helpers";
import type { Lang } from "@/components/translator";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { LayoutGrid, Table } from "lucide-react";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<"cards" | "table">("cards");
  const { events } = useEvents(lang);
  const { upcoming, past } = splitEvents(events);
  const locations = new Set(events.map((event) => event.Location).filter(Boolean));
  const upcomingLocations = new Set(upcoming.map((event) => event.Location).filter(Boolean));
  const ru = lang === "ru";
  return <div className="site-shell">
    <Hero lang={lang} onLangChange={setLang} eventCount={events.length} locationCount={locations.size} />
    <Ticker items={[`${upcoming.length} ${lang === "en" ? "upcoming events" : "\u0441\u043e\u0431\u044b\u0442\u0438\u0439"}`, ...Array.from(upcomingLocations)]} />
    <main className="content-wrap" data-view={view}>
      <div className="view-toggle" role="group" aria-label={ru ? "\u0412\u0438\u0434" : "View"}>
        <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")}><LayoutGrid size={15} aria-hidden="true" />{ru ? "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0438" : "Cards"}</button>
        <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}><Table size={15} aria-hidden="true" />{ru ? "\u0422\u0430\u0431\u043b\u0438\u0446\u0430" : "Table"}</button>
      </div>
      <EventsTable title={lang === "en" ? "Upcoming Events" : "\u041f\u0440\u0435\u0434\u0441\u0442\u043e\u044f\u0449\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"} events={upcoming} lang={lang} showFlags />
      <EventsTable title={lang === "en" ? "Past Events" : "\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"} events={past} collapsible lang={lang} />
    </main>
    <footer className="site-footer"><span>TFBD Map</span><span>Made for the global dance community</span></footer>
  </div>;
}
