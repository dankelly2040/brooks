/**
 * Routed Contract entrypoint (LLP 0160, LLP 0154).
 *
 * The app is the route files under src/app/routes/; this file is the thin
 * boot shim: it builds the file router over the GENERATED registry
 * (src/app/routes.runtime.web.ts, emitted by `bun run generate:routes`),
 * attaches browser history, and mounts the Contract router adapter into the
 * page. On a plain browser tab the Contract web host renders into real DOM;
 * inside a platform host the host keeps ownership of pixels.
 */

import { reset } from '@exact/contract/runtime';
import {
  installContractWebHost,
  type ContractWebHostHandle,
} from '@exact/renderer/web-host';
import { attachBrowserHistory } from '@exact/router/browser';
import {
  createContractRouterAdapter,
  mountContractRouterAdapter,
} from '@exact/router/contract';
import { createFileRouter } from '@exact/router/core';

import { appRouteModules } from './app/routes.runtime.web.js';

// LLP 0004: scaffolded apps omit the web agent bootstrap; without it the
// agent API at /__exact/agent/ answers NO_REGISTERED_TARGET. Dev-only,
// lazy-loaded, degrades with a warning.
void Promise.all([
  import('@exact/devtools/agent/runtime-bootstrap'),
  import('@exact/devtools/agent/runtime-web-relay'),
]).catch((error: unknown) => {
  console.warn('[brooks] exact web agent bootstrap failed to load', error);
});

let disposeApp: (() => void) | null = null;

function initialPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

async function mountApp(): Promise<void> {
  const router = createFileRouter({
    modules: appRouteModules,
    appDir: 'app',
    platform: 'web',
    initialPath: initialPath(),
  });

  const rootElement = document.getElementById('exact-root') ?? document.body;
  rootElement.replaceChildren();

  const detachHistory = attachBrowserHistory(router);
  const webHost: ContractWebHostHandle | null = installContractWebHost({
    container: rootElement,
  });

  await router.initialize();
  const adapter = createContractRouterAdapter(router);
  const handle = await mountContractRouterAdapter(adapter);

  disposeApp = () => {
    detachHistory();
    handle.dispose();
    webHost?.dispose();
    reset();
    disposeApp = null;
  };
}

void mountApp().catch((error: unknown) => {
  console.error('[ExactStarter] router mount failed', error);
});

// Contract HMR is reset-based in v0: tear the tree down before the updated
// module re-mounts.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeApp?.();
  });
}
