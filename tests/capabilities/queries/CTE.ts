import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CTE',
  category: 'queries',
  description: 'Common Table Expressions (WITH)',
  async test(driver) {
    try {
      const result = await driver.query<{ val: number }>('WITH cte AS (SELECT 1 as val) SELECT val FROM cte')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
