import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_SET',
  kind: 'sql',
  category: 'json',
  description: 'Modify JSON values',
  async test(db) {
    try {
      // Try PostgreSQL jsonb_set
      try {
        const result = await db.sql`SELECT jsonb_set('{"key": "old"}'::jsonb, '{key}', '"new"') as val`
        if ((result.rows?.length ?? 0) >= 1)
          return { supported: true, notes: 'PostgreSQL jsonb_set' }
      }
      catch {}

      // Try SQLite/MySQL json_set
      const result = await db.sql`SELECT json_set('{"key": "old"}', '$.key', 'new') as val`
      return { supported: (result.rows?.length ?? 0) >= 1, notes: 'json_set function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
