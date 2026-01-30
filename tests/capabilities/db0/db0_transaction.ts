import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_transaction',
  kind: 'db0',
  category: 'connection',
  description: 'Transaction helper API',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_txn (id INTEGER)')
      await db.exec('BEGIN')
      await db.exec('INSERT INTO _test_txn VALUES (1)')
      await db.exec('COMMIT')
      const result = await db.sql`SELECT * FROM _test_txn`
      await db.exec('DROP TABLE _test_txn')
      return { supported: (result.rows?.length ?? 0) === 1 }
    }
    catch (error) {
      try {
        await db.exec('ROLLBACK')
      }
      catch { /* ignore */ }
      try {
        await db.exec('DROP TABLE _test_txn')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
