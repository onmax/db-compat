import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_close',
  kind: 'db0',
  category: 'connection',
  description: 'Connection cleanup',
  async test(db) {
    try {
      // Check if close method exists and is callable
      const hasClose = typeof (db as unknown as { close?: unknown }).close === 'function'
      return { supported: hasClose, notes: hasClose ? undefined : 'close() method not available' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
