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

  // Deep links (v1 uses react-router) survive a reload: the site's 404.html
  // bounces /v1/work/x to /v1/?/work/x, and this puts the path back before the
  // app boots. GitHub Pages only ever serves the 404.html at the site root.
  const indexHtml = path.join(destDir, 'index.html')
  if (fs.existsSync(indexHtml)) {
    const html = fs.readFileSync(indexHtml, 'utf8')
    if (!html.includes('restore-deep-link')) {
      fs.writeFileSync(
        indexHtml,
        html.replace(
          /<head>/i,
          `<head>
    <script data-role="restore-deep-link">
      (function () {
        var s = window.location.search
        if (s.charAt(1) !== '/') return
        var parts = s.slice(2).split('&')
        var deep = parts.shift().replace(/~and~/g, '&')
        var query = parts.length ? '?' + parts.join('&').replace(/~and~/g, '&') : ''
        window.history.replaceState(null, null, window.location.pathname + deep + query + window.location.hash)
      })()
    </script>`,
        ),
      )
    }
  }

  fs.rmSync(outDir, { recursive: true, force: true })
  console.log(`=== ${v}: copied to docs/${v} (${touched} file(s) path-rewritten)`)
}

// The site-wide 404: send /v<n>/<deep path> back into that version's index,
// and anything else to the version index page.
const prefix = PREFIX ? `${PREFIX}/` : '/'
fs.writeFileSync(
  path.join(docs, '404.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Maansar Studios — redirecting</title>
    <meta name="robots" content="noindex" />
    <script>
      (function () {
        var base = ${JSON.stringify(prefix)}
        var p = window.location.pathname
        if (p.indexOf(base) === 0) {
          var m = p.slice(base.length).match(/^(${VERSIONS.join('|')})\\/(.*)$/)
          if (m && m[2]) {
            var q = window.location.search
            window.location.replace(
              base + m[1] + '/?/' + m[2].replace(/&/g, '~and~') +
                (q ? '&' + q.slice(1).replace(/&/g, '~and~') : '') +
                window.location.hash,
            )
            return
          }
        }
        window.location.replace(base)
      })()
    </script>
  </head>
  <body>
    <noscript><a href="${prefix}">Maansar Studios — website versions</a></noscript>
  </body>
</html>
`,
)

fs.writeFileSync(path.join(docs, '.nojekyll'), '')
console.log('\nDone. docs/ is ready to publish via GitHub Pages.')
