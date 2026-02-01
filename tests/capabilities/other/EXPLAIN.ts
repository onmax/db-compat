import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'EXPLAIN',
  category: 'other',
  description: 'Query explain/analysis',
  async test(driver) {
    try {
      const result = await driver.query('EXPLAIN SELECT 1')
      return { supported: result.rows.length > 0 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
