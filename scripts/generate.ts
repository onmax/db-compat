import type { CapabilityCategory, CapabilityResults, CompatibilityDataV2, TargetId } from '../packages/data/src/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { capabilities as capabilityDefs, sqlCategories, targets } from '../packages/data/src/index'
import { createBetterSqlite3Driver } from '../tests/drivers/better-sqlite3'
import { createLibsqlDriver } from '../tests/drivers/libsql'
import { createMysql2Driver } from '../tests/drivers/mysql2'
import { createNodeSqliteDriver } from '../tests/drivers/node-sqlite'
import { createPgDriver } from '../tests/drivers/pg'
import { createPgliteDriver } from '../tests/drivers/pglite'
import { createSqlite3Driver } from '../tests/drivers/sqlite3'
import { runAllTests } from '../tests/runner'

const filter = process.argv[2]?.split(',').map(s => s.trim()) ?? []

function shouldRun(targetId: string): boolean {
  if (filter.length === 0)
    return true
  return filter.some(f => targetId.includes(f))
}

async function generate() {
  const results: Partial<Record<TargetId, CapabilityResults>> = {}

  if (shouldRun('better-sqlite3')) {
    console.log('Testing better-sqlite3...')
    const driver = createBetterSqlite3Driver()
    results['better-sqlite3'] = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('libsql')) {
    console.log('Testing libsql...')
    const driver = createLibsqlDriver()
    results.libsql = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('pglite')) {
    console.log('Testing pglite...')
    const driver = createPgliteDriver()
    results.pglite = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('postgresql') && process.env.POSTGRESQL_URL) {
    console.log('Testing postgresql...')
    const driver = createPgDriver(process.env.POSTGRESQL_URL)
    results.postgresql = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('mysql2') && process.env.MYSQL_URL) {
    console.log('Testing mysql2...')
    const driver = await createMysql2Driver(process.env.MYSQL_URL)
    results.mysql2 = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('sqlite3')) {
    console.log('Testing sqlite3...')
    const driver = await createSqlite3Driver()
    results.sqlite3 = await runAllTests(driver)
    await driver.close()
  }

  if (shouldRun('node-sqlite')) {
    console.log('Testing node-sqlite...')
    const driver = await createNodeSqliteDriver()
    results['node-sqlite'] = await runAllTests(driver)
    await driver.close()
  }

  // Merge external results
  const bunResultsPath = process.env.BUN_RESULTS_PATH
  if (bunResultsPath && existsSync(bunResultsPath) && shouldRun('bun-sqlite')) {
    console.log('Merging bun-sqlite results...')
    Object.assign(results, JSON.parse(readFileSync(bunResultsPath, 'utf-8')))
  }

  const d1ResultsPath = process.env.D1_RESULTS_PATH
  if (d1ResultsPath && existsSync(d1ResultsPath) && shouldRun('d1')) {
    console.log('Merging cloudflare-d1 results...')
    Object.assign(results, JSON.parse(readFileSync(d1ResultsPath, 'utf-8')))
  }

  const hyperdriveResultsPath = process.env.HYPERDRIVE_RESULTS_PATH
  if (hyperdriveResultsPath && existsSync(hyperdriveResultsPath) && shouldRun('hyperdrive')) {
    console.log('Merging hyperdrive results...')
    Object.assign(results, JSON.parse(readFileSync(hyperdriveResultsPath, 'utf-8')))
  }

  // Load existing data for merging
  const outPath = resolve(import.meta.dirname, '../packages/data/data.json')
  const existingData: CompatibilityDataV2 | null = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf-8')) : null

  // Build v2 format
  const testedTargets = Object.keys(results) as TargetId[]
  const now = new Date().toISOString()
  const v2: CompatibilityDataV2 = {
    __meta: {
      version: '0.1.0',
      generatedAt: now,
      targets: {
        ...existingData?.__meta?.targets,
        ...Object.fromEntries(testedTargets.map((id) => {
          const def = targets.find(t => t.id === id)!
          return [id, { version: def.driver, dialect: def.dialect, generatedAt: now }]
        })),
      } as CompatibilityDataV2['__meta']['targets'],
    },
    sql: {} as CompatibilityDataV2['sql'],
  }

  for (const cat of sqlCategories) {
    v2.sql[cat] = {}
    const caps = capabilityDefs.filter(c => c.category === cat)
    for (const cap of caps) {
      v2.sql[cat][cap.id] = {
        description: cap.description,
        support: {
          ...existingData?.sql?.[cat]?.[cap.id]?.support,
          ...Object.fromEntries(testedTargets.map((targetId) => {
            const r = results[targetId]![cap.id]
            return [targetId, { supported: r.supported, ...(r.notes && { notes: r.notes }), ...(r.error && { error: r.error }) }]
          })),
        } as CompatibilityDataV2['sql'][CapabilityCategory][string]['support'],
      }
    }
  }

  writeFileSync(outPath, JSON.stringify(v2, null, 2))
  console.log(`\nResults written to ${outPath}`)

  for (const [target, caps] of Object.entries(results)) {
    const supported = Object.values(caps).filter(c => c.supported).length
    console.log(`${target}: ${supported}/${Object.values(caps).length} capabilities`)
  }
}

generate().catch(console.error)
