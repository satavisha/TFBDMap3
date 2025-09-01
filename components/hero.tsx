"use client"

import Link from "next/link"

const TELEGRAM_URL = "https://t.me/TFBDMap" // TODO: replace with your real Telegram invite link

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 mandala-bg" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
        <h1 className="h-serif text-balance text-3xl md:text-5xl font-bold text-(--color-brand)">
          {"🌍 One Global Map. One Global Community."}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-(--color-brand)">
          {
            "Dancers, teachers, and organizers connected in one place. Share your events, discover new opportunities, and grow together."
          }
        </p>

        <div className="mt-8">
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

        {/* Removed the animated tagline block below the CTA as requested */}
      </div>
    </header>
  )
}
