---
name: exact-inspect
description: Inspect, verify, and debug a running Exact app through Acto's snapshot-first workflow.
---

<!-- Generated: Acto scaffold skill -->
<!-- Authority: packages/exact-cli/skills/skills-manifest.json + tagged docs fragments -->
<!-- Generator: bun scripts/generate-skills-content.mjs --write -->
<!-- LLP: 0340 -->
<!-- Committed: yes -->
<!-- Input digest: 12e54d0a4f09c866924b0bd002caf5d2e956bb99b13e9e3bd3a35742a15aeb7d -->
<!-- Source commit: 038d4b1e0281aeac825d75b2e84ca3cce95f7648 (excluded from equality) -->

# exact-inspect

## Versioned source and fallback order

1. When an app is running, prefer `exact_onboarding` or `GET /agent/onboarding`; it describes the runtime actually being driven.
2. Pre-boot/offline, use the stamped snapshot below. The v1 catalog is checkout-gated, so the scaffold intentionally omits an unusable CLI rung.

Acto is Exact's built-in agent subsystem — the way an AI agent (or a script,
or a curious human with `curl`) sees and drives a running Exact app. This
guide teaches the mental model and the core working loop. It is deliberately
short; use the full Agent API reference when you need endpoint-by-endpoint
detail.

If you are an agent and an Exact app is running, **Acto is your eyes and
hands**. Reach for it before screenshots-by-hand, generic browser automation,
or log archaeology.

> **On the name.** Acto (LLP 0321) is the internal working name for the whole
> subsystem — inspector, agent server, MCP tools, HTTP surfaces, clients, and
> replay. The wire names are older and unchanged: MCP tools are `exact_*`,
> HTTP routes are `/agent/*`, the dev-server relay is `/__exact/agent/*`, and
> the TypeScript client is `ExactAgent`. When you see those names, you are
> looking at Acto.

Three ideas carry the whole API. Get these and everything else is detail.

**A snapshot is a consistency token.** Most reads return a `snapshotId` —
"the UI as of this observation." Refs, annotated screenshots, and trees from
one snapshot describe the same instant.

**Refs are snapshot-local handles.** Targetable elements get refs like `@e1`.
A ref means nothing without the `snapshotId` that minted it, and it can go
stale when the app re-renders. A stale ref fails with `409 STALE_REF` plus a
typed reason and remedy — the answer is almost always: take a fresh snapshot,
re-find your element, retry once.

**`viewId` is the identity that survives.** Refs die with their snapshot;
`viewId` is the stable node identity across snapshots (and, in dev web
builds, the `data-exact-view-id` DOM attribute). When you need to track "the
same element" across time or across tools, correlate by `viewId`.

Two more things worth knowing before you act:

- **Roots.** Modals, sheets, and overlays can live in a separate UI root.
  If the thing you're looking for isn't in the tree, list `exact_roots` and
  pass `rootId` explicitly.
- **Coordinates are root-local points, not pixels.** Frames fold in scroll
  offsets the inspector has observed; an element can have a frame far outside
  the viewport and still be perfectly real.

### Targeting order

When you interact, identify the target this way, best first:

1. `ref` + `snapshotId` — precise and validated
2. `testId` — stable, author-assigned (this is why every significant Contract
   node should carry one)
3. accessibility `label`
4. `viewId`
5. raw `x`/`y` coordinates — last resort; least stable, no receipts about
   what you actually hit

Everything you do with Acto is some version of: **observe → act → observe
again**.

### 1. Observe: one bundled snapshot

Start every session — and every new screen — with a single bundled snapshot
rather than separate tree and screenshot calls (refs are snapshot-local, so
separate calls give you refs from *different* instants):

```text
exact_snapshot({
  include: ["tree", "screenshot", "diagnostics"],
  treeFormat: "yaml",
  screenshot: { annotate: true }
})
```

or over HTTP: `POST /__exact/agent/snapshot` with the same body. Keep the
returned `snapshotId`. The annotated screenshot stamps the same `@eN` refs
onto the image, so the picture and the tree agree.

For tree-only reads, `exact_tree` with `format="dense"` is the recommended
mid-density view: structure plus refs, testIds, values, states, and frames on
targetable nodes. `format="yaml"` is structure-only; drill into one subtree
with `viewId` + `format="full"` when you need everything about a little
rather than a little about everything.

### 2. Act

- `exact_tap` — press things
- `exact_type` — text entry (supports `clearFirst`)
- `exact_set_value` — change-driven controls like sliders, without faking a drag
- `exact_scroll` / host scroll — see "Scrolling on native" below
- `exact_gesture` — swipe, pinch, longPress
- `exact_navigate` — drive the router directly

Pass `ref` + `snapshotId` (or `testId`). Read the receipt: `dispatched: true`
means the press handler ran in JS. On native hosts the receipt also carries
`nativeReachability` — whether a *real* click at that point would have reached
your target, or whether an overlay is eating it. A tap that dispatches
semantically but reports `reachesTarget: false` is a bug you just found, not
a success.

### 3. Observe again — cheaply

After a mutation, don't re-dump the world. In order of preference:

- **`observeAfter` on the action itself.** Any mutating call accepts
  `observeAfter: { include: [...] }` and returns the post-action bundle
  inline — act and observe in one round trip, settle-gated by default so you
  see the UI after animations and navigation quiesce.
- **A diff.** `GET /agent/tree?since=<oldSnapshotId>&diffMode=semantic` gives
  you an added/removed/updated summary instead of a full tree.
- **A fresh bundled snapshot** — when the screen genuinely changed shape.

And when you need to wait for something, **use `exact_wait`, never sleep**.
Conditions (`viewExists`, `textContains`, `idle`, `networkIdle`,
`animationSettled`, `navigationSettled`, `visible`, `interactable`, ...) are
event-sourced and typically resolve in single-digit milliseconds after the
condition becomes true, instead of on a poll tick.

### A worked example

"Tap the Toggle button on the stations panel and confirm the list appeared":

```text
1. exact_snapshot({include:["tree","screenshot"], treeFormat:"yaml",
                   screenshot:{annotate:true}})
     → snapshotId "s_412"; the tree shows button testId="toggle" as @e3
2. exact_tap({ref:"@e3", snapshotId:"s_412",
              observeAfter:{include:["tree"], treeFormat:"yaml"}})
     → receipt: dispatched:true, nativeReachability.reachesTarget:true;
       observation.tree now contains testId="station-list"
3. Done — one snapshot, one act-with-observe. No sleeps, no re-dumps.
```

Scaffolded apps check in `.mcp.json`; prefer its `exact_*` bridge while
`bun run dev` is running. The relay normally lives at
`http://127.0.0.1:8083/__exact/` (`EXACT_DEV_URL` overrides it), while a native
host may expose the direct local endpoint at
`http://127.0.0.1:9333/agent/`. Before the app boots, use the stamped skill
snapshot in `.claude/skills/exact-inspect/SKILL.md` or its `.agents` twin.
Once the app is reachable, `exact_onboarding` / `GET /agent/onboarding` wins
because it describes the runtime actually being driven.

<!-- exact-skills-stamp: input=12e54d0a4f09c866924b0bd002caf5d2e956bb99b13e9e3bd3a35742a15aeb7d content=c2aef9a2f8ae5765543603606237c1c82f51bec4046581c601c8e5dedd9d365b operation-consequence=66d3aa924bb66167311528ea20493fc60124e44c66fa325b6958c3dc63aa0c8d -->
