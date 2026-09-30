// Draws FreeChess's home-screen icons (a white knight on a blue tile) as PNG
// files, with no extra tools: the knight's outline is a list of points traced
// from public/favicon.svg, filled with 4 × 4 smoothing, saved with Node's zlib.
// Run: node scripts/makeIcons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

// The knight's outline on a 64 × 64 grid (traced from the favicon's path).
const KNIGHT = [22,50,24.02,50,26.04,50,28.06,50,30.08,50,32.1,50,34.13,50,36.15,50,38.17,50,40.19,50,42.21,50,44.23,50,45.75,50,46,49.75,45.97,49.25,45.9,48.74,45.81,48.25,45.68,47.76,45.51,47.28,45.3,46.82,45.06,46.38,44.78,45.96,44.48,45.56,44.14,45.18,43.78,44.82,43.4,44.49,43.01,44.17,42.6,43.88,42.17,43.61,41.94,43.2,41.85,42.71,41.76,42.21,41.66,41.71,41.57,41.22,41.48,40.72,41.39,40.22,41.29,39.73,41.2,39.23,41.11,38.73,41.01,38.24,40.92,37.74,40.83,37.24,40.73,36.75,40.64,36.25,40.55,35.75,40.74,35.57,41.23,35.69,41.72,35.79,42.22,35.87,42.72,35.94,43.23,35.97,43.73,35.98,44.24,35.96,44.74,35.91,45.24,35.83,45.73,35.71,46.21,35.55,46.67,35.36,47.12,35.13,47.55,34.86,47.96,34.56,48.34,34.22,48.69,33.86,49.02,33.48,49.29,33.05,49.5,32.6,49.64,32.11,49.71,31.61,49.71,31.11,49.65,30.61,49.52,30.12,49.35,29.64,49.14,29.18,48.89,28.74,48.62,28.32,48.31,27.91,47.99,27.53,47.65,27.15,47.3,26.79,46.96,26.42,46.61,26.05,46.27,25.68,45.93,25.31,45.58,24.94,45.24,24.57,44.9,24.2,44.55,23.83,44.21,23.46,43.86,23.09,43.52,22.71,43.18,22.34,42.83,21.97,42.49,21.6,42.15,21.23,41.8,20.86,41.46,20.49,41.11,20.12,40.81,19.72,40.49,19.33,40.15,18.96,39.78,18.62,39.38,18.3,38.96,18.02,38.53,17.77,38.07,17.54,37.61,17.35,37.13,17.18,36.65,17.04,36.34,16.68,36.12,16.23,35.89,15.78,35.66,15.33,35.44,14.87,35.21,14.42,34.99,13.97,34.76,13.52,34.53,13.07,34.22,13.33,33.89,13.71,33.56,14.09,33.23,14.48,32.91,14.86,32.58,15.24,32.25,15.63,31.92,16.01,31.59,16.4,31.14,16.59,30.66,16.74,30.18,16.9,29.71,17.07,29.24,17.27,28.78,17.48,28.33,17.71,27.89,17.95,27.46,18.21,27.04,18.49,26.62,18.78,26.22,19.09,25.84,19.42,25.46,19.75,25.1,20.11,24.75,20.47,24.42,20.85,24.1,21.24,23.79,21.64,23.5,22.06,23.23,22.48,22.97,22.91,22.72,23.36,22.5,23.81,22.28,24.27,22.09,24.73,21.91,25.2,21.74,25.68,21.6,26.17,21.46,26.65,21.35,27.14,21.25,27.64,21.16,28.14,21.09,28.64,21.03,29.14,21,29.64,20.98,30.15,20.96,30.65,20.94,31.16,20.9,32.17,20.86,33.18,20.82,34.19,20.79,35.2,20.75,36.21,20.72,37.22,20.68,38.23,20.65,39.24,20.61,40.25,20.58,41.26,20.54,42.27,20.51,43.28,20.51,43.78,20.25,44.14,19.84,44.43,19.49,44.79,19.21,45.21,19.04,45.69,18.98,46.19,19.04,46.69,19.2,47.17,19.43,47.62,19.71,48.04,20.03,48.42,20.39,48.78,20.77,49.12,21.17,49.43,21.58,49.72]
const EYE = { x: 38.5, y: 24.5, r: 1.8 }
const TOP = [0x6c, 0x9b, 0xff]
const BOTTOM = [0x3d, 0x6f, 0xe0]

function insideKnight(x, y) {
  let inside = false
  for (let i = 0, j = KNIGHT.length - 2; i < KNIGHT.length; j = i, i += 2) {
    const [xi, yi, xj, yj] = [KNIGHT[i], KNIGHT[i + 1], KNIGHT[j], KNIGHT[j + 1]]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function pixel(u, v) {
  // u, v on the 64 grid. Blue gradient tile; white knight; blue eye.
  const t = v / 64
  const bg = TOP.map((c, i) => c + (BOTTOM[i] - c) * t)
  const eye = (u - EYE.x) ** 2 + (v - EYE.y) ** 2 <= EYE.r ** 2
  if (eye) return BOTTOM
  return insideKnight(u, v) ? [255, 255, 255] : bg
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
