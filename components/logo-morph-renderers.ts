// Each renderer draws one frame of the Sata -> logo transition.
// progress runs from 0 (Sata in front of the globe) to 1 (silhouette logo).
export type LogoMorphVariant = "pixel"

export type MorphRenderer = {
  draw: (progress: number, now: number) => void
  dispose: () => void
}

const MAX_BLOCK_RATIO = 1 / 13

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

// Pixel: the image breaks into growing square blocks, swaps at the blockiest point, then sharpens.
export function createPixelRenderer(canvas: HTMLCanvasElement, sata: HTMLImageElement, logo: HTMLImageElement, reduceMotion: boolean): MorphRenderer | null {
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const scratch = document.createElement("canvas")
  const scratchCtx = scratch.getContext("2d")!

  const drawMosaic = (img: HTMLImageElement, block: number, alpha: number) => {
    if (alpha <= 0.002) return
    const { width, height } = canvas
    ctx.globalAlpha = alpha
    if (block <= 1) {
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(img, 0, 0, width, height)
      return
    }
    const w = Math.max(1, Math.round(width / block))
    const h = Math.max(1, Math.round(height / block))
    scratch.width = w
    scratch.height = h
    scratchCtx.imageSmoothingEnabled = true
    scratchCtx.drawImage(img, 0, 0, w, h)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(scratch, 0, 0, w, h, 0, 0, width, height)
  }

  // Fractional block sizes blend the two nearest whole sizes so the blocks grow without stepping.
  const drawLayer = (img: HTMLImageElement, block: number, alpha: number) => {
    const lower = Math.floor(block)
    const mix = block - lower
    if (mix < 0.01) return drawMosaic(img, lower, alpha)
    drawMosaic(img, lower, alpha)
    drawMosaic(img, lower + 1, alpha * mix)
  }

  return {
    draw(progress) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Distance from the nearest crisp end: 0 at either end, 1 at the midpoint.
      const depth = 1 - Math.abs(progress * 2 - 1)
      const maxBlock = canvas.width * MAX_BLOCK_RATIO
      const block = reduceMotion ? 1 : 1 + easeInOut(depth) * (maxBlock - 1)
      // A blend around the swap keeps the change between images from popping.
      const blendWidth = reduceMotion ? 1 : 0.32
      const logoAlpha = Math.min(1, Math.max(0, (progress - 0.5) / blendWidth + 0.5))
      drawLayer(sata, block, 1 - logoAlpha)
      drawLayer(logo, block, logoAlpha)
      ctx.globalAlpha = 1
    },
    dispose() {},
  }
}
