import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_boolean',
  kind: 'sql',
  category: 'types',
  description: 'Boolean type support',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_bool (val BOOLEAN)')
      await db.exec('INSERT INTO _test_bool (val) VALUES (TRUE)')
      await db.exec('INSERT INTO _test_bool (val) VALUES (FALSE)')
      const result = await db.sql`SELECT * FROM _test_bool`
      await db.exec('DROP TABLE _test_bool')
      return { supported: (result.rows?.length ?? 0) >= 2 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_bool')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
