import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_EXTRACT',
  kind: 'sql',
  category: 'json',
  description: 'Extract JSON values',
  async test(db) {
    try {
      // Try PostgreSQL syntax first
      try {
        const result = await db.sql`SELECT '{"key": "value"}'::jsonb->>'key' as val`
        if ((result.rows?.length ?? 0) >= 1)
          return { supported: true, notes: 'PostgreSQL JSONB syntax' }
      }
      catch {}

      // Try SQLite/MySQL json_extract
      const result = await db.sql`SELECT json_extract('{"key": "value"}', '$.key') as val`
      return { supported: (result.rows?.length ?? 0) >= 1, notes: 'json_extract function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
