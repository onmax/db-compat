import type { Database } from 'db0'
import type { CapabilityCategory, CapabilityResult, CompatKind, Db0Category } from '../packages/data/src/types'

export interface CapabilityTest {
  id: string
  kind: CompatKind
  category: CapabilityCategory | Db0Category
  description: string
  test: (db: Database) => Promise<CapabilityResult>
}

export function normalizeD1Error(error: Error): { error: string, notes?: string } {
  if (error.message.includes('Cannot read properties of undefined (reading \'duration\')')) {
    return { error: 'D1 does not support transactions', notes: 'Use batch() for atomic operations' }
  }
  return { error: error.message }
}
