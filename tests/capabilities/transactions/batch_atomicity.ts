import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'batch_atomicity',
  kind: 'sql',
  category: 'transactions',
  description: 'Atomic batch execution',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_batch (id INTEGER PRIMARY KEY)')
      // Test if batch operations are atomic - if one fails, all should fail
      try {
        await db.exec(`
          INSERT INTO _test_batch (id) VALUES (1);
          INSERT INTO _test_batch (id) VALUES (1);
        `)
      }
      catch {
        // Expected to fail due to duplicate key
      }
      const result = await db.sql`SELECT * FROM _test_batch`
      await db.exec('DROP TABLE _test_batch')
      // If atomic, no rows should exist (first insert rolled back with second)
      // If not atomic, one row will exist
      return {
        supported: (result.rows?.length ?? 0) < 1,
        notes: (result.rows?.length ?? 0) > 0 ? 'Batch not atomic - partial execution' : undefined,
      }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_batch')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
