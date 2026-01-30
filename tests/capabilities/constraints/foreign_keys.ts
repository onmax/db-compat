import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'foreign_keys',
  kind: 'sql',
  category: 'constraints',
  description: 'Foreign key constraints',
  async test(db) {
    try {
      // Enable FK for SQLite
      try {
        await db.exec('PRAGMA foreign_keys = ON')
      }
      catch {}

      await db.exec('CREATE TABLE IF NOT EXISTS _test_fk_parent (id INTEGER PRIMARY KEY)')
      await db.exec('CREATE TABLE IF NOT EXISTS _test_fk_child (id INTEGER PRIMARY KEY, parent_id INTEGER REFERENCES _test_fk_parent(id))')
      await db.exec('INSERT INTO _test_fk_parent (id) VALUES (1)')
      await db.exec('INSERT INTO _test_fk_child (id, parent_id) VALUES (1, 1)')

      // Try inserting invalid FK - should fail
      let fkEnforced = false
      try {
        await db.exec('INSERT INTO _test_fk_child (id, parent_id) VALUES (2, 999)')
      }
      catch {
        fkEnforced = true
      }

      await db.exec('DROP TABLE _test_fk_child')
      await db.exec('DROP TABLE _test_fk_parent')
      return { supported: fkEnforced, notes: fkEnforced ? undefined : 'Foreign keys not enforced' }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_fk_child')
      }
      catch {}
      try {
        await db.exec('DROP TABLE _test_fk_parent')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
