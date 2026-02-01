import type { TestDriver } from './types'

export function createBunSqliteDriver(name = ':memory:'): TestDriver {
  // eslint-disable-next-line ts/no-require-imports
  const { Database } = require('bun:sqlite')
  const db = new Database(name)
  return {
    dialect: 'sqlite',
    async exec(sql) { db.exec(sql) },
    async query(sql, params = []) { return { rows: db.prepare(sql).all(...params) } },
    async close() { db.close() },
  }
}
