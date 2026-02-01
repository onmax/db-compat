import type { TestDriver } from './types'
import mysql from 'mysql2/promise'
import pg from 'pg'

export interface HyperdriveBinding {
  connectionString: string
  host: string
  port: number
  user: string
  password: string
  database: string
}

export function createHyperdrivePgDriver(binding: HyperdriveBinding): TestDriver {
  const pool = new pg.Pool({ connectionString: binding.connectionString })
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

export async function createHyperdriveMysqlDriver(binding: HyperdriveBinding): Promise<TestDriver> {
  const pool = mysql.createPool({ host: binding.host, port: binding.port, user: binding.user, password: binding.password, database: binding.database })
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

export function mockHyperdrive(connectionString: string): HyperdriveBinding {
  const url = new URL(connectionString)
  return {
    connectionString,
    host: url.hostname,
    port: Number(url.port) || (url.protocol === 'mysql:' ? 3306 : 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  }
}
