import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { createHyperdriveMysqlDriver, createHyperdrivePgDriver, mockHyperdrive } from '../tests/drivers/hyperdrive'
import { runAllTests } from '../tests/runner'

const results: Record<string, Awaited<ReturnType<typeof runAllTests>>> = {}

if (process.env.POSTGRESQL_URL) {
  console.log('Testing hyperdrive-postgresql...')
  const driver = createHyperdrivePgDriver(mockHyperdrive(process.env.POSTGRESQL_URL))
  results['hyperdrive-postgresql'] = await runAllTests(driver)
  await driver.close()
}

if (process.env.MYSQL_URL) {
  console.log('Testing hyperdrive-mysql...')
  const driver = await createHyperdriveMysqlDriver(mockHyperdrive(process.env.MYSQL_URL))
  results['hyperdrive-mysql'] = await runAllTests(driver)
  await driver.close()
}

if (Object.keys(results).length > 0) {
  writeFileSync('.hyperdrive-results.json', JSON.stringify(results))
  console.log('Hyperdrive results written to .hyperdrive-results.json')
}
else {
  console.log('No database URLs provided, skipping Hyperdrive tests')
}

process.exit(0)
