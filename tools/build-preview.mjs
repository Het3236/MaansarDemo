/**
 * Builds v1, v3 and v4 into ./docs so one GitHub Pages site can serve all three:
 *   /<repo>/v1/   /<repo>/v3/   /<repo>/v4/
 *
 * Each version is built with Vite `base` set to its subpath, then any
 * root-absolute "/media/..." literals left in the output (they live in JSX,
 * JSON data files and CSS, so Vite does not rewrite them) are prefixed too.
 *
 * Usage:  node tools/build-preview.mjs            (default prefix /MaansarDemo)
 *         node tools/build-preview.mjs --prefix=  (for a root domain)
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const VERSIONS = ['v1', 'v3', 'v4']
const REWRITE_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.webmanifest'])

const prefixArg = process.argv.find((a) => a.startsWith('--prefix='))
const PREFIX = (prefixArg ? prefixArg.slice('--prefix='.length) : '/MaansarDemo').replace(/\/$/, '')

const docs = path.join(ROOT, 'docs')

for (const v of VERSIONS) {
  const base = `${PREFIX}/${v}/`
  const srcDir = path.join(ROOT, v)
  const outDir = path.join(srcDir, 'dist-preview')
  const destDir = path.join(docs, v)

  console.log(`\n=== ${v}: vite build --base=${base}`)
  execSync(`npx vite build --base=${base} --outDir dist-preview --emptyOutDir`, {
    cwd: srcDir,
    stdio: 'inherit',
  })

  fs.rmSync(destDir, { recursive: true, force: true })
  fs.mkdirSync(destDir, { recursive: true })
  fs.cpSync(outDir, destDir, { recursive: true })

  // Prefix the root-absolute asset paths the bundler left alone.
  let touched = 0
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(p)
        continue
      }
      if (!REWRITE_EXT.has(path.extname(entry.name).toLowerCase())) continue
      const before = fs.readFileSync(p, 'utf8')
      // Vite already prefixes the refs it understands (index.html attributes),
      // so normalise back to "/media/" first, then prefix every occurrence once.
      let normalised = before
      while (normalised.includes(`${base}media/`)) {
        normalised = normalised.split(`${base}media/`).join('/media/')
      }
      const after = normalised.split('/media/').join(`${base}media/`)
      if (after !== before) {
        fs.writeFileSync(p, after)
        touched++
      }
    }
  }
  walk(destDir)

  // SPA deep links (v1 uses react-router) — Pages serves 404.html for unknown paths.
  const indexHtml = path.join(destDir, 'index.html')
  if (fs.existsSync(indexHtml)) fs.copyFileSync(indexHtml, path.join(destDir, '404.html'))

  fs.rmSync(outDir, { recursive: true, force: true })
  console.log(`=== ${v}: copied to docs/${v} (${touched} file(s) path-rewritten)`)
}

fs.writeFileSync(path.join(docs, '.nojekyll'), '')
console.log('\nDone. docs/ is ready to publish via GitHub Pages.')
