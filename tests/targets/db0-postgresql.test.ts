import { createDatabase } from 'db0'
import postgresql from 'db0/connectors/postgresql'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.POSTGRESQL_URL ? undefined : 'POSTGRESQL_URL not set'

describe.skipIf(skipReason)('db0-postgresql', () => {
  const db = createDatabase(postgresql({ url: process.env.POSTGRESQL_URL! }))

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
