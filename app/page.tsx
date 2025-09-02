"use client";

import { useState } from "react";
import FiltersSidebar from "@/components/FiltersSidebar";
import { EventsTable } from "@/components/events-table";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-context";
import { useEvents } from "@/components/use-events";

export default function HomePage() {
  // Shared filter state
  const [filters, setFilters] = useState({ type: [], teachers: [] });
  const { t } = useLanguage();
  const { events, isLoading, error } = useEvents();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading events</div>;

  return (
    <div className="p-4">
      <LanguageSwitcher />
      
      {/* Sidebar Filters (shared for both sections) */}
      <FiltersSidebar filters={filters} setFilters={setFilters} />

      {/* Upcoming Events */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">{t('upcoming_events')}</h2>
        <EventsTable title={t('upcoming_events')} events={events} />
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-xl font-bold mb-4">{t('past_events')}</h2>
        <EventsTable title={t('past_events')} events={events} collapsible={true} />
      </section>
    </div>
  );
}
