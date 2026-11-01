import type { HyperdriveBinding } from '../drivers/hyperdrive'
import { createHyperdrivePgDriver } from '../drivers/hyperdrive'
import { testTarget } from '../target-suite'

testTarget({
  name: 'hyperdrive-postgresql',
  createDriver: () => createHyperdrivePgDriver((globalThis as unknown as Record<string, HyperdriveBinding>).HYPERDRIVE_PG),
  skipReason: typeof (globalThis as Record<string, unknown>).HYPERDRIVE_PG === 'undefined' ? 'Hyperdrive PostgreSQL binding not available' : undefined,
})
