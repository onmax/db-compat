import { writeFileSync } from 'node:fs'
import { Miniflare } from 'miniflare'
import { createDatabase } from 'db0'
import hyperdrivePostgresql from 'db0/connectors/cloudflare-hyperdrive-postgresql'
import hyperdriveMysql from 'db0/connectors/cloudflare-hyperdrive-mysql'
import { runAllTests } from '../tests/runner'

const results: Record<string, Awaited<ReturnType<typeof runAllTests>>> = {}

// PostgreSQL via Hyperdrive
if (process.env.POSTGRESQL_URL) {
  console.log('Testing db0-hyperdrive-postgresql...')
  const mf = new Miniflare({
    modules: [{ type: 'ESModule', path: 'worker.mjs', contents: 'export default { fetch() { return new Response("ok") } }' }],
    hyperdrives: { HYPERDRIVE_PG: process.env.POSTGRESQL_URL },
  })
  const hyperdrive = await mf.getHyperdrive('HYPERDRIVE_PG')
  ;(globalThis as any).__env__ = { HYPERDRIVE_PG: hyperdrive }

  const db = createDatabase(hyperdrivePostgresql({ bindingName: 'HYPERDRIVE_PG' }))
  results['db0-hyperdrive-postgresql'] = await runAllTests(db)
  await mf.dispose()
}

// MySQL via Hyperdrive
if (process.env.MYSQL_URL) {
  console.log('Testing db0-hyperdrive-mysql...')
  const mf = new Miniflare({
    modules: [{ type: 'ESModule', path: 'worker.mjs', contents: 'export default { fetch() { return new Response("ok") } }' }],
    hyperdrives: { HYPERDRIVE_MYSQL: process.env.MYSQL_URL },
  })
  const hyperdrive = await mf.getHyperdrive('HYPERDRIVE_MYSQL')
  ;(globalThis as any).__env__ = { HYPERDRIVE_MYSQL: hyperdrive }

  const db = createDatabase(hyperdriveMysql({ bindingName: 'HYPERDRIVE_MYSQL' }))
  results['db0-hyperdrive-mysql'] = await runAllTests(db)
  await mf.dispose()
}

if (Object.keys(results).length > 0) {
  writeFileSync('.hyperdrive-results.json', JSON.stringify(results))
  console.log('Hyperdrive results written to .hyperdrive-results.json')
}
else {
  console.log('No database URLs provided, skipping Hyperdrive tests')
}
