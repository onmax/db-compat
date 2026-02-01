import type { CapabilityResults, TargetId } from '../packages/data/src/types'
import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { consola } from 'consola'
import { resolve } from 'pathe'
import { createBunSqliteDriver } from '../tests/drivers/bun-sqlite'
import { runAllTests } from '../tests/runner'

interface BunResults {
  results: Partial<Record<TargetId, CapabilityResults>>
  versions: Record<string, string>
}

async function generate() {
  const results: Partial<Record<TargetId, CapabilityResults>> = {}

  consola.start('Testing bun-sqlite...')
  const driver = createBunSqliteDriver()
  results['bun-sqlite'] = await runAllTests(driver)
  await driver.close()

  const output: BunResults = {
    results,
    versions: { 'bun-sqlite': Bun.version },
  }

  const outPath = process.env.BUN_RESULTS_PATH || resolve(import.meta.dirname, '../.bun-results.json')
  writeFileSync(outPath, JSON.stringify(output, null, 2))
  consola.success(`Bun results written to ${outPath}`)

  const caps = results['bun-sqlite']!
  const supported = Object.values(caps).filter(c => c.supported).length
  consola.info(`bun-sqlite: ${supported}/${Object.values(caps).length} capabilities`)
}

generate().catch(consola.error)
