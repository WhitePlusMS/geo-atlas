import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = resolve(projectRoot, '..', 'DTC_2026_前端直接使用')
const targetRoot = resolve(projectRoot, 'public', 'data')
const files = [
  'sites.geojson',
  'profiles.json',
  'bsr.csv',
  'evidence.csv',
  'source_registry.json',
  'frontend_meta.json',
]

mkdirSync(targetRoot, { recursive: true })
const checksums = {}
for (const file of files) {
  const source = resolve(sourceRoot, file)
  const target = resolve(targetRoot, file)
  const bytes = readFileSync(source)
  copyFileSync(source, target)
  checksums[file] = createHash('sha256').update(bytes).digest('hex')
}
writeFileSync(resolve(targetRoot, '.checksums.json'), `${JSON.stringify(checksums, null, 2)}\n`, 'utf8')
console.log(`synced ${files.length} frontend data files`)
