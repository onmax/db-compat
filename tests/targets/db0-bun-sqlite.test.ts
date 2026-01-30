import { createDatabase } from 'db0'
import bunSqlite from 'db0/connectors/bun-sqlite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const skipReason = typeof (globalThis as Record<string, unknown>).Bun === 'undefined' ? 'Bun runtime required' : undefined

describe.skipIf(skipReason)('db0-bun-sqlite', () => {
  const db = createDatabase(bunSqlite({ name: ':memory:' }))

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
