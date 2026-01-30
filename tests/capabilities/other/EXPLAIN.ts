import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'EXPLAIN',
  kind: 'sql',
  category: 'other',
  description: 'Query explain/analysis',
  async test(db) {
    try {
      const result = await db.sql`EXPLAIN SELECT 1`
      return { supported: (result.rows?.length ?? 0) > 0 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
