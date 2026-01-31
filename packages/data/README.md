# db-compat-data

Database capability compatibility data for [db0](https://github.com/unjs/db0).

## Install

```bash
npm install db-compat-data
```

## Usage

```ts
import { compatData, getCoverageV2, targets } from 'db-compat-data'

// Check if a target supports a capability
const cteSupport = compatData.sql.queries.CTE.support['db0-libsql']
console.log(cteSupport.supported) // true

// Get all targets
console.log(targets.map(t => t.name))

// Get coverage for a target
const coverage = getCoverageV2(compatData, 'db0-libsql')
console.log(`${coverage.percentage}% supported`)
```

## License

MIT
