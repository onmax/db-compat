import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CTE_recursive',
  category: 'queries',
  description: 'Recursive CTEs (WITH RECURSIVE)',
  async test(driver) {
    try {
      const result = await driver.query('WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x < 5) SELECT x FROM cnt')
      return { supported: result.rows.length === 5 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
