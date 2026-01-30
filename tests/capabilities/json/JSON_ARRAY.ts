import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_ARRAY',
  kind: 'sql',
  category: 'json',
  description: 'Create JSON arrays',
  async test(db) {
    try {
      // Try PostgreSQL array syntax
      try {
        const result = await db.sql`SELECT jsonb_build_array(1, 2, 3) as val`
        if ((result.rows?.length ?? 0) >= 1)
          return { supported: true, notes: 'PostgreSQL jsonb_build_array' }
      }
      catch {}

      // Try SQLite/MySQL json_array
      const result = await db.sql`SELECT json_array(1, 2, 3) as val`
      return { supported: (result.rows?.length ?? 0) >= 1, notes: 'json_array function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
