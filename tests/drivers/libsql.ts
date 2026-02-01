import type { TestDriver } from './types'
import { createClient } from '@libsql/client'

export function createLibsqlDriver(url = ':memory:'): TestDriver {
  const client = createClient({ url })
  return {
    dialect: 'sqlite',
    async exec(sql) { await client.execute(sql) },
    async query(sql, params = []) {
      const result = await client.execute({ sql, args: params as any })
      return { rows: result.rows as any[] }
    },
    async close() { client.close() },
  }
}
