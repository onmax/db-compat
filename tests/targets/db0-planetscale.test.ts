import { createDatabase } from 'db0'
import planetscale from 'db0/connectors/planetscale'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.PLANETSCALE_URL ? undefined : 'PLANETSCALE_URL not set'

describe.skipIf(skipReason)('db0-planetscale', () => {
  const db = createDatabase(planetscale({ url: process.env.PLANETSCALE_URL! }))

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
