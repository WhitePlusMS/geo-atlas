// Bundle the same Vue application and reviewed runtime files into one HTML.
// It needs no dev server, installation, tile service or network data request.
import { build } from 'vite'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataRoot = resolve(projectRoot, 'public/data')
const outputRoot = resolve(projectRoot, 'DTC_2026_一级提交成果/软件')
const files = ['frontend_meta.json', 'sites.geojson', 'profiles.json', 'bsr.csv', 'evidence.csv', 'source_registry.json', 'world_reference.geojson']
const embedded = Object.fromEntries(files.map((file) => [file, readFileSync(resolve(dataRoot, file), 'utf8').replace(/^\uFEFF/, '')]))
const meta = JSON.parse(embedded['frontend_meta.json'])
if (!meta.level1_ready || meta.review.approved_count !== 66 || meta.spatial_review.multi_site_mapped_count !== 16) {
  throw new Error('The current data has not completed the 66-profile / 16-object review')
}

// Inline dynamic routes in memory. No temporary build directory is deleted.
const result = await build({
  root: projectRoot,
  configFile: resolve(projectRoot, 'vite.config.ts'),
  build: {
    write: false,
    copyPublicDir: false,
    reportCompressedSize: false,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'application.js' } },
  },
})
const output = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output)
const chunks = output.filter((item) => item.type === 'chunk')
if (chunks.length !== 1 || chunks[0].imports.length || chunks[0].dynamicImports.length) {
  throw new Error('Portable output still requires another JavaScript file')
}
const css = output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css')).map((item) => String(item.source)).join('\n')
const dataScript = JSON.stringify(embedded).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
const application = chunks[0].code.replace(/<\/script/gi, '<\\/script')
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f2f6f7"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23087f7a'/%3E%3Ctext x='6' y='25' fill='white' font-family='Arial,sans-serif' font-size='24' font-weight='700'%3ED%3C/text%3E%3Ccircle cx='26' cy='6' r='4' fill='%23ffc16f'/%3E%3C/svg%3E"><title>DTC 2026 一级 GIS 提交版</title><style>${css}</style></head>
<body><div id="app"></div><script>window.__DTC_EMBEDDED_DATA__=${dataScript};</script><script>${application}</script></body></html>\n`
mkdirSync(outputRoot, { recursive: true })
const path = resolve(outputRoot, 'DTC2026_一级GIS.html')
writeFileSync(path, html, 'utf8')
const hashes = Object.fromEntries(files.map((file) => [file, createHash('sha256').update(embedded[file]).digest('hex')]))
writeFileSync(resolve(outputRoot, '离线软件构建记录.json'), `${JSON.stringify({ generated_at: new Date().toISOString(), file: 'DTC2026_一级GIS.html', sha256: createHash('sha256').update(html).digest('hex'), bytes: Buffer.byteLength(html), embedded_files: hashes, review_source_hashes: meta.review_source_hashes }, null, 2)}\n`, 'utf8')
console.log(`portable HTML: ${path} (${Buffer.byteLength(html)} bytes; ${files.length} embedded data files)`)
