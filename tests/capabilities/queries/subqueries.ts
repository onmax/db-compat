import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'subqueries',
  kind: 'sql',
  category: 'queries',
  description: 'Subqueries',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_sub (id INTEGER, val INTEGER)')
      await db.exec('INSERT INTO _test_sub VALUES (1, 10), (2, 20), (3, 30)')
      const result = await db.sql`SELECT * FROM _test_sub WHERE val > (SELECT AVG(val) FROM _test_sub)`
      await db.exec('DROP TABLE _test_sub')
      return { supported: (result.rows?.length ?? 0) >= 1 && (result.rows?.[0] as { id: number }).id === 3 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_sub')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
