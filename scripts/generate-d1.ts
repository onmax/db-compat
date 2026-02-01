import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { consola } from 'consola'
import { Miniflare } from 'miniflare'
import { resolve } from 'pathe'
import { createD1Driver } from '../tests/drivers/cloudflare-d1'
import { runAllTests } from '../tests/runner'

const outputPath = resolve(process.cwd(), '.d1-results.json')

const mf = new Miniflare({
  modules: [{ type: 'ESModule', path: 'worker.mjs', contents: 'export default { fetch() { return new Response("ok") } }' }],
  d1Databases: ['D1_DATABASE'],
})
const d1 = await mf.getD1Database('D1_DATABASE')

consola.start('Testing cloudflare-d1...')
const driver = createD1Driver(d1 as any)
const results = { 'cloudflare-d1': await runAllTests(driver) }

writeFileSync(outputPath, JSON.stringify(results))
consola.success(`D1 results written to ${outputPath}`)
await mf.dispose()
