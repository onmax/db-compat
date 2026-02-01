import type { CapabilityCategory, CapabilityResult } from '../packages/data/src/types'
import type { TestDriver } from './drivers/types'

export interface CapabilityTest {
  id: string
  category: CapabilityCategory
  description: string
  test: (driver: TestDriver) => Promise<CapabilityResult>
}

export function normalizeD1Error(error: Error): { error: string, notes?: string } {
  if (error.message.includes('Cannot read properties of undefined (reading \'duration\')')) {
    return { error: 'D1 does not support transactions', notes: 'Use batch() for atomic operations' }
  }
  return { error: error.message }
}
