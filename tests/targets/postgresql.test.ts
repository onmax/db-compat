import { createPgDriver } from '../drivers/pg'
import { testTarget } from '../target-suite'

testTarget({
  name: 'postgresql',
  createDriver: () => createPgDriver(process.env.POSTGRESQL_URL!),
  skipReason: process.env.POSTGRESQL_URL ? undefined : 'POSTGRESQL_URL not set',
})
