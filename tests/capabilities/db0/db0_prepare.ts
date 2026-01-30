import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_prepare',
  kind: 'db0',
  category: 'api',
  description: 'Prepared statement API',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_prepare (id INTEGER, name TEXT)')
      const stmt = await db.prepare('INSERT INTO _test_prepare VALUES (?, ?)')
      await stmt.run(1, 'test')
      await stmt.run(2, 'test2')
      const result = await db.sql`SELECT * FROM _test_prepare`
      await db.exec('DROP TABLE _test_prepare')
      return { supported: (result.rows?.length ?? 0) === 2 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_prepare')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
