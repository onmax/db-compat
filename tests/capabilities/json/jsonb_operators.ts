import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'jsonb_operators',
  category: 'json',
  description: 'PostgreSQL JSONB operators (@>, ->, etc.)',
  async test(db) {
    try {
      // Test @> containment operator
      const result = await db.sql`SELECT '{"a": 1, "b": 2}'::jsonb @> '{"a": 1}'::jsonb as val`
      if ((result.rows?.length ?? 0) >= 1)
        return { supported: true }
      return { supported: false }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message, notes: 'PostgreSQL-specific feature' }
    }
  },
}
