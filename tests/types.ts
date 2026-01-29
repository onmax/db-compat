import type { Database } from 'db0'
import type { CapabilityDefinition, CapabilityResult } from '../packages/data/src/types'

export interface CapabilityTest extends CapabilityDefinition {
  test: (db: Database) => Promise<CapabilityResult>
}
