import type { CapabilityCategory, CapabilityResults, CompatibilityData, CompatibilityDataV2, TargetId } from '../packages/data/src/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createDatabase } from 'db0'
import betterSqlite3 from 'db0/connectors/better-sqlite3'
import libsql from 'db0/connectors/libsql/node'
import mysql2 from 'db0/connectors/mysql2'
import nodeSqlite from 'db0/connectors/node-sqlite'
import pglite from 'db0/connectors/pglite'
import postgresql from 'db0/connectors/postgresql'
import sqlite3 from 'db0/connectors/sqlite3'
import { capabilities as capabilityDefs, targets } from '../packages/data/src/index'
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

  // postgresql (if available)
  if (process.env.POSTGRESQL_URL) {
    console.log('Testing db0-postgresql...')
    const pg = createDatabase(postgresql({ url: process.env.POSTGRESQL_URL }))
    results['db0-postgresql'] = await runAllTests(pg)
  }

  // mysql2 (if available)
  if (process.env.MYSQL_URL) {
    console.log('Testing db0-mysql2...')
    const mysql = createDatabase(mysql2({ uri: process.env.MYSQL_URL }))
    results['db0-mysql2'] = await runAllTests(mysql)
  }

  // sqlite3
  console.log('Testing db0-sqlite3...')
  const sqlite3Db = createDatabase(sqlite3({ name: ':memory:' }))
  results['db0-sqlite3'] = await runAllTests(sqlite3Db)

  // node-sqlite (Node 22+)
  console.log('Testing db0-node-sqlite...')
  const nodeSqliteDb = createDatabase(nodeSqlite({ name: ':memory:' }))
  results['db0-node-sqlite'] = await runAllTests(nodeSqliteDb)

  // Merge bun results if available
  const bunResultsPath = process.env.BUN_RESULTS_PATH
  if (bunResultsPath && existsSync(bunResultsPath)) {
    console.log('Merging bun-sqlite results...')
    const bunResults = JSON.parse(readFileSync(bunResultsPath, 'utf-8')) as Record<TargetId, CapabilityResults>
    Object.assign(results, bunResults)
  }

  // Build v2 format
  const testedTargets = Object.keys(results) as TargetId[]
  const v2: CompatibilityDataV2 = {
    __meta: {
      version: '0.0.1',
      generatedAt: new Date().toISOString(),
      targets: Object.fromEntries(testedTargets.map((id) => {
        const def = targets.find(t => t.id === id)!
        return [id, { version: 'db0@0.3.4', dialect: def.dialect }]
      })) as CompatibilityDataV2['__meta']['targets'],
    },
    capabilities: {} as CompatibilityDataV2['capabilities'],
  }

  // Group capabilities by category
  const categories: CapabilityCategory[] = ['transactions', 'types', 'json', 'queries', 'fts', 'constraints', 'other']
  for (const cat of categories) {
    v2.capabilities[cat] = {}
    const caps = capabilityDefs.filter(c => c.category === cat)
    for (const cap of caps) {
      v2.capabilities[cat][cap.id] = {
        description: cap.description,
        support: Object.fromEntries(testedTargets.map((targetId) => {
          const r = results[targetId]![cap.id]
          return [targetId, { supported: r.supported, ...(r.notes && { notes: r.notes }), ...(r.error && { error: r.error }) }]
        })) as CompatibilityDataV2['capabilities'][CapabilityCategory][string]['support'],
      }
    }
  }

  // Write v2 format
  const outPath = resolve(import.meta.dirname, '../packages/data/data.json')
  writeFileSync(outPath, JSON.stringify(v2, null, 2))
  console.log(`\nResults written to ${outPath}`)

  // Print summary
  for (const [target, caps] of Object.entries(results)) {
    const supported = Object.values(caps).filter(c => c.supported).length
    const total = Object.values(caps).length
    console.log(`${target}: ${supported}/${total} capabilities`)
  }
}

generate().catch(console.error)
