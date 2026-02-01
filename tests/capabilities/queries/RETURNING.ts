import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'RETURNING',
  category: 'queries',
  description: 'RETURNING clause',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_returning (id INTEGER PRIMARY KEY, name TEXT)')
      const result = await driver.query<{ id: number, name: string }>('INSERT INTO _test_returning (id, name) VALUES (1, \'test\') RETURNING id, name')
      await driver.exec('DROP TABLE _test_returning')
      return { supported: result.rows.length === 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_returning')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'Not supported in MySQL' }
    }
  },
}
