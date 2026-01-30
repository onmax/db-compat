import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_rows',
  kind: 'db0',
  category: 'api',
  description: 'Rows array access',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_rows (id INTEGER)')
      await db.exec(`INSERT INTO _test_rows VALUES (1), (2), (3)`)
      const result = await db.sql`SELECT * FROM _test_rows`
      await db.exec('DROP TABLE _test_rows')
      return { supported: Array.isArray(result.rows) && result.rows.length === 3 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_rows')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
