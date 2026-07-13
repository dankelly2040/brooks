/**
 * Browser stub for `node:worker_threads`.
 *
 * Exact's in-browser agent server (`@exact/devtools/agent/server.ts`) imports
 * code-mode, which imports `node:worker_threads` at module scope. Vite
 * externalizes the node builtin with a shim that throws on *access*, which
 * kills the whole agent bootstrap in a plain browser tab — observed on
 * exact@origin/main c3f49e50 (recorded in diaries/). Code-mode itself is never
 * exercised by this prototype, so a never-used stand-in keeps the rest of the
 * agent server (tree, screenshot, tap, type) alive.
 */
export class Worker {
  constructor() {
    throw new Error('worker_threads.Worker is not available in the browser (Brooks prototype shim)');
  }
}

export const parentPort = null;
export const workerData = undefined;

export default { Worker, parentPort, workerData };
