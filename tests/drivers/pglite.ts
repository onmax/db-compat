import type { TestDriver } from './types'
import { PGlite } from '@electric-sql/pglite'

export function createPgliteDriver(): TestDriver {
  const db = new PGlite()
  return {
    dialect: 'postgresql',
    async exec(sql) { await db.exec(sql) },
    query: async (sql, params = []) => {
      const result = await db.query<Record<string, unknown>>(sql, params)
      return { rows: result.rows }
    },
    async close() { await db.close() },
  }
}
