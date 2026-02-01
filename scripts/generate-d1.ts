import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Miniflare } from 'miniflare'
import { createD1Driver } from '../tests/drivers/cloudflare-d1'
import { runAllTests } from '../tests/runner'

const outputPath = resolve(process.cwd(), '.d1-results.json')

const mf = new Miniflare({
  modules: [{ type: 'ESModule', path: 'worker.mjs', contents: 'export default { fetch() { return new Response("ok") } }' }],
  d1Databases: ['D1_DATABASE'],
})
const d1 = await mf.getD1Database('D1_DATABASE')

console.log('Testing cloudflare-d1...')
const driver = createD1Driver(d1 as any)
const results = { 'cloudflare-d1': await runAllTests(driver) }

writeFileSync(outputPath, JSON.stringify(results))
console.log(`D1 results written to ${outputPath}`)
await mf.dispose()
