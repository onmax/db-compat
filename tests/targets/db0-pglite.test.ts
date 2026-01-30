import { createDatabase } from 'db0'
import pglite from 'db0/connectors/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

describe('db0-pglite', () => {
  const db = createDatabase(pglite())

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
