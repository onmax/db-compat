import { writeFileSync } from 'node:fs'
import { createDatabase } from 'db0'
import cloudflareD1 from 'db0/connectors/cloudflare-d1'
import { Miniflare } from 'miniflare'
import { runAllTests } from '../tests/runner'

const mf = new Miniflare({
  modules: [{ type: 'ESModule', path: 'worker.mjs', contents: 'export default { fetch() { return new Response("ok") } }' }],
  d1Databases: ['D1_DATABASE'],
})
const d1 = await mf.getD1Database('D1_DATABASE')

// db0 cloudflare-d1 connector reads from globalThis.__env__[bindingName]
;(globalThis as any).__env__ = { D1_DATABASE: d1 }

console.log('Testing db0-cloudflare-d1...')
const db = createDatabase(cloudflareD1({ bindingName: 'D1_DATABASE' }))
const results = { 'db0-cloudflare-d1': await runAllTests(db) }

writeFileSync('.d1-results.json', JSON.stringify(results))
console.log('D1 results written to .d1-results.json')
await mf.dispose()
