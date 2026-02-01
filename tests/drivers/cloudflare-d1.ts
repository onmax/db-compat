import type { TestDriver } from './types'

export interface D1Database {
  exec: (sql: string) => Promise<void>
  prepare: (sql: string) => { all: <T>(...params: unknown[]) => Promise<{ results: T[] }>, run: (...params: unknown[]) => Promise<void> }
}

export function createD1Driver(d1: D1Database): TestDriver {
  return {
    dialect: 'sqlite',
    async exec(sql) { await d1.exec(sql) },
    query: async (sql, params = []) => {
      const result = await d1.prepare(sql).all<Record<string, unknown>>(...params)
      return { rows: result.results }
    },
    async close() {},
  }
}
