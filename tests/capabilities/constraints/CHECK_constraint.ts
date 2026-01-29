import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CHECK_constraint',
  category: 'constraints',
  description: 'CHECK constraints',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_check (val INTEGER CHECK (val > 0))')
      await db.exec('INSERT INTO _test_check (val) VALUES (1)')

      let checkEnforced = false
      try {
        await db.exec('INSERT INTO _test_check (val) VALUES (-1)')
      }
      catch {
        checkEnforced = true
      }

      await db.exec('DROP TABLE _test_check')
      return { supported: checkEnforced, notes: checkEnforced ? undefined : 'CHECK constraints not enforced' }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_check')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
