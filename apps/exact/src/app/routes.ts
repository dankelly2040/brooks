// GENERATED FILE — do not edit by hand.
// Emitted by packages/exact-devtools/src/scripts/generate-route-registries.ts
// from src/app/routes/** and src/app/routes.profiles.ts (LLP 0154 P3).
// Regenerate with `bun run generate:routes` at the project root.
import { defineRouteModules } from 'exact';
import { defineContractRouteModule } from './contract-route-module.js';


const aboutRoute = defineContractRouteModule(() => import('./routes/about.contract'), { screen: { title: "About" }, head: { title: "About" } });
const indexRoute = defineContractRouteModule(() => import('./routes/index.contract'), { screen: { title: "Index" }, head: { title: "Index" } });

// Mixed registry for server-side tooling and route introspection. The
// live runtime loads the generated platform registries instead so startup
// never evaluates the wrong platform's route modules.
export const appRouteModules = defineRouteModules({
  'app/about.contract': aboutRoute,
  'app/index.contract': indexRoute,
});
