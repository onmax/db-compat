import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'foreign_keys',
  category: 'constraints',
  description: 'Foreign key constraints',
  async test(driver) {
    try {
      try {
        await driver.exec('PRAGMA foreign_keys = ON')
      }
      catch {}
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_fk_parent (id INTEGER PRIMARY KEY)')
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_fk_child (id INTEGER PRIMARY KEY, parent_id INTEGER REFERENCES _test_fk_parent(id))')
      await driver.exec('INSERT INTO _test_fk_parent (id) VALUES (1)')
      await driver.exec('INSERT INTO _test_fk_child (id, parent_id) VALUES (1, 1)')

      let fkEnforced = false
      try {
        await driver.exec('INSERT INTO _test_fk_child (id, parent_id) VALUES (2, 999)')
      }
      catch {
        fkEnforced = true
      }

      await driver.exec('DROP TABLE _test_fk_child')
      await driver.exec('DROP TABLE _test_fk_parent')
      return { supported: fkEnforced, notes: fkEnforced ? undefined : 'Foreign keys not enforced' }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_fk_child')
      }
      catch {}
      try {
        await driver.exec('DROP TABLE _test_fk_parent')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
