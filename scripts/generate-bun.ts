import type { CapabilityResults, TargetId } from '../packages/data/src/types'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createDatabase } from 'db0'
import bunSqlite from 'db0/connectors/bun-sqlite'
import { runAllTests } from '../tests/runner'

async function generate() {
  const results: Partial<Record<TargetId, CapabilityResults>> = {}

  console.log('Testing db0-bun-sqlite...')
  const bunDb = createDatabase(bunSqlite({ name: ':memory:' }))
  results['db0-bun-sqlite'] = await runAllTests(bunDb)

  const outPath = process.env.BUN_RESULTS_PATH || resolve(import.meta.dirname, '../.bun-results.json')
  writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`Bun results written to ${outPath}`)

  const caps = results['db0-bun-sqlite']!
  const supported = Object.values(caps).filter(c => c.supported).length
  console.log(`db0-bun-sqlite: ${supported}/${Object.values(caps).length} capabilities`)
}

generate().catch(console.error)
