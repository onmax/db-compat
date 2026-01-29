import { createDatabase } from 'db0'
import libsql from 'db0/connectors/libsql/node'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

describe('db0-libsql', () => {
  const db = createDatabase(libsql({ url: ':memory:' }))

  beforeAll(() => {})

  afterAll(async () => {})

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(db, cap.id as Parameters<typeof runTest>[1])
      expect(result).toBeDefined()
    })
  }
})
