import { createDatabase } from 'db0'
import mysql2 from 'db0/connectors/mysql2'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.MYSQL_URL ? undefined : 'MYSQL_URL not set'

describe.skipIf(skipReason)('db0-mysql2', () => {
  const db = createDatabase(mysql2({ uri: process.env.MYSQL_URL! }))

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
