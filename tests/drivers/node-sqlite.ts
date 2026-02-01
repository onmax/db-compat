import type { TestDriver } from './types'

export async function createNodeSqliteDriver(name = ':memory:'): Promise<TestDriver> {
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(name)
  return {
    dialect: 'sqlite',
    async exec(sql) { db.exec(sql) },
    async query(sql, params = []) {
      const stmt = db.prepare(sql)
      return { rows: stmt.all(...(params as any)) as any[] }
    },
    async close() { db.close() },
  }
}
