import type { CapabilityId, CapabilityResult } from '../packages/data/src/types'
import type { TestDriver } from './drivers/types'
import { capabilities } from './capabilities'

const INFRA_ERROR_PATTERNS = [
  /database ".*" does not exist/i,
  /connection refused/i,
  /ECONNREFUSED/i,
  /connect ETIMEDOUT/i,
  /ENOTFOUND/i,
]

function isInfraError(msg: string): boolean {
  return INFRA_ERROR_PATTERNS.some(p => p.test(msg))
}

export type TestResults = Record<CapabilityId, CapabilityResult>

export async function runAllTests(driver: TestDriver): Promise<TestResults> {
  const results: Partial<TestResults> = {}
  for (const cap of capabilities) {
    try {
      results[cap.id as CapabilityId] = await cap.test(driver)
    }
    catch (error) {
      const msg = (error as Error).message
      if (isInfraError(msg))
        throw new Error(`Infrastructure error: ${msg}`)
      results[cap.id as CapabilityId] = { supported: false, error: msg }
    }
  }
  return results as TestResults
}

export async function runTest(driver: TestDriver, capabilityId: CapabilityId): Promise<CapabilityResult> {
  const cap = capabilities.find(c => c.id === capabilityId)
  if (!cap)
    throw new Error(`Unknown capability: ${capabilityId}`)
  return cap.test(driver)
}

export { capabilities }
