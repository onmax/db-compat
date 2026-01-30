import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'LIMIT_OFFSET',
  kind: 'sql',
  category: 'queries',
  description: 'LIMIT and OFFSET',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_limit (id INTEGER)')
      await db.exec('INSERT INTO _test_limit VALUES (1), (2), (3), (4), (5)')
      const result = await db.sql`SELECT id FROM _test_limit ORDER BY id LIMIT 2 OFFSET 2`
      await db.exec('DROP TABLE _test_limit')
      return { supported: (result.rows?.length ?? 0) >= 2 && (result.rows?.[0] as { id: number }).id === 3 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_limit')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
