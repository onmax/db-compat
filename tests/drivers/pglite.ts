import type { TestDriver } from './types'
import { PGlite } from '@electric-sql/pglite'

export function createPgliteDriver(): TestDriver {
  const db = new PGlite()
  return {
    dialect: 'postgresql',
    async exec(sql) { await db.exec(sql) },
    async query(sql, params = []) {
      const result = await db.query(sql, params)
      return { rows: result.rows as any[] }
    },
    async close() { await db.close() },
  }
}
