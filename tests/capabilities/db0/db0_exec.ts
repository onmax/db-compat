import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_exec',
  kind: 'db0',
  category: 'api',
  description: 'Raw SQL execution via exec()',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_exec (id INTEGER)')
      await db.exec('INSERT INTO _test_exec VALUES (1)')
      await db.exec('DROP TABLE _test_exec')
      return { supported: true }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_exec')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
