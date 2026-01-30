import { createDatabase } from 'db0'
import sqlite3 from 'db0/connectors/sqlite3'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

describe('db0-sqlite3', () => {
  const db = createDatabase(sqlite3({ name: ':memory:' }))

  beforeAll(() => {})

  afterAll(async () => {})

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(db, cap.id as Parameters<typeof runTest>[1])
      expect(result.error).toBeUndefined()
      expect(result.supported).toBe(true)
    })
  }
})
