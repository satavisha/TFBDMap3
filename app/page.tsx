"use client";
import { useState } from "react";
import { EventsTable } from "@/components/events-table";
import { useEvents } from "@/components/use-events";
import { splitEvents } from "@/components/event-helpers";
import type { Lang } from "@/components/translator";
import { Hero } from "@/components/hero";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const { events } = useEvents(lang);
  const { upcoming, past } = splitEvents(events);
  const locations = new Set(events.map((event) => event.Location).filter(Boolean));
  return <div className="site-shell">
    <Hero lang={lang} onLangChange={setLang} eventCount={events.length} locationCount={locations.size} />
    <main className="content-wrap">
      <EventsTable title={lang === "en" ? "Upcoming Events" : "\u041f\u0440\u0435\u0434\u0441\u0442\u043e\u044f\u0449\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"} events={upcoming} lang={lang} />
      <EventsTable title={lang === "en" ? "Past Events" : "\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"} events={past} collapsible lang={lang} />
    </main>
    <footer className="site-footer"><span>TFBD Map</span><span>Made for the global dance community</span></footer>
  </div>;
}
