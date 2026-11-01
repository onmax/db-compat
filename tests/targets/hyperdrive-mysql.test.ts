import type { HyperdriveBinding } from '../drivers/hyperdrive'
import { createHyperdriveMysqlDriver } from '../drivers/hyperdrive'
import { testTarget } from '../target-suite'

testTarget({
  name: 'hyperdrive-mysql',
  createDriver: () => createHyperdriveMysqlDriver((globalThis as unknown as Record<string, HyperdriveBinding>).HYPERDRIVE_MYSQL),
  skipReason: typeof (globalThis as Record<string, unknown>).HYPERDRIVE_MYSQL === 'undefined' ? 'Hyperdrive MySQL binding not available' : undefined,
})
