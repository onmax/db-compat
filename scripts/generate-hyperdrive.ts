import { writeFileSync } from 'node:fs'
import { createDatabase } from 'db0'
import hyperdrivePostgresql from 'db0/connectors/cloudflare-hyperdrive-postgresql'
import hyperdriveMysql from 'db0/connectors/cloudflare-hyperdrive-mysql'
import { runAllTests } from '../tests/runner'

const results: Record<string, Awaited<ReturnType<typeof runAllTests>>> = {}

// Mock Hyperdrive binding - matches Cloudflare Hyperdrive interface
function mockHyperdrive(connectionString: string) {
  const url = new URL(connectionString)
  return {
    connectionString,
    host: url.hostname,
    port: Number(url.port) || (url.protocol === 'mysql:' ? 3306 : 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  }
}

// PostgreSQL via Hyperdrive
if (process.env.POSTGRESQL_URL) {
  console.log('Testing db0-hyperdrive-postgresql...')
  ;(globalThis as any).__env__ = { HYPERDRIVE_PG: mockHyperdrive(process.env.POSTGRESQL_URL) }

  const db = createDatabase(hyperdrivePostgresql({ bindingName: 'HYPERDRIVE_PG' }))
  results['db0-hyperdrive-postgresql'] = await runAllTests(db)
  await db.sql`SELECT 1`.catch(() => {}) // ensure connection cleanup
}

// MySQL via Hyperdrive
if (process.env.MYSQL_URL) {
  console.log('Testing db0-hyperdrive-mysql...')
  ;(globalThis as any).__env__ = { HYPERDRIVE_MYSQL: mockHyperdrive(process.env.MYSQL_URL) }

  const db = createDatabase(hyperdriveMysql({ bindingName: 'HYPERDRIVE_MYSQL' }))
  results['db0-hyperdrive-mysql'] = await runAllTests(db)
  await db.sql`SELECT 1`.catch(() => {}) // ensure connection cleanup
}

if (Object.keys(results).length > 0) {
  writeFileSync('.hyperdrive-results.json', JSON.stringify(results))
  console.log('Hyperdrive results written to .hyperdrive-results.json')
}
else {
  console.log('No database URLs provided, skipping Hyperdrive tests')
}

process.exit(0)
