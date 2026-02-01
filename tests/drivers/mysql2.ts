import type { TestDriver } from './types'
import mysql from 'mysql2/promise'

export async function createMysql2Driver(uri: string): Promise<TestDriver> {
  const pool = mysql.createPool(uri)
  return {
    dialect: 'mysql',
    async exec(sql) { await pool.execute(sql) },
    query: async (sql, params = []) => {
      const [rows] = await pool.execute(sql, params)
      return { rows: rows as Record<string, unknown>[] }
    },
    async close() { await pool.end() },
  }
}
