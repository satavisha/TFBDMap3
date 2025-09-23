"use client";

import { useState } from "react";
import { EventsTable } from "@/components/events-table"; // ✅ fixed import
import { useEvents } from "@/components/use-events";
import { splitEvents } from "@/components/event-helpers";
import type { Lang } from "@/components/translator";
import { Hero } from "@/components/hero";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const { events } = useEvents(lang);
  const { upcoming, past } = splitEvents(events);

  return (
    <div className="p-4">
      {/* Hero Section */}
      <Hero lang={lang} onLangChange={setLang} />

      {/* Upcoming Events */}
      <section className="mb-10">
        <EventsTable title={lang === "en" ? "Upcoming Events" : "Предстоящие события"} events={upcoming} lang={lang} />
      </section>

      {/* Past Events */}
      <section>
        <EventsTable title={lang === "en" ? "Past Events" : "Прошедшие события"} events={past} collapsible lang={lang} />
      </section>
    </div>
  );
}
