# LLP 0000: Brooks

<!-- @ref https://github.com/ccheever/llp/blob/v0.2.0/llp/0000-linked-literate-programming.explainer.md — Canonical LLP definition -->

**Type:** Explainer
**Status:** Draft
**Systems:** Brooks, Expo App, Exact App, Agent Development
**Role:** Root
**Author:** Charlie Cheever / Codex
**Date:** 2026-07-13
**Revised:** 2026-07-13
**Related:** [ccheever/llp](https://github.com/ccheever/llp)

## Summary

[confirmed — Charlie Cheever, 2026-07-13] Brooks is a working mobile-commerce
prototype inspired by the store on the Brooks Running website. The repository
will contain two implementations of that experience: a production-quality Expo
app and a more experimental Exact app.

[confirmed — Charlie Cheever, 2026-07-13] The Expo app is the primary output.
It should feel exceptionally polished and demonstrate to Brooks executives that
Expo is a compelling way to build the company's mobile app experience.

[confirmed — Charlie Cheever, 2026-07-13] The Exact app is a secondary research
vehicle. It should test how far the current Exact implementation can go, expose
its limits, and generate concrete lessons that can improve Exact.

## Product experience

[confirmed — Charlie Cheever, 2026-07-13] Both apps should mirror the useful
shopping functionality of the Brooks Running website. A user should be able to
explore real merchandise and progress through the shopping journey through
adding products to a cart. Completing a purchase is explicitly out of scope.

[confirmed — Charlie Cheever, 2026-07-13] The Expo app should work on iOS and
Android, should ideally work on the web, and must target Expo SDK 57 so that it
can be run with Expo Go.

### Success criteria

- [confirmed — Charlie Cheever, 2026-07-13] The primary demo looks and feels
  excellent enough to impress Brooks executives, not merely prove technical
  feasibility.
- [confirmed — Charlie Cheever, 2026-07-13] Core browsing and product-detail
  experiences use real Brooks catalog data rather than a hand-authored mock
  catalog.
- [confirmed — Charlie Cheever, 2026-07-13] A user can select a purchasable
  product configuration and add it to a working cart.
- [confirmed — Charlie Cheever, 2026-07-13] iOS and Android are first-class
  targets; web is an additional target where practical.
- [confirmed — Charlie Cheever, 2026-07-13] The Exact implementation produces
  useful evidence about what Exact handles well, where agents struggle, and
  what should improve.

## Live Brooks data

[confirmed — Charlie Cheever, 2026-07-13] The prototypes should use the real
data and network APIs used by the Brooks Running website. Development should
inspect the website's behavior and network traffic, determine the requests and
responses needed for the in-scope shopping journey, and record the resulting
API knowledge in the repository so agents can build against it consistently.

[confirmed — Charlie Cheever, 2026-07-13] The live-data journey ends at a
working cart. The project does not need to submit payment or complete an order.

[inferred] API research and app behavior should avoid bypassing access controls,
capturing user secrets, placing orders, or depending on undocumented behavior
without recording the risk. The exact authorization, rate-limit, caching, and
data-retention constraints still need confirmation.

## Design direction

[confirmed — Charlie Cheever, 2026-07-13] Design work should begin with a
survey of the strongest contemporary mobile shoe-shopping experiences. The
survey should identify interaction and information-design patterns worth
adopting rather than blindly copying one competitor.

[confirmed — Charlie Cheever, 2026-07-13] The final experience should combine
those native-commerce patterns with the layout, visual language, content, and
character of the Brooks website. It should feel spiritually related to Brooks
while remaining distinctively native, highly polished, and appropriate for
mobile interaction.

[inferred] The design survey should evaluate at least navigation, discovery,
search and filtering, product presentation, size and color selection, cart
interaction, motion, accessibility, and the transition between editorial and
commerce content. The specific reference apps and evaluation rubric remain to
be chosen.

## Planned product surfaces

[confirmed — Charlie Cheever, 2026-07-13] The repository is expected to contain
an Expo app and an Exact app that pursue the same product experience with
different implementation goals.

[inferred] Shared schemas, captured API knowledge, design tokens, assets, and
test fixtures may belong in common packages, but the sharing boundary should be
chosen only after both runtimes' constraints are understood.

## AI-agent development diaries

[confirmed — Charlie Cheever, 2026-07-13] Most implementation work will be done
by AI agents. As part of normal development, agents should keep durable diaries
covering:

- what worked especially well;
- where they became blocked or lost time;
- what was technically tricky or unexpectedly hard;
- what they believe would have been easier in another system; and
- actionable ideas for improving Expo and Exact.

[confirmed — Charlie Cheever, 2026-07-13] These diaries are a project output
that will be used to improve Expo and Exact.

[inferred] Entries should favor concise observations, reproducible evidence,
decisions, and useful retrospectives. They should not contain secrets or attempt
to preserve private hidden reasoning, and they do not replace code or design
documentation.

[inferred] A lightweight structured format will make comparisons across tasks,
agents, Expo, and Exact more useful. The storage location, entry granularity,
required fields, and review cadence remain to be decided.

## Working principles

- [confirmed — Charlie Cheever, 2026-07-13] Optimize the Expo experience for
  executive-demo quality as well as functional correctness.
- [confirmed — Charlie Cheever, 2026-07-13] Prefer real Brooks data and observed
  behavior over invented fixtures for the primary user journey.
- [confirmed — Charlie Cheever, 2026-07-13] Preserve native quality instead of
  reproducing the website mechanically screen for screen.
- [confirmed — Charlie Cheever, 2026-07-13] Treat friction encountered by AI
  agents as research data that can improve the underlying developer tools.
- [observed — LLP adoption guide v0.2.0] Keep this generated root document
  `Draft` until its inferred claims are confirmed, corrected, or removed.

## Open questions

- Which Brooks market, locale, currency, and website environment define the
  canonical demo experience?
- Which exact customer journey is required for the first milestone: home,
  category browsing, search, filtering, product details, recommendations,
  variants, favorites, account, and cart editing?
- What permission, attribution, asset-usage, rate-limit, caching, and data
  retention constraints govern use of Brooks website services?
- Does the cart need to interoperate with a cart created on the website, or only
  behave correctly within the prototype?
- Which mobile commerce apps belong in the design survey, and what rubric will
  determine which patterns to adopt?
- What accessibility, responsiveness, performance, offline behavior, analytics,
  automated testing, and device coverage define “demo ready”?
- Which version and runtime of Exact is the target, and which platforms does its
  experiment need to support?
- What repository structure and code-sharing boundary best serve the Expo and
  Exact implementations?
- Where should agent diaries live, what fields are mandatory, and should every
  implementation task produce one entry or only noteworthy tasks?
- Who can confirm the remaining inferred claims and promote this root LLP from
  `Draft` to `Active`?
