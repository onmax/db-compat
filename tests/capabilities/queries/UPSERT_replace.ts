import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_replace',
  category: 'queries',
  description: 'REPLACE INTO (SQLite)',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_replace (id INTEGER PRIMARY KEY, name TEXT)')
      await driver.exec(`INSERT INTO _test_replace (id, name) VALUES (1, 'first')`)
      await driver.exec(`REPLACE INTO _test_replace (id, name) VALUES (1, 'replaced')`)
      const result = await driver.query('SELECT name FROM _test_replace WHERE id = 1')
      await driver.exec('DROP TABLE _test_replace')
      return { supported: result.rows[0]?.name === 'replaced' }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_replace')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'SQLite/MySQL syntax' }
    }
  },
}
