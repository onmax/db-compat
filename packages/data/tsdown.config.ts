import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/db0.ts'],
  format: 'esm',
  dts: true,
  clean: true,
})
