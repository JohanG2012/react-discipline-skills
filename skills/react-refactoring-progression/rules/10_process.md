# Refactor Planning Process

## Summary

Defines deterministic, risk-ordered planning behavior.

---

## Rule: Tiered Planning Sequence
**Rule ID:** rrp-process  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Ensures predictable and low-risk refactor planning.
**Covers:** Tiered Planning Sequence.
**Index mode:** reference

### Requirement

- Validate required inputs before planning steps.
- Resolve effective output mode before planning output:
  - accept optional `output_mode` (`human|agent`)
  - resolve with strict precedence:
    1. explicit `output_mode` in request
    2. explicit machine-readable/raw JSON request -> `agent`
    3. human explicitly instructs this skill -> `human`
    4. otherwise -> `agent`
  - when uncertain between `human` and `agent`, choose `human`
- Clarification loop support:
  - when a high-impact ambiguity blocks deterministic plan quality, emit
    `clarification_request` and pause planning,
  - ask at most 4 questions in one request,
  - each question must provide `A`/`B`/`C` options (optional `D` when needed),
  - ask only questions that materially affect scope, safety, boundary ownership,
    or acceptance outcomes,
  - when `clarification_answers` are provided on resume, continue planning and
    produce a final `refactor_plan`/error result (not another duplicate
    clarification for already-answered items).
- Dedicated no-op guard:
  - if dedicated mode is explicitly requested but the request does not provide
    specific refactor targets/instructions, run bounded discovery first,
  - treat rule-defined opportunities as meaningful by default:
    - any actionable issue/finding/opportunity derived from active shared or
      skill rules counts as meaningful,
  - if no meaningful improvement is found after that discovery, do not force
    speculative/filler steps and do not emit a full findings report,
  - return an accepted `refactor_plan` with empty `plan.steps[]` plus concise
    guidance to rerun with specific improvement goals,
  - this no-op guard takes precedence over clarification requests for purely
    open-ended "refactor something" prompts when no meaningful opportunities
    are found.
- Use canonical tier labels only: `A`, `B`, `C`, `D`.
- Order active plan steps from lower-risk to higher-risk tiers.
- Apply deterministic ordering with no additional custom ordering beyond:
  - tier order (`A -> B -> C -> D`)
  - risk order (low before high within the produced list)
- Before any helper-script-assisted detection:
  - complete a rule-first reasoning pass using active shared + skill rules,
  - complete a direct repository scan pass without helper scripts,
  - if those passes already produce meaningful actionable opportunities with
    sufficient confidence, skip helper scripts,
  - allow script usage only when unresolved ambiguity remains and confidence is
    still low after those two passes, or when no meaningful opportunities are
    found from those passes.
- Escalate only when at least one condition is true:
  - a lower-tier improvement is blocked by compliance constraints
  - no meaningful lower-tier improvements remain
  - dedicated refactor mode is explicitly requested
- Every step must include:
  - `why_now`
  - at least one of `unblocks`, `reduces_future_cost`, `standard_alignment`
- Set `behavior_change=none` by default.
- If behavior-preserving guarantees cannot be met, set
  `behavior_change=requires_approval` and mark step as gated.
- In opportunistic mode, produce only Tier A/B active steps and prioritize:
  - dead code removal and import cleanup
  - naming clarity and local helper extraction
  - type tightening
  - non-structural boundary-conformance fixes
- Prioritize implementation-focused improvements over test-only improvements.
- Test updates should be proposed in active steps only when they are required to
  preserve, validate, or safely land implementation-focused improvements.
- Test-only improvements may be suggested only when no meaningful
  implementation-focused improvements remain in current scope.
- In opportunistic mode, treat Tier C/D findings as non-blocking follow-up
  guidance only.
- In opportunistic mode, do not include:
  - layer changes
  - endpoint relocation
  - cross-home adjustments
  - architectural boundary introduction
- In dedicated mode, allow Tier C/D only under scope-governor and migration
  constraints.

### Forbidden

- Skipping low-risk tiers when safe lower-tier improvements are available.
- Returning unguided or rationale-free steps.
- Using mixed tier naming schemes (for example `0-4` plus `A-D`) in one output.
- Escalating for aesthetic cleanup, style-only churn, or speculative
  "refactor for future" rationale.
- Running helper scripts as default first-step detection.
- Running helper scripts to pad evidence when meaningful opportunities are
  already established from rule-first and direct-scan analysis.
- Asking low-value stylistic clarification questions that do not change planning
  decisions.
- Fabricating low-value refactor steps to avoid returning an empty dedicated
  plan when no meaningful opportunities are found.
- Returning dedicated no-op output when actionable rule-defined opportunities
  exist in current scope.

### Notes

- Tier C/D recommendations in opportunistic mode belong in follow-up findings,
  not active steps.
