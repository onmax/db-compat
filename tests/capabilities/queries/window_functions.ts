import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'window_functions',
  category: 'queries',
  description: 'Window functions (ROW_NUMBER, etc.)',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_window (id INTEGER, val INTEGER)')
      await driver.exec('INSERT INTO _test_window VALUES (1, 10), (2, 20), (3, 30)')
      const result = await driver.query('SELECT id, val, ROW_NUMBER() OVER (ORDER BY id) as rn FROM _test_window')
      await driver.exec('DROP TABLE _test_window')
      return { supported: result.rows.length >= 3 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_window')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
