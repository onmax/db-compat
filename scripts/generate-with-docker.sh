#!/bin/bash
set -e

# Start postgres and mysql
docker compose up -d --wait postgres mysql

# Run bun-sqlite tests in Bun container
echo "Running bun-sqlite tests..."
docker compose run --rm bun

# Run D1 tests via miniflare
echo "Running D1 tests..."
pnpm run generate:d1

# Run Hyperdrive tests via miniflare (needs docker databases)
echo "Running Hyperdrive tests..."
POSTGRESQL_URL=postgres://postgres:postgres@localhost:5432/test \
MYSQL_URL=mysql://root:mysql@localhost:3306/test \
pnpm run generate:hyperdrive

# Run main generation with all env vars
echo "Running main generation..."
POSTGRESQL_URL=postgres://postgres:postgres@localhost:5432/test \
MYSQL_URL=mysql://root:mysql@localhost:3306/test \
BUN_RESULTS_PATH=.bun-results.json \
D1_RESULTS_PATH=.d1-results.json \
HYPERDRIVE_RESULTS_PATH=.hyperdrive-results.json \
pnpm run generate

# Cleanup
rm -f .bun-results.json .d1-results.json .hyperdrive-results.json
