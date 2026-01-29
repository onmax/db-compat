import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UNIQUE_constraint',
  category: 'constraints',
  description: 'UNIQUE constraints',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_unique (val INTEGER UNIQUE)')
      await db.exec('INSERT INTO _test_unique (val) VALUES (1)')

      let uniqueEnforced = false
      try {
        await db.exec('INSERT INTO _test_unique (val) VALUES (1)')
      }
      catch {
        uniqueEnforced = true
      }

      await db.exec('DROP TABLE _test_unique')
      return { supported: uniqueEnforced }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_unique')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
