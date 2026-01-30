import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_batch',
  kind: 'db0',
  category: 'api',
  description: 'Multi-statement batch execution',
  async test(db) {
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS _test_batch (id INTEGER, name TEXT);
        INSERT INTO _test_batch VALUES (1, 'a');
        INSERT INTO _test_batch VALUES (2, 'b');
      `)
      const result = await db.sql`SELECT * FROM _test_batch`
      await db.exec('DROP TABLE _test_batch')
      return { supported: (result.rows?.length ?? 0) === 2 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_batch')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
