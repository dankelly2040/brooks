# Agent Instructions

This project uses **Linked Literate Programming (LLP)**. Start with
[LLP 0000](./llp/0000-brooks.explainer.md) before making substantial changes.

## LLP documents

- LLP documents live in `llp/` and use the filename convention
  `NNNN-slug.type.md`. Numbers are globally unique and never reused.
- New LLPs include `Type`, `Status`, `Systems`, `Author`, and `Date` metadata.
  Use `Role: Root` only for the corpus entry point.
- LLPs are living documents. Update them with the code and clearly mark stale
  guidance as `Superseded` or `Tombstoned`.
- Prefer extending an existing LLP when it already covers the topic.

## References

- Add an `@ref` when code implements a non-obvious decision documented in an
  LLP: `// @ref LLP NNNN#section — short gloss`.
- Read and verify an existing `@ref` before changing the code it governs.
- Do not annotate mechanically; a reference should add rationale that the code
  and filename do not already reveal.

<!-- BEGIN LLP SKILLS MANAGED BLOCK -->
Before editing a subsystem with documented design, orient first: read its
governing LLP, and for non-trivial work invoke `llp-orient` to assemble a
context pack of the constraints the change must respect.

Skills: orient = context before coding · create = author one LLP · review = LLP review loop, scaled to stakes · adopt = set up LLP in any repo (scaffold or retrofit) · maintain = drift / pre-PR / reconcile / retire checks
<!-- END LLP SKILLS MANAGED BLOCK -->

## Working on Brooks

- Capture non-obvious design decisions while their rationale is fresh.
- Keep generated rationale tagged as `[observed]`, `[confirmed]`, or
  `[inferred]`; do not promote inferred claims without human confirmation.
- Land LLP updates in the same change as the implementation they explain.

