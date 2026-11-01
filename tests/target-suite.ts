import type { CapabilityId } from '../packages/data/src/types'
import type { TestDriver } from './drivers/types'
import type { TestResults } from './runner'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities as definitions } from '../packages/data/src'
import { runAllTests } from './runner'

interface TargetSuite {
  name: string
  createDriver: () => TestDriver | Promise<TestDriver>
  skipReason?: string
}

export function testTarget({ name, createDriver, skipReason }: TargetSuite): void {
  describe.skipIf(skipReason !== undefined)(skipReason ? `${name} (${skipReason})` : name, () => {
    let driver: TestDriver
    let results: TestResults

    beforeAll(async () => {
      driver = await createDriver()
      results = await runAllTests(driver)
    }, 30000)

    afterAll(async () => {
      await driver?.close()
    })

    it('reports a boolean result for every published capability', () => {
      expect(Object.keys(results).sort()).toEqual(definitions.map(cap => cap.id).sort())
      for (const [id, result] of Object.entries(results)) {
        expect(result, id).toMatchObject({ supported: expect.any(Boolean) })
      }
    })

    it.each([
      'CTE',
      'CTE_recursive',
      'window_functions',
      'LIMIT_OFFSET',
      'subqueries',
      'JSON_EXTRACT',
      'JSON_SET',
      'JSON_ARRAY',
      'UNIQUE_constraint',
      'EXPLAIN',
    ] satisfies CapabilityId[])('reports support for %s', (id) => {
      expect(results[id], id).toMatchObject({ supported: true })
    })

    it('reports incompatible upsert syntax as unsupported with an error', () => {
      const id = driver.dialect === 'mysql' ? 'UPSERT_on_conflict' : 'UPSERT_on_duplicate'
      expect(results[id], id).toMatchObject({ supported: false, error: expect.any(String) })
    })
  })
}
