# exact

This is the canonical agent-instructions file for this project. `CLAUDE.md`
mirrors it (a symlink on unix).

## Framework policy

This project is authored in **Contract**, Exact's default UI framework
(LLP 0160). Author new UI surfaces as `.contract` components. Production
client-rendered web remains React by lane policy (LLP 0160 §5.1); plain
`exact new` (this project) is the native-first app target — native lanes plus
the Exact dev-web loop. The React tier stays fully supported via
`exact new --framework react`.

## Contract primer

A Contract component is one indent-structured `.contract` file: props,
`state`, `derive`d values, `action`s, an optional `contract` block of
checkable behavior claims, and the `view` tree. The routes under
`src/app/routes/` are working examples — this is `index.contract` (the `/`
route):

```contract
// The `/` route, scaffolded by `exact new` (LLP 0160, ENG-22451).
// Contract is Exact's default UI framework: state, actions, and the view
// live in one indent-structured file, and the `contract` block declares
// behavior the runtime (and agents) can check against the rendered tree.

component HomeRoute
  state count = 0

  derive doubled = count * 2

  action increment writes count
    count = count + 1

  action decrement writes count
    count = count - 1

  contract
    has text "Exact Counter"
    has button "Up"
    has button "Down"
    press button "Up" -> increment
    press button "Down" -> decrement
    has node testId="about-link"

  view
    column gap=16 padding=24 maxWidth=480 alignSelf="center" width="100%"
      text "Exact Counter" size=13 weight=700 letterSpacing=1.2 color="#6366f1"
      text `Count: ${count}` size=40 weight=700 testId="counter-value"
      text `Doubled: ${doubled}` size=15 color="#6b7280" testId="counter-doubled"
      row gap=8
        button "Up" press=increment testId="increment"
        button "Down" press=decrement testId="decrement"
      link href="/about" label="About this app" testId="about-link"
        text "About this app" size=15 weight=600 color="#6366f1"
```

Key rules the compiler enforces:

- `state name = expr` declares reactive state; `derive name = expr` is computed.
- `action name writes a, b` must declare every state it writes; undeclared
  writes are compile errors.
- Interactive view nodes (`button`, `input`) need a label or `testId`.
- `each item in items key=item.id` — keys are required on lists.
- `when expr` / `else` branch the view tree.
- `link href="/about"` navigates between routes.

### The contract block

The `contract` block declares behavior the runtime can check against the
rendered tree and agents can read back:

- `has button "Up"` — the labeled element must exist.
- `press button "Up" -> increment` — pressing it runs the action.
- `state button "Up" is enabled` (or `is disabled`).
- `when <expr> then <clause>` — clauses that only apply in some states.

### Router entry

`src/main.tsx` is a thin boot shim: it builds the file router over the
generated registry (`src/app/routes.runtime.web.ts`), attaches browser
history, and mounts the Contract router adapter. `src/app/
contract-route-module.ts` re-exports the Contract route-record helper the
generated registries import. `vite.config.mjs` wires `contractVitePlugin()`
from `@exact/contract/vite-plugin` so `.contract` modules compile in the dev
graph.

### Verify loop

1. `bun run dev`, then open the printed URL (port 8083 by default).
2. Edit a route under `src/app/routes/`; the tree remounts on save.
3. Use the agent surface (below) to verify behavior against the contract
   block: fetch the tree (`exact_tree`), then drive interactions by `testId`
   and re-read state.

### What's built / what's coming

Contract v0 covers components, props/state/derive/actions, contract blocks,
lists, conditionals, and `.contract` route modules, on the dev-web loop and
the native protocol path. Form and overlay component sets (the Facet F2b/F3
tiers) and the Snapback data path are still burning down (LLP 0160 §7).
If you hit a missing surface, the React tier remains fully supported.

## Routing

This is a routed app (LLP 0154 single-source routes):

- A screen is ONE file under `src/app/routes/` — `index.*` is `/`, `about.*`
  is `/about`, `profile/[id].*` would be `/profile/:id`.
- The route registries (`src/app/routes*.ts`, `src/__generated/routes/`) are
  GENERATED from that filesystem by `bun run generate:routes`; `dev`, `build`,
  and `typecheck` run it automatically at startup. Never edit generated files
  by hand — a running dev server keeps serving the old registries until you
  restart it.
- When you add a route, also add its logical path (no extension) to the
  `CORE_PROFILE.routes` list in `src/app/routes.profiles.ts`. A route missing
  from every profile still works on web but silently renders not-found on
  native — `generate:routes` WARNS about it (set
  `REQUIRE_NATIVE_ROUTE_COVERAGE = true` in that file to make it a hard error
  once you are native-shipping).

## Native route selection

`src/app/route-modules.native.ts` is the native route selector: the generated
`src/__generated/routes/app/profiles.json` manifest names it as the
`selectorModuleId` the native host loads to pick — and lazily import — the
route registry chunk for the launch path. The starter ships a single core
profile, so every path resolves to `routes.runtime.native.core.ts`. To split a
route (or a path prefix) onto its own native chunk: add a profile name to the
`NativeRouteProfileName` union and an entry to `NATIVE_ROUTE_PROFILES` in
`routes.profiles.ts`, then add a matching literal `import()` loader to
`NATIVE_ROUTE_REGISTRY_LOADERS` in `route-modules.native.ts` (the typed record
turns a missing loader into a compile error).

## Native dev loop (macOS & iOS)

Scaffolded apps use the shared-host dev loop (LLP 0318): there is no per-app
Xcode project. `exact run macos` starts this app's dev server (or reuses one
via `--url`), locates a built ExactAppMac host binary (`--app` flag, then the
`EXACT_MAC_APP` env var, then the newest Xcode DerivedData build, then a
checksum-verified prebuilt artifact — see below), and
launches it pointed at the app via `EXACT_DEV_SERVER_URL`, with the agent
surface reachable through the dev-server relay (`<dev url>/__exact/agent/`;
opt out with `--no-agent`).

`exact run ios` does the same on the iOS simulator: it locates a built
simulator ExactApp.app (`--app` flag, then `EXACT_IOS_APP`, then the newest
`*-iphonesimulator` DerivedData build), picks a device (a booted simulator
wins; override with `EXACT_IOS_SIMULATOR`, a device name or UDID), boots it
if needed, and installs + launches attached to the console with the dev
server and agent wired through `SIMCTL_CHILD_*` environment forwarding.

`src/main.tsx` is the web entry; `src/main.native.tsx` is what a native host
actually evaluates (the startup pipeline resolves `/src/main.tsx` through the
shared `mac -> native -> unsuffixed` order). The native entry mounts the same
generated route registry over the Contract router adapter without touching
the DOM — keep DOM-only code (browser history, `document`) in `main.tsx`.

Host binaries: with an Exact checkout, build the `ExactAppMac` scheme
(macOS) or the `ExactApp` scheme against an iPhone-simulator destination
(iOS) there once (`git submodule update --init vendor/ibex` first). Without
a checkout, `exact run macos` falls back to a checksum-verified prebuilt
artifact: the published channel (GitHub release `host-macos-v<protocol>` on
ccheever/exact-releases; opt out with `EXACT_HOST_ARTIFACT_NO_DEFAULT=1`), or an
explicit `EXACT_HOST_ARTIFACT_MANIFEST_URL` / `EXACT_HOST_ARTIFACT_URL` +
`EXACT_HOST_ARTIFACT_SHA256` override (ENG-23311). Verified artifacts are
cached under `~/Library/Caches/exact/hosts/`. An installable/packaged app
story is tracked by ENG-22922 (LLP 0307); the iOS prebuilt variant is not
published yet.

## Platform-suffixed route overrides

A route is single-source by default: ONE unsuffixed module renders on web and
native. A platform-suffixed sibling (`index.native.contract`, `about.web.tsx`,
`settings.mac.tsx`) shadows the unsuffixed module through the shared
resolution order (`mac -> native -> unsuffixed`, `web -> unsuffixed`) and MUST
justify itself with a header comment on its first lines:

    // @platform-split: <reason> (LLP 0154)

`bun run check:platform-splits` enforces the header (it runs automatically in
`build` and `typecheck`); a suffixed route file without one fails the check.
Both a `.contract` and a `.tsx` present for the same route slot is a generator
error, not a resolution rule. Prefer converging on one unsuffixed route; split
only when a platform genuinely needs different structure. The full conventions
(dynamic segments, layouts, sidecars) are documented in the Exact repo's
`docs/adding-a-route.md`.

## Development

- Use `bun install` to install dependencies. The `@exact/*` packages are NOT
  registry dependencies: `exact.links.json` names where they live in the
  linked Exact checkout, and the `postinstall` script
  (`scripts/link-exact.mjs`) symlinks them into `node_modules`. If the
  checkout moves, update `exact.links.json` and re-run `bun install`.
- Run `bun run dev` to start the Exact + Vite dev server.
- In another terminal, run `bun run setup-mcp` to register this app's MCP bridge
  with Claude Code. The starter keeps that command local so the setup flow is
  the same here as it is in the main Exact repo.

## Agent API (Acto)

<!-- exact-skills:acto:start -->
<!-- Generated: Acto AGENTS excerpt -->
<!-- Authority: packages/exact-cli/skills/skills-manifest.json + tagged docs fragments -->
<!-- Generator: bun scripts/generate-skills-content.mjs --write -->
<!-- LLP: 0340 -->
<!-- Committed: yes -->
<!-- Input digest: 12e54d0a4f09c866924b0bd002caf5d2e956bb99b13e9e3bd3a35742a15aeb7d -->
<!-- Source commit: 038d4b1e0281aeac825d75b2e84ca3cce95f7648 (excluded from equality) -->

Use Acto's structured tree, layout, diagnostics, and interactions before
manual screenshots or generic automation. Capture one bundled snapshot,
preserve its `snapshotId`, and target by `ref + snapshotId`, then `testId`,
accessibility label, `viewId`, and only then coordinates. After an action,
prefer its `observeAfter` receipt or a tree diff; refresh stale refs from a
new snapshot. Query roots for modal/multi-window work and diagnostics for
clipping or zero-size failures. For selection work, pass a `windowId` from
`exact_windows` with an omitted/zero root to choose one physical projection;
a positive `rootId` targets that logical root exactly and takes precedence.

Read `.claude/skills/exact-inspect/SKILL.md` or `.agents/skills/exact-inspect/SKILL.md` for the complete stamped scaffold workflow.

<!-- exact-skills-stamp: input=12e54d0a4f09c866924b0bd002caf5d2e956bb99b13e9e3bd3a35742a15aeb7d content=be24a5d3ed58d415d33da21c6c2a9bd2a15a2f8e2bcd07ffb24903feb83d423c operation-consequence=66d3aa924bb66167311528ea20493fc60124e44c66fa325b6958c3dc63aa0c8d -->
<!-- exact-skills:acto:end -->

## Editing notes

- Keep generated files out of hand-authored app code. If you add generated
  outputs later, make their authority and regeneration command explicit.
