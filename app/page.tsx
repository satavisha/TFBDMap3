"use client";

import { useState } from "react";
import FiltersSidebar from "@/components/FiltersSidebar";
import { EventsTable } from "@/components/events-table"; // ✅ fixed import
import { useEvents } from "@/components/use-events";
import { splitEvents } from "@/components/event-helpers";
import type { Lang } from "@/components/translator";

export default function HomePage() {
  // Shared filter state
  const [filters, setFilters] = useState({ type: [], teachers: [] });
  const [lang, setLang] = useState<Lang>("en");
  const { events } = useEvents(lang);
  const { upcoming, past } = splitEvents(events);

  return (
    <div className="p-4">
      {/* Translate Toggle */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setLang((l) => (l === "en" ? "ru" : "en"))}
          className="rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) hover:bg-(--color-gold)/20"
          aria-label="Translate"
        >
          {lang === "en" ? "RU" : "EN"}
        </button>
      </div>

      {/* Sidebar Filters (shared for both sections) */}
      <FiltersSidebar filters={filters} setFilters={setFilters} lang={lang} />

      {/* Upcoming Events */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">{lang === "en" ? "Upcoming Events" : "Предстоящие события"}</h2>
        <EventsTable title="" events={upcoming} lang={lang} />
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-xl font-bold mb-4">{lang === "en" ? "Past Events" : "Прошедшие события"}</h2>
        <EventsTable title="" events={past} collapsible lang={lang} />
      </section>
    </div>
  );
}
