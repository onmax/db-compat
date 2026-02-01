import type { TestDriver } from './types'
import sqlite3 from 'sqlite3'

export function createSqlite3Driver(name = ':memory:'): Promise<TestDriver> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(name, (err) => {
      if (err)
        return reject(err)
      resolve({
        dialect: 'sqlite',
        exec: sql => new Promise((res, rej) => db.exec(sql, e => e ? rej(e) : res())),
        query: (sql, params = []) => new Promise((res, rej) => db.all(sql, params, (e, rows) => e ? rej(e) : res({ rows: rows as Record<string, unknown>[] }))),
        close: () => new Promise(res => db.close(() => res())),
      })
    })
  })
}
