"use client"

import Link from "next/link"
import { Hero } from "@/components/hero"
import { useEvents } from "@/components/use-events"
import { splitEvents } from "@/components/event-helpers"
import { EventsTable } from "@/components/events-table"

const TELEGRAM_URL = "https://t.me/your_tfbd_group" // TODO: replace with your real Telegram invite link

export default function Page() {
  const { events, isLoading, error } = useEvents()
  const { upcoming, past } = splitEvents(events)

  return (
    <main>
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {isLoading && <p className="mt-10 text-(--color-brand)/80">Loading events…</p>}
        {error && <p className="mt-10 text-red-600">Failed to load events.</p>}
        {!isLoading && !error && (
          <>
            <EventsTable title="Upcoming Events" events={upcoming} />

            <EventsTable title="Past Events (Archive)" events={past} defaultOpen={false} collapsible />
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-(--color-brand)/10 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center">
          <h3 className="h-serif text-2xl font-semibold text-(--color-brand)">
            {"Be part of the global TFBD community"}
          </h3>
          <p className="mt-2 text-(--color-brand)/80">
            {"Share your event, discover new opportunities, and grow together."}
          </p>
          <div className="mt-6">
            <Link
              href={TELEGRAM_URL}
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 btn-primary transition-colors"
            >
              <span role="img" aria-hidden>
                💃
              </span>
              <span className="font-medium">Join the TFBD Community on Telegram</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky mobile button */}
      <div className="fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
        <Link
          href={TELEGRAM_URL}
          className="mx-auto block w-full max-w-md rounded-full px-5 py-3 text-center btn-primary shadow-lg"
        >
          + Add Event via Telegram
        </Link>
      </div>
    </main>
  )
}
