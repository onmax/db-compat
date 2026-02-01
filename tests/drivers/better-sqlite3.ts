import type { TestDriver } from './types'
import Database from 'better-sqlite3'

export function createBetterSqlite3Driver(name = ':memory:'): TestDriver {
  const db = new Database(name)
  return {
    dialect: 'sqlite',
    async exec(sql) { db.exec(sql) },
    async query(sql, params = []) { return { rows: db.prepare(sql).all(...params) as any[] } },
    async close() { db.close() },
  }
}
