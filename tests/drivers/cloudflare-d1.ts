import type { TestDriver } from './types'

export interface D1Database {
  exec: (sql: string) => Promise<void>
  prepare: (sql: string) => { all: <T>(...params: unknown[]) => Promise<{ results: T[] }>, run: (...params: unknown[]) => Promise<void> }
}

export function createD1Driver(d1: D1Database): TestDriver {
  return {
    dialect: 'sqlite',
    async exec(sql) { await d1.exec(sql) },
    async query(sql, params = []) {
      const result = await d1.prepare(sql).all(...params)
      return { rows: result.results as any[] }
    },
    async close() {},
  }
}
