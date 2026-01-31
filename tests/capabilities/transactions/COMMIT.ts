import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'COMMIT',
  kind: 'sql',
  category: 'transactions',
  description: 'Commit transaction',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_commit (id INTEGER PRIMARY KEY)')
      await db.exec('BEGIN')
      await db.exec('INSERT INTO _test_commit (id) VALUES (1)')
      await db.exec('COMMIT')
      const result = await db.sql`SELECT * FROM _test_commit WHERE id = 1`
      await db.exec('DROP TABLE _test_commit')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_commit')
      }
      catch {}
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
