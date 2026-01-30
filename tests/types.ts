import type { Database } from 'db0'
import type { CapabilityCategory, CapabilityResult, CompatKind, Db0Category } from '../packages/data/src/types'

export interface CapabilityTest {
  id: string
  kind: CompatKind
  category: CapabilityCategory | Db0Category
  description: string
  test: (db: Database) => Promise<CapabilityResult>
}
