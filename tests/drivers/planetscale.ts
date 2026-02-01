import type { TestDriver } from './types'
import { Client } from '@planetscale/database'

export function createPlanetscaleDriver(url: string): TestDriver {
  const client = new Client({ url })
  return {
    dialect: 'mysql',
    async exec(sql) { await client.execute(sql) },
    async query(sql, params = []) {
      const result = await client.execute(sql, params)
      return { rows: result.rows as any[] }
    },
    async close() {},
  }
}
