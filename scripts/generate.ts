import type { CapabilityCategory, CapabilityResults, CompatibilityDataV2, Db0Category, TargetId } from '../packages/data/src/types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { createDatabase } from 'db0'
import betterSqlite3 from 'db0/connectors/better-sqlite3'
import libsql from 'db0/connectors/libsql/node'
import mysql2 from 'db0/connectors/mysql2'
import nodeSqlite from 'db0/connectors/node-sqlite'
import pglite from 'db0/connectors/pglite'
import postgresql from 'db0/connectors/postgresql'
import sqlite3 from 'db0/connectors/sqlite3'
import { capabilities as capabilityDefs, db0Categories, sqlCategories, targets } from '../packages/data/src/index'
import { runAllTests } from '../tests/runner'

const filter = process.argv[2]?.split(',').map(s => s.trim()) ?? []

function shouldRun(targetId: string): boolean {
  if (filter.length === 0) return true
  return filter.some(f => targetId.includes(f))
}

async function generate() {
  const results: Partial<Record<TargetId, CapabilityResults>> = {}

  // better-sqlite3
  if (shouldRun('better-sqlite3')) {
    console.log('Testing db0-better-sqlite3...')
    const sqlite = createDatabase(betterSqlite3({ name: ':memory:' }))
    results['db0-better-sqlite3'] = await runAllTests(sqlite)
  }

  // libsql
  if (shouldRun('libsql')) {
    console.log('Testing db0-libsql...')
    const libsqlDb = createDatabase(libsql({ url: ':memory:' }))
    results['db0-libsql'] = await runAllTests(libsqlDb)
  }

  // pglite
  if (shouldRun('pglite')) {
    console.log('Testing db0-pglite...')
    const pgliteDb = createDatabase(pglite())
    results['db0-pglite'] = await runAllTests(pgliteDb)
  }

  // postgresql (if available)
  if (shouldRun('postgresql') && process.env.POSTGRESQL_URL) {
    console.log('Testing db0-postgresql...')
    const pg = createDatabase(postgresql({ url: process.env.POSTGRESQL_URL }))
    results['db0-postgresql'] = await runAllTests(pg)
  }

  // mysql2 (if available)
  if (shouldRun('mysql2') && process.env.MYSQL_URL) {
    console.log('Testing db0-mysql2...')
    const mysql = createDatabase(mysql2({ uri: process.env.MYSQL_URL }))
    results['db0-mysql2'] = await runAllTests(mysql)
  }

  // sqlite3
  if (shouldRun('sqlite3')) {
    console.log('Testing db0-sqlite3...')
    const sqlite3Db = createDatabase(sqlite3({ name: ':memory:' }))
    results['db0-sqlite3'] = await runAllTests(sqlite3Db)
  }

  // node-sqlite (Node 22+)
  if (shouldRun('node-sqlite')) {
    console.log('Testing db0-node-sqlite...')
    const nodeSqliteDb = createDatabase(nodeSqlite({ name: ':memory:' }))
    results['db0-node-sqlite'] = await runAllTests(nodeSqliteDb)
  }

  // Merge bun results if available
  const bunResultsPath = process.env.BUN_RESULTS_PATH
  if (bunResultsPath && existsSync(bunResultsPath) && shouldRun('bun-sqlite')) {
    console.log('Merging bun-sqlite results...')
    const bunResults = JSON.parse(readFileSync(bunResultsPath, 'utf-8')) as Record<TargetId, CapabilityResults>
    Object.assign(results, bunResults)
  }

  // Merge D1 results if available
  const d1ResultsPath = process.env.D1_RESULTS_PATH
  if (d1ResultsPath && existsSync(d1ResultsPath) && shouldRun('d1')) {
    console.log('Merging cloudflare-d1 results...')
    const d1Results = JSON.parse(readFileSync(d1ResultsPath, 'utf-8')) as Record<TargetId, CapabilityResults>
    Object.assign(results, d1Results)
  }

  // Merge Hyperdrive results if available
  const hyperdriveResultsPath = process.env.HYPERDRIVE_RESULTS_PATH
  if (hyperdriveResultsPath && existsSync(hyperdriveResultsPath) && shouldRun('hyperdrive')) {
    console.log('Merging hyperdrive results...')
    const hyperdriveResults = JSON.parse(readFileSync(hyperdriveResultsPath, 'utf-8')) as Record<TargetId, CapabilityResults>
    Object.assign(results, hyperdriveResults)
  }

  // Load existing data for merging (filtered runs preserve untested targets)
  const outPath = resolve(import.meta.dirname, '../packages/data/data.json')
  const existingData: CompatibilityDataV2 | null = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf-8')) : null

  // Build v2 format with sql/db0 split
  const testedTargets = Object.keys(results) as TargetId[]
  const now = new Date().toISOString()
  const v2: CompatibilityDataV2 = {
    __meta: {
      version: '0.0.1',
      generatedAt: now,
      targets: {
        ...existingData?.__meta?.targets,
        ...Object.fromEntries(testedTargets.map((id) => {
          const def = targets.find(t => t.id === id)!
          return [id, { version: 'db0@0.3.4', dialect: def.dialect, generatedAt: now }]
        })),
      } as CompatibilityDataV2['__meta']['targets'],
    },
    sql: {} as CompatibilityDataV2['sql'],
    db0: {} as CompatibilityDataV2['db0'],
  }

  // Group SQL capabilities by category
  for (const cat of sqlCategories) {
    v2.sql[cat] = {}
    const caps = capabilityDefs.filter(c => c.kind === 'sql' && c.category === cat)
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

  // Group db0 capabilities by category
  for (const cat of db0Categories) {
    v2.db0[cat] = {}
    const caps = capabilityDefs.filter(c => c.kind === 'db0' && c.category === cat)
    for (const cap of caps) {
      v2.db0[cat][cap.id] = {
        description: cap.description,
        support: {
          ...existingData?.db0?.[cat]?.[cap.id]?.support,
          ...Object.fromEntries(testedTargets.map((targetId) => {
            const r = results[targetId]![cap.id]
            return [targetId, { supported: r.supported, ...(r.notes && { notes: r.notes }), ...(r.error && { error: r.error }) }]
          })),
        } as CompatibilityDataV2['db0'][Db0Category][string]['support'],
      }
    }
  }

  // Write v2 format
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
