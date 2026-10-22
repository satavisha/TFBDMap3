"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { createPixelRenderer, type LogoMorphVariant, type MorphRenderer } from "@/components/logo-morph-renderers"

// Progress runs from 0 (Sata in front of the globe) to 1 (silhouette logo).
const SATA_SRC = "/logo-sata.png"
const LOGO_SRC = "/logo-square.png"
const SATA_HOLD_MS = 3000
const TO_LOGO_MS = 5000
const TO_SATA_MS = 2000

type LogoMorphProps = {
  className?: string
  style?: CSSProperties
  label?: string
  variant?: LogoMorphVariant
}

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

export function LogoMorph({ className, style, label = "TFBD Map logo", variant = "pixel" }: LogoMorphProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const showSataRef = useRef<() => void>(() => {})

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const images: HTMLImageElement[] = []
    let renderer: MorphRenderer | null = null
    let loaded = 0
    let progress = 0
    let from = 0
    let target: 0 | 1 = 0
    let startTime = 0
    let duration = 0
    let frame = 0
    let timer = 0
    let disposed = false

    const render = (now = performance.now()) => {
      if (!renderer) return
      renderer.draw(progress, now)
    }

    const tick = (now: number) => {
      const t = duration > 0 ? Math.min(1, (now - startTime) / duration) : 1
      progress = from + (target - from) * easeInOut(t)
      render(now)
      frame = t < 1 ? requestAnimationFrame(tick) : 0
      if (!frame && target === 0) holdThenReturn()
    }

    const holdThenReturn = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => animateTo(1), SATA_HOLD_MS)
    }

    const animateTo = (next: 0 | 1) => {
      if (next === target && frame) return
      cancelAnimationFrame(frame)
      from = progress
      target = next
      const fullMs = next === 1 ? TO_LOGO_MS : TO_SATA_MS
      duration = Math.abs(target - from) * fullMs
      startTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    // Sata eases in, holds, then turns back into the logo on her own.
    showSataRef.current = () => {
      window.clearTimeout(timer)
      animateTo(0)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const size = Math.round(wrap.clientWidth * dpr)
      if (size && canvas.width !== size) {
        canvas.width = size
        canvas.height = size
        render()
      }
    }
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    resize()

    ;[SATA_SRC, LOGO_SRC].forEach((src, i) => {
      const img = new Image()
      img.decoding = "async"
      img.onload = () => {
        if (disposed) return
        loaded += 1
        if (loaded === 2) {
          const [sata, logo] = images
          renderer = createPixelRenderer(canvas, sata, logo, reduceMotion)
          render()
          wrap.dataset.ready = "true"
          holdThenReturn()
        }
      }
      img.src = src
      images[i] = img
    })

    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      renderer?.dispose()
    }
  }, [variant])

  return (
    <div
      ref={wrapRef}
      className={`logo-morph ${className ?? ""}`}
      style={style}
      role="img"
      aria-label={label}
      tabIndex={0}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") showSataRef.current() }}
      onPointerUp={(e) => { if (e.pointerType !== "mouse") showSataRef.current() }}
      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) showSataRef.current() }}
    >
      <canvas key={variant} ref={canvasRef} className="logo-morph-canvas" aria-hidden />
    </div>
  )
}
