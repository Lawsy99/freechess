// Draws FreeChess's home-screen icons (a white knight on a blue tile, with a
// gold star) as PNG files, with no extra tools: the shapes are the same paths
// as public/favicon.svg and src/fc/Logo.tsx (Sep 2026 redraw), flattened into
// points, filled with 4 × 4 smoothing, and saved with Node's zlib.
// Run: node scripts/makeIcons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const KNIGHT =
  'M18.5 49.5C18.5 44 21.5 40.5 27.5 37.5L16 36.5C13 36.3 11.2 34.2 11.8 31.4L13.2 27.8C15.2 21.8 19.5 16.8 25 13.6L28.2 5.2L32.4 11.8C40.4 12.8 46.4 18.6 47.8 27.2C48.8 34.2 47.4 41.6 46.6 49.5Z'
const MANE = 'M40 15.5C43.5 19 45 24 44.8 30'
const TOP = [0x6c, 0x9b, 0xff]
const BOTTOM = [0x3d, 0x6f, 0xe0]
const WHITE = [255, 255, 255]
const MANE_COLOUR = [0xcf, 0xdc, 0xff]
const GOLD = [0xff, 0xcb, 0x45]
const GOLD_EDGE = [0xe0, 0xa8, 0x20]

/** Absolute M / L / C / Z paths into a list of points (curves in 24 steps). */
function flatten(d) {
  const nums = d.match(/[MLCZ]|-?\d*\.?\d+/g)
  const pts = []
  let i = 0
  let cmd = ''
  let x = 0
  let y = 0
  const n = () => Number(nums[i++])
  while (i < nums.length) {
    if (/[MLCZ]/.test(nums[i])) cmd = nums[i++]
    if (cmd === 'Z') continue
    if (cmd === 'M' || cmd === 'L') {
      x = n()
      y = n()
      pts.push([x, y])
    } else if (cmd === 'C') {
      const [x1, y1, x2, y2, x3, y3] = [n(), n(), n(), n(), n(), n()]
      for (let s = 1; s <= 24; s++) {
        const t = s / 24
        const u = 1 - t
        pts.push([
          u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
          u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
        ])
      }
      x = x3
      y = y3
    }
  }
  return pts
}

function inside(poly, px, py) {
  let hit = false
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xi, yi] = poly[a]
    const [xj, yj] = poly[b]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

function nearLine(line, px, py, width) {
  for (let a = 1; a < line.length; a++) {
    const [x1, y1] = line[a - 1]
    const [x2, y2] = line[a]
    const dx = x2 - x1
    const dy = y2 - y1
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
    if ((px - x1 - t * dx) ** 2 + (py - y1 - t * dy) ** 2 <= (width / 2) ** 2) return true
  }
  return false
}

function roundRect(px, py, x, y, w, h, r) {
  if (px < x || px > x + w || py < y || py > y + h) return false
  const cx = Math.max(x + r, Math.min(x + w - r, px))
  const cy = Math.max(y + r, Math.min(y + h - r, py))
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r
}

/** A five-pointed star, as points. */
function star(cx, cy, outer, inner) {
  return Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? inner : outer
    const a = -Math.PI / 2 + (k * Math.PI) / 5
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
}

const knight = flatten(KNIGHT)
const shadow = knight.map(([x, y]) => [x, y + 2])
const mane = flatten(MANE)
const starOuter = star(51, 13.5, 7.2, 3.1)
const starInner = star(51, 13.5, 6.2, 2.5)

const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t)

function pixel(u, v) {
  const bg = mix(TOP, BOTTOM, v / 64)
  if (inside(starInner, u, v)) return GOLD
  if (inside(starOuter, u, v)) return GOLD_EDGE
  if ((u - 27) ** 2 + (v - 20.5) ** 2 <= 2.3 ** 2) return BOTTOM
  if (inside(knight, u, v)) return nearLine(mane, u, v, 2) ? MANE_COLOUR : WHITE
  if (roundRect(u, v, 14, 49.5, 36, 6.5, 3.2)) return WHITE
  if (inside(shadow, u, v)) return mix(bg, [0, 0, 0], 0.18)
  return bg
}

function render(size) {
  const rows = []
  const k = 64 / size
  const SS = 4
  for (let y = 0; y < size; y++) {
    const row = [0]
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0]
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const c = pixel((x + (sx + 0.5) / SS) * k, (y + (sy + 0.5) / SS) * k)
          sum[0] += c[0]
          sum[1] += c[1]
          sum[2] += c[2]
        }
      row.push(...sum.map((s) => Math.round(s / (SS * SS))))
    }
    rows.push(Buffer.from(row))
  }
  return png(size, Buffer.concat(rows))
}

const CRC = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})
function crc32(buf) {
  let c = -1
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(size, raw) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // colour type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [file, size] of [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
]) {
  writeFileSync(file, render(size))
  console.log('wrote', file)
}
