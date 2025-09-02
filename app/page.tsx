"use client";

import { useState } from "react";
import FiltersSidebar from "@/components/FiltersSidebar";
import { EventsTable } from "@/components/events-table"; // ✅ fixed import

export default function HomePage() {
  // Shared filter state
  const [filters, setFilters] = useState({ type: [], teachers: [] });

  return (
    <div className="p-4">
      {/* Sidebar Filters (shared for both sections) */}
      <FiltersSidebar filters={filters} setFilters={setFilters} />

      {/* Upcoming Events */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <EventsTable filters={filters} type="upcoming" />
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-xl font-bold mb-4">Past Events</h2>
        <EventsTable filters={filters} type="past" />
      </section>
    </div>
  );
}
