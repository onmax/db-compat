import { testTarget } from '../target-suite'

testTarget({
  name: 'bun-sqlite',
  createDriver: async () => {
    const { createBunSqliteDriver } = await import('../drivers/bun-sqlite')
    return createBunSqliteDriver()
  },
  skipReason: typeof (globalThis as Record<string, unknown>).Bun === 'undefined' ? 'Bun runtime required' : undefined,
})
