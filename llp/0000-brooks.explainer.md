# LLP 0000: Brooks

<!-- @ref https://github.com/ccheever/llp/blob/v0.2.0/llp/0000-linked-literate-programming.explainer.md — Canonical LLP definition -->

**Type:** Explainer
**Status:** Draft
**Systems:** Brooks
**Role:** Root
**Author:** Charlie Cheever / Codex
**Date:** 2026-07-13
**Related:** [ccheever/llp](https://github.com/ccheever/llp)

## Summary

[confirmed — Charlie Cheever, 2026-07-13] Brooks uses Linked Literate
Programming (LLP) to keep implementation connected to its design rationale.
This document is the entry point for that rationale.

[observed — repository at adoption] Brooks contained no tracked files or commit
history when LLP was introduced. Its product purpose, architecture, and
operating constraints were not yet documented.

## Project purpose

[inferred] Brooks is a greenfield project. Its intended users, problem
statement, and success criteria remain to be confirmed before this section can
serve as durable guidance.

## System map

[observed — repository at adoption] There are no implemented subsystems yet.
As stable boundaries emerge, this section should name each major subsystem,
its responsibility, and its relationships to the others.

## Current invariants

[confirmed — Charlie Cheever, 2026-07-13] Design knowledge for Brooks belongs
in numbered documents under `llp/`, with code linked to relevant document
sections through specific `@ref` annotations where the rationale is not obvious
from the code itself.

[observed — LLP adoption guide v0.2.0] This generated root document remains
`Draft` until its inferred claims are either confirmed, corrected, or removed.

## Open questions

The following are unanswered rather than assumed:

- [observed — repository at adoption] What problem does Brooks solve, and for
  whom?
- [observed — repository at adoption] Which runtime, language, and deployment
  model will it use?
- [observed — repository at adoption] Which constraints or tradeoffs should
  govern its first architectural decisions?

When one of these questions produces a non-obvious decision, record it in this
document or in the next numbered LLP rather than creating speculative documents
in advance.
