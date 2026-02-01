# db-compat

Test SQL capabilities across different database drivers.

**[View the compatibility matrix →](https://db-compat.onmax.me)**

## What it does

db-compat runs standardized tests against SQL databases to determine which features each driver supports. The results are published as a compatibility matrix showing support for transactions, JSON operations, CTEs, full-text search, and more.

## Targets

**SQLite:** better-sqlite3, libSQL, Bun SQLite, Node SQLite, sqlite3, Cloudflare D1

**PostgreSQL:** PGlite, PostgreSQL (pg), Hyperdrive PostgreSQL

**MySQL:** MySQL (mysql2), PlanetScale, Hyperdrive MySQL

## Using the data

```bash
npm install @db-compat/data
```

```ts
import { capabilities, compatData, targets } from '@db-compat/data'

// Check if a target supports a capability
const supportsJson = compatData.sql.json.JSON_EXTRACT.support['better-sqlite3'].supported

// Get all targets for a dialect
const sqliteTargets = targets.filter(t => t.dialect === 'sqlite')
```

## Contributing

See [How It Works](https://db-compat.onmax.me/how-it-works) for details on adding targets, capabilities, and running tests locally.

## License

[MIT](./LICENSE)
