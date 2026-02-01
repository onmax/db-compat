import type { CapabilityResults, TargetId } from '../packages/data/src/types'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { createBunSqliteDriver } from '../tests/drivers/bun-sqlite'
import { runAllTests } from '../tests/runner'

async function generate() {
  const results: Partial<Record<TargetId, CapabilityResults>> = {}

  console.log('Testing bun-sqlite...')
  const driver = createBunSqliteDriver()
  results['bun-sqlite'] = await runAllTests(driver)
  await driver.close()

  const outPath = process.env.BUN_RESULTS_PATH || resolve(import.meta.dirname, '../.bun-results.json')
  writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`Bun results written to ${outPath}`)

  const caps = results['bun-sqlite']!
  const supported = Object.values(caps).filter(c => c.supported).length
  console.log(`bun-sqlite: ${supported}/${Object.values(caps).length} capabilities`)
}

generate().catch(console.error)
