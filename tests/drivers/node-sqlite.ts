import type { TestDriver } from './types'

export async function createNodeSqliteDriver(name = ':memory:'): Promise<TestDriver> {
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(name)
  return {
    dialect: 'sqlite',
    async exec(sql) { db.exec(sql) },
    query: async (sql, params = []) => {
      const stmt = db.prepare(sql)
      return { rows: stmt.all(...(params as Parameters<typeof stmt.all>)) as Record<string, unknown>[] }
    },
    async close() { db.close() },
  }
}
