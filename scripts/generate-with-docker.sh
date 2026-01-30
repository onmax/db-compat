#!/bin/bash
set -e

# Start postgres and mysql
docker compose up -d --wait postgres mysql

# Run bun-sqlite tests in Bun container
echo "Running bun-sqlite tests..."
docker compose run --rm bun

# Run main generation with all env vars
echo "Running main generation..."
POSTGRESQL_URL=postgres://postgres:postgres@localhost:5432/test \
MYSQL_URL=mysql://root:mysql@localhost:3306/test \
BUN_RESULTS_PATH=.bun-results.json \
pnpm run generate

# Cleanup
rm -f .bun-results.json
