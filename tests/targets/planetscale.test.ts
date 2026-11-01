import { createPlanetscaleDriver } from '../drivers/planetscale'
import { testTarget } from '../target-suite'

testTarget({
  name: 'planetscale',
  createDriver: () => createPlanetscaleDriver(process.env.PLANETSCALE_URL!),
  skipReason: process.env.PLANETSCALE_URL ? undefined : 'PLANETSCALE_URL not set',
})
