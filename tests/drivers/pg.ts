import type { TestDriver } from './types'
import pg from 'pg'

export function createPgDriver(connectionString: string): TestDriver {
  const pool = new pg.Pool({ connectionString })
  return {
    dialect: 'postgresql',
    async exec(sql) { await pool.query(sql) },
    async query(sql, params = []) {
      const result = await pool.query(sql, params)
      return { rows: result.rows }
    },
    async close() { await pool.end() },
  }
}
