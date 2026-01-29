import { createDatabase } from 'db0'
import betterSqlite3 from 'db0/connectors/better-sqlite3'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

describe('db0-better-sqlite3', () => {
  const db = createDatabase(betterSqlite3({ name: ':memory:' }))

  beforeAll(() => {})

  afterAll(async () => {})

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(db, cap.id as Parameters<typeof runTest>[1])
      expect(result).toBeDefined()
    })
  }
})
