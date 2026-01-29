import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'BEGIN',
  category: 'transactions',
  description: 'Explicit transaction start with BEGIN statement',
  async test(db) {
    try {
      await db.exec('BEGIN')
      await db.exec('SELECT 1')
      await db.exec('COMMIT')
      return { supported: true }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
