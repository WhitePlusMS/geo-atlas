import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataRoot = resolve(projectRoot, 'public', 'data')
const files = [
  'sites.geojson',
  'profiles.json',
  'bsr.csv',
  'evidence.csv',
  'source_registry.json',
  'frontend_meta.json',
]

// 仅在确认数据更新后主动执行；正常构建只验证已有校验和。
const checksums = {}
for (const file of files) {
  const bytes = readFileSync(resolve(dataRoot, file))
  checksums[file] = createHash('sha256').update(bytes).digest('hex')
}
writeFileSync(resolve(dataRoot, '.checksums.json'), `${JSON.stringify(checksums, null, 2)}\n`, 'utf8')
console.log(`updated checksums for ${files.length} frontend data files`)
