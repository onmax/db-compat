import type { CompatibilityData } from '../packages/data/src/types'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createDatabase } from 'db0'
import betterSqlite3 from 'db0/connectors/better-sqlite3'
import libsql from 'db0/connectors/libsql/node'
import pglite from 'db0/connectors/pglite'
import { runAllTests } from '../tests/runner'

async function generate() {
  const results: Partial<CompatibilityData> = {}

  // better-sqlite3
  console.log('Testing db0-better-sqlite3...')
  const sqlite = createDatabase(betterSqlite3({ name: ':memory:' }))
  results['db0-better-sqlite3'] = await runAllTests(sqlite)

  // libsql
  console.log('Testing db0-libsql...')
  const libsqlDb = createDatabase(libsql({ url: ':memory:' }))
  results['db0-libsql'] = await runAllTests(libsqlDb)

  // pglite
  console.log('Testing db0-pglite...')
  const pgliteDb = createDatabase(pglite())
  results['db0-pglite'] = await runAllTests(pgliteDb)

  // Write results
  const outPath = resolve(import.meta.dirname, '../packages/data/data.json')
  writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`\nResults written to ${outPath}`)

  // Print summary
  for (const [target, caps] of Object.entries(results)) {
    const supported = Object.values(caps).filter(c => c.supported).length
    const total = Object.values(caps).length
    console.log(`${target}: ${supported}/${total} capabilities`)
  }
}

generate().catch(console.error)
