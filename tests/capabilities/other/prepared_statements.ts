import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'prepared_statements',
  category: 'other',
  description: 'Prepared statements',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_prep (id INTEGER, name TEXT)')
      await driver.query('INSERT INTO _test_prep (id, name) VALUES (?, ?)', [1, 'test'])
      const result = await driver.query<{ name: string }>('SELECT * FROM _test_prep WHERE name = ?', ['test'])
      await driver.exec('DROP TABLE _test_prep')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_prep')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
