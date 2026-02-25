# Overview

## Summary

Defines the authoritative scope and boundaries for
`react-refactoring-progression`.

---

## Rule: Optional Extension Scope
**Rule ID:** rrp-overview-scope  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps this skill planning-only and aligned with the fixed
four-skill production pipeline.

### Requirement

- The skill must remain an optional extension and must not redefine the fixed
  production execution set.
- The default invocation path is an opportunistic consult at the end of
  `react-implementation-discipline` execution for both micro and standard
  modes.
- The skill must produce planning guidance only and must not emit
  implementation patches.
- The skill must consume upstream architecture, placement, reuse, and
  implementation context rather than recomputing those outcomes.
- The skill must keep recommendations behavior-preserving by default.
- The skill must inherit mandatory shared baseline constraints.
- The skill must remain optional until an explicit governance amendment
  reclassifies it.

### Forbidden

- Reclassifying this skill as a production execution skill inside feature
  output.
- Recomputing architecture gravity or overriding upstream placement/reuse
  decisions.
- Producing direct source-code patches or file-apply payloads.

### Notes

- This skill is a consult layer, not an implementation layer.
