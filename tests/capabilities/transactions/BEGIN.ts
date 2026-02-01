import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'BEGIN',
  category: 'transactions',
  description: 'Explicit transaction start with BEGIN statement',
  async test(driver) {
    try {
      await driver.exec('BEGIN')
      await driver.exec('SELECT 1')
      await driver.exec('COMMIT')
      return { supported: true }
    }
    catch (error) {
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
