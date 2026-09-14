// Generuje favicon.ico / apple-touch-icon.png / icon-512.png z public/favicon.svg.
// Uruchom po zmianie SVG: node scripts/make-favicon.mjs
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
const svg = readFileSync('public/favicon.svg', 'utf8')
const fontFiles = ['public/fonts/inter-latin-700-normal.woff']
const render = (size) => new Resvg(svg, { fitTo: { mode: 'width', value: size }, font: { fontFiles, loadSystemFonts: true, defaultFontFamily: 'Inter' } }).render().asPng()
const png32 = render(32), png180 = render(180), png512 = render(512)
writeFileSync('public/apple-touch-icon.png', png180)
writeFileSync('public/icon-512.png', png512)
// ICO z osadzonym PNG (obslugiwane przez wszystkie wspolczesne przegladarki)
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4)
const entry = Buffer.alloc(16); entry[0] = 32; entry[1] = 32; entry[2] = 0; entry[3] = 0
entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6); entry.writeUInt32LE(png32.length, 8); entry.writeUInt32LE(22, 12)
writeFileSync('public/favicon.ico', Buffer.concat([header, entry, png32]))
console.log('ok', png32.length, png180.length)
