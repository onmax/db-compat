import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'batch_atomicity',
  category: 'transactions',
  description: 'Atomic batch execution',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_batch (id INTEGER PRIMARY KEY)')
      try {
        await driver.exec(`INSERT INTO _test_batch (id) VALUES (1); INSERT INTO _test_batch (id) VALUES (1);`)
      }
      catch {}
      const result = await driver.query('SELECT * FROM _test_batch')
      await driver.exec('DROP TABLE _test_batch')
      return { supported: result.rows.length < 1, notes: result.rows.length > 0 ? 'Batch not atomic - partial execution' : undefined }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_batch')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
