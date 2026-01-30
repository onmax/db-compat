import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'ROLLBACK',
  kind: 'sql',
  category: 'transactions',
  description: 'Rollback transaction',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_rollback (id INTEGER PRIMARY KEY)')
      await db.exec('BEGIN')
      await db.exec('INSERT INTO _test_rollback (id) VALUES (1)')
      await db.exec('ROLLBACK')
      const result = await db.sql`SELECT * FROM _test_rollback WHERE id = 1`
      await db.exec('DROP TABLE _test_rollback')
      return { supported: (result.rows?.length ?? 0) < 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_rollback')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
