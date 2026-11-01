import { createPgliteDriver } from '../drivers/pglite'
import { testTarget } from '../target-suite'

testTarget({
  name: 'pglite',
  createDriver: createPgliteDriver,
})
