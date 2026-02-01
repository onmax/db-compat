import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createNodeSqliteDriver } from '../drivers/node-sqlite'
import { capabilities, runTest } from '../runner'

const nodeMajor = typeof process.versions.node === 'string' ? Number.parseInt(process.versions.node.split('.')[0]) : 0
const skipReason = nodeMajor < 22 ? 'Node.js 22+ required for node:sqlite' : undefined

describe.skipIf(skipReason)('node-sqlite', () => {
  let driver: TestDriver
  beforeAll(async () => {
    driver = await createNodeSqliteDriver()
  })
  afterAll(async () => {
    await driver?.close()
  })

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(driver, cap.id as Parameters<typeof runTest>[1])
      expect(result).toHaveProperty('supported')
    })
  }
})
