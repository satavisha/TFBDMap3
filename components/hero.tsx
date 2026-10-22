"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogoMorph } from "@/components/logo-morph"

const TELEGRAM_URL = "https://telegram.me/TFBDMap"

type HeroProps = {
  lang?: "en" | "ru";
  onLangChange?: (lang: "en" | "ru") => void;
  animated?: boolean;
}

export function Hero({ lang = "en", onLangChange, animated = false }: HeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!animated) return
    const handleScroll = () => setScrollY(window.scrollY)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [animated])

  const progress = animated ? Math.min(1, Math.max(0, (scrollY - 20) / 300)) : 0
  const floating = animated && scrollY > 170
  const logoStyle = { transform: "scale(" + (1 + progress * 0.55) + ")", opacity: 1 - progress * 0.9 }

  return (
    <header className={`hero original-hero relative overflow-hidden ${animated ? "v2-enabled" : ""}`}>
      <div className="hero-original-wrap">
        <div className="hero-original-copy">
          <p className="hero-kicker">TFBD MAP / GLOBAL COMMUNITY</p>
          <h1 className="h-serif hero-original-title">
            {lang === "en"
              ? "TFBD Map \u{1F30D} : One Global Map. One Global Community."
              : "\u041a\u0430\u0440\u0442\u0430 \u0422\u0424\u0411\u0414 \u{1F30D}: \u041e\u0434\u043d\u0430 \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430. \u041e\u0434\u043d\u043e \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u043e\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u043e."}
          </h1>
          <p className="hero-original-description">
            {lang === "en"
              ? "Dancers, teachers, and organizers connected in one place. Share your events, discover new opportunities, and grow together."
              : "\u0422\u0430\u043d\u0446\u043e\u0440\u044b, \u0443\u0447\u0438\u0442\u0435\u043b\u044f \u0438 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u044b \u043e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u044b \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435. \u0414\u0435\u043b\u0438\u0442\u0435\u0441\u044c \u0441\u0432\u043e\u0438\u043c\u0438 \u0441\u043e\u0431\u044b\u0442\u0438\u044f\u043c\u0438, \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0439\u0442\u0435 \u043d\u043e\u0432\u044b\u0435 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438 \u0438 \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u0439\u0442\u0435\u0441\u044c \u0432\u043c\u0435\u0441\u0442\u0435."}
          </p>
          <div className="hero-original-actions">
            <Link href={TELEGRAM_URL} className="btn-primary hero-original-cta">
              <span role="img" aria-hidden>{"\u{1F483}"}</span>
              <span className="font-medium">
                {lang === "en" ? "Join the TFBD Community on Telegram" : "\u041f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u044f\u0439\u0442\u0435\u0441\u044c \u043a \u0441\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u0443 TFBD \u0432 Telegram"}
              </span>
            </Link>
          </div>
        </div>
        <div className={`hero-original-art ${animated && floating ? "v2-art-hidden" : ""}`}>
          <LogoMorph className={`hero-original-logo ${animated && floating ? "v2-floating-logo" : ""}`} style={logoStyle} />
        </div>
        <button
          onClick={() => onLangChange?.(lang === "en" ? "ru" : "en")}
          className="hero-original-language"
          aria-label="Change Language"
        >
          {lang === "en" ? "Language : RU" : "\u042f\u0437\u044b\u043a : EN"}
        </button>
      </div>
    </header>
  )
}
