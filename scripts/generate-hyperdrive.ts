import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { consola } from 'consola'
import { resolve } from 'pathe'
import { createHyperdriveMysqlDriver, createHyperdrivePgDriver, mockHyperdrive } from '../tests/drivers/hyperdrive'
import { runAllTests } from '../tests/runner'

function getPackageVersion(pkg: string): string {
  const pkgJson = resolve(import.meta.dirname, '../node_modules', pkg, 'package.json')
  return JSON.parse(readFileSync(pkgJson, 'utf-8')).version
}

const results: Record<string, Awaited<ReturnType<typeof runAllTests>>> = {}
const versions: Record<string, string> = {}

if (process.env.POSTGRESQL_URL) {
  consola.start('Testing hyperdrive-postgresql...')
  const driver = createHyperdrivePgDriver(mockHyperdrive(process.env.POSTGRESQL_URL))
  results['hyperdrive-postgresql'] = await runAllTests(driver)
  versions['hyperdrive-postgresql'] = `pg ${getPackageVersion('pg')} + hyperdrive`
  await driver.close()
}

if (process.env.MYSQL_URL) {
  consola.start('Testing hyperdrive-mysql...')
  const driver = await createHyperdriveMysqlDriver(mockHyperdrive(process.env.MYSQL_URL))
  results['hyperdrive-mysql'] = await runAllTests(driver)
  versions['hyperdrive-mysql'] = `mysql2 ${getPackageVersion('mysql2')} + hyperdrive`
  await driver.close()
}

if (Object.keys(results).length > 0) {
  writeFileSync('.hyperdrive-results.json', JSON.stringify({ results, versions }))
  consola.success('Hyperdrive results written to .hyperdrive-results.json')
}
else {
  consola.warn('No database URLs provided, skipping Hyperdrive tests')
}

process.exit(0)
