import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CTE',
  kind: 'sql',
  category: 'queries',
  description: 'Common Table Expressions (WITH)',
  async test(db) {
    try {
      // Use prepare().all() instead of sql template to work around db0's regex not matching WITH
      const stmt = db.prepare('WITH cte AS (SELECT 1 as val) SELECT val FROM cte')
      const result = await stmt.all() as unknown[] | { rows?: unknown[] }
      const rows = Array.isArray(result) ? result : result.rows
      return { supported: (rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
