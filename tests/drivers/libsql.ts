import type { TestDriver } from './types'
import { createClient } from '@libsql/client'

export function createLibsqlDriver(url = ':memory:'): TestDriver {
  const client = createClient({ url })
  return {
    dialect: 'sqlite',
    async exec(sql) { await client.execute(sql) },
    query: async (sql, params = []) => {
      const result = await client.execute({ sql, args: params as (string | number | null)[] })
      return { rows: result.rows as Record<string, unknown>[] }
    },
    async close() { client.close() },
  }
}
