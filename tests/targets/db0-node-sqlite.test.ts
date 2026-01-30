import { createDatabase } from 'db0'
import nodeSqlite from 'db0/connectors/node-sqlite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const nodeMajor = typeof process.versions.node === 'string' ? Number.parseInt(process.versions.node.split('.')[0]) : 0
const skipReason = nodeMajor < 22 ? 'Node.js 22+ required for node:sqlite' : undefined

describe.skipIf(skipReason)('db0-node-sqlite', () => {
  const db = createDatabase(nodeSqlite({ name: ':memory:' }))

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
