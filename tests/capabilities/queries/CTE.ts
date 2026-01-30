import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CTE',
  kind: 'sql',
  category: 'queries',
  description: 'Common Table Expressions (WITH)',
  async test(db) {
    try {
      const result = await db.sql`WITH cte AS (SELECT 1 as val) SELECT val FROM cte`
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
