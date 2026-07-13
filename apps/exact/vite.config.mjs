import { defineConfig } from 'vite';
import { contractVitePlugin } from '@exact/contract/vite-plugin';
import { exactVitePlugin } from '@exact/devtools';

export default defineConfig({
  plugins: [
    // Compiles `.contract` modules (enforce: 'pre') before anything else
    // in the graph sees them.
    contractVitePlugin(),
    exactVitePlugin({
      entry: '/src/main.tsx',
    }),
  ],
  resolve: {
    // React is a real dependency of this app (the renderer uses it at
    // runtime, and the native dep optimizer must be able to resolve it from
    // this root — ENG-22663/ENG-23265); dedupe so the source-linked @exact
    // packages resolve this app's copy (two React instances break hooks).
    dedupe: ['react', 'react-dom'],
    alias: {
      // The in-browser agent server transitively imports node:worker_threads
      // (code-mode) on exact@origin/main, which Vite externalizes into a
      // throw-on-access shim that kills the whole agent bootstrap. Code-mode
      // is unused here; a benign stub keeps tree/tap/type/screenshot alive.
      // See src/shims/worker-threads.ts and the diary entry for this build.
      'node:worker_threads': new URL('./src/shims/worker-threads.ts', import.meta.url).pathname,
      'node:crypto': new URL('./src/shims/node-crypto.ts', import.meta.url).pathname,
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    // Raw development loader data is intentionally loopback-only by default.
    // Change this explicitly when testing on a trusted LAN device.
    host: '127.0.0.1',
    port: 8083,
  },
});
