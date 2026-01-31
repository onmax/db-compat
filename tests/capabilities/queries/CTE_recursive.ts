import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CTE_recursive',
  kind: 'sql',
  category: 'queries',
  description: 'Recursive CTEs (WITH RECURSIVE)',
  async test(db) {
    try {
      // Use prepare().all() instead of sql template to work around db0's regex not matching WITH
      const stmt = db.prepare('WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x < 5) SELECT x FROM cnt')
      const result = await stmt.all() as unknown[] | { rows?: unknown[] }
      const rows = Array.isArray(result) ? result : result.rows
      return { supported: (rows?.length ?? 0) === 5 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
