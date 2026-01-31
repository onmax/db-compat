import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'SAVEPOINT',
  kind: 'sql',
  category: 'transactions',
  description: 'Transaction savepoints',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_savepoint (id INTEGER PRIMARY KEY)')
      await db.exec('BEGIN')
      await db.exec('INSERT INTO _test_savepoint (id) VALUES (1)')
      await db.exec('SAVEPOINT sp1')
      await db.exec('INSERT INTO _test_savepoint (id) VALUES (2)')
      await db.exec('ROLLBACK TO SAVEPOINT sp1')
      await db.exec('COMMIT')
      const result = await db.sql`SELECT * FROM _test_savepoint`
      await db.exec('DROP TABLE _test_savepoint')
      return { supported: result.rows?.length === 1 && (result.rows?.[0] as { id: number }).id === 1 }
    }
    catch (error) {
      try {
        await db.exec('ROLLBACK')
      }
      catch {}
      try {
        await db.exec('DROP TABLE _test_savepoint')
      }
      catch {}
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
