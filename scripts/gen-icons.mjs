// Generates the PWA PNG icons from the scanner's visual language (a cyan dial +
// needle, with reticle brackets) on the dark background — no hand-authored
// binary assets, no runtime deps. Run: `node scripts/gen-icons.mjs`.
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const BG = [5, 7, 10]
const FG = [95, 208, 255] // --accent

// ── PNG encoding (RGBA, 8-bit) ──────────────────────────────────────────────
const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

// ── Drawing ─────────────────────────────────────────────────────────────────
function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}
function isFg(x, y, size, brackets) {
  const c = size / 2
  const d = Math.hypot(x - c, y - c)
  if (d <= 0.3 * size && d >= 0.235 * size) return true // dial ring
  if (d <= 0.045 * size) return true // hub
  const ang = (-50 * Math.PI) / 180 // needle, up-right
  if (distToSeg(x, y, c, c, c + Math.cos(ang) * 0.27 * size, c + Math.sin(ang) * 0.27 * size) <= 0.018 * size) return true
  if (brackets) {
    const m = 0.1 * size
    const len = 0.17 * size
    const th = 0.035 * size
    const r = (x0, y0, x1, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1
    if (r(m, m, m + len, m + th) || r(m, m, m + th, m + len)) return true
    if (r(size - m - len, m, size - m, m + th) || r(size - m - th, m, size - m, m + len)) return true
    if (r(m, size - m - th, m + len, size - m) || r(m, size - m - len, m + th, size - m)) return true
    if (r(size - m - len, size - m - th, size - m, size - m) || r(size - m - th, size - m - len, size - m, size - m)) return true
  }
  return false
}
function render(size, { brackets = true } = {}) {
  const SS = 4
  const out = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cov = 0
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++)
          if (isFg(x + (sx + 0.5) / SS, y + (sy + 0.5) / SS, size, brackets)) cov++
      const a = cov / (SS * SS)
      const i = (y * size + x) * 4
      out[i] = Math.round(BG[0] * (1 - a) + FG[0] * a)
      out[i + 1] = Math.round(BG[1] * (1 - a) + FG[1] * a)
      out[i + 2] = Math.round(BG[2] * (1 - a) + FG[2] * a)
      out[i + 3] = 255
    }
  }
  return encodePNG(size, out)
}

mkdirSync(PUBLIC, { recursive: true })
const files = [
  ['icon-192.png', render(192)],
  ['icon-512.png', render(512)],
  ['apple-touch-icon-180.png', render(180)],
  ['maskable-512.png', render(512, { brackets: false })], // safe-zone content for masking
]
for (const [name, buf] of files) {
  writeFileSync(join(PUBLIC, name), buf)
  console.log(`wrote public/${name} (${buf.length} bytes)`)
}
