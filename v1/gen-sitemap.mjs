import fs from 'node:fs'
import { PROJECTS } from './src/data/projects.js'

const base = process.env.SITE_URL || 'https://maansarstudios.com'
const today = new Date().toISOString().slice(0, 10)
const urls = [['/', '1.0'], ...PROJECTS.map((p) => [`/work/${p.slug}`, '0.8'])]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    ([loc, pr]) =>
      `  <url>\n    <loc>${base}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${pr}</priority>\n  </url>`,
  ),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync('public/sitemap.xml', xml)
console.log(`sitemap.xml written with ${urls.length} urls`)
