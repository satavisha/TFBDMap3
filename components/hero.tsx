"use client"

import Link from "next/link"

const TELEGRAM_URL = "https://telegram.me/TFBDMap" // TODO: replace with your real Telegram invite link

type HeroProps = {
  lang?: "en" | "ru";
  onLangChange?: (lang: "en" | "ru") => void;
}

export function Hero({ lang = "en", onLangChange }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 mandala-bg" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
        {/* Language Button - Top Right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onLangChange?.(lang === "en" ? "ru" : "en")}
            className="rounded-md border border-(--color-brand)/20 bg-white px-3 py-2 text-sm text-(--color-brand) hover:bg-(--color-gold)/20"
            aria-label="Change Language"
          >
            {lang === "en" ? "Language : RU" : "Язык : EN"}
          </button>
        </div>

        <h1 className="h-serif text-balance text-3xl md:text-5xl font-bold text-(--color-brand)">
          {lang === "en" ? "TFBD Map 🌍 : One Global Map. One Global Community." : "Карта ТФБД 🌍: Одна глобальная карта. Одно глобальное сообщество."}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-(--color-brand)">
          {
            lang === "en"
              ? "Dancers, teachers, and organizers connected in one place. Share your events, discover new opportunities, and grow together."
              : "Танцоры, учителя и организаторы объединены в одном месте. Делитесь своими событиями, открывайте новые возможности и развивайтесь вместе."
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
            <span className="font-medium">
              {lang === "en" ? "Join the TFBD Community on Telegram" : "Присоединяйтесь к сообществу TFBD в Telegram"}
            </span>
          </Link>
        </div>

        {/* Removed the animated tagline block below the CTA as requested */}
      </div>
    </header>
  )
}
