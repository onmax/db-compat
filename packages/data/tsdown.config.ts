import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  dts: true,
  unbundledModuleIdResolver(id) {
    if (id.endsWith('.json'))
      return false
    return undefined
  },
})
