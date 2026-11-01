import type { D1Database } from '../drivers/cloudflare-d1'
import { createD1Driver } from '../drivers/cloudflare-d1'
import { testTarget } from '../target-suite'

testTarget({
  name: 'cloudflare-d1',
  createDriver: () => createD1Driver((globalThis as unknown as Record<string, D1Database>).D1_DATABASE),
  skipReason: typeof (globalThis as Record<string, unknown>).D1_DATABASE === 'undefined' ? 'D1 binding not available' : undefined,
})
