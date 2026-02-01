import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_on_duplicate',
  category: 'queries',
  description: 'ON DUPLICATE KEY (MySQL)',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_dup (id INTEGER PRIMARY KEY, name TEXT)')
      await driver.exec(`INSERT INTO _test_dup (id, name) VALUES (1, 'first')`)
      await driver.exec(`INSERT INTO _test_dup (id, name) VALUES (1, 'second') ON DUPLICATE KEY UPDATE name = 'updated'`)
      const result = await driver.query<{ name: string }>('SELECT name FROM _test_dup WHERE id = 1')
      await driver.exec('DROP TABLE _test_dup')
      return { supported: result.rows[0]?.name === 'updated' }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_dup')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'MySQL-specific syntax' }
    }
  },
}
