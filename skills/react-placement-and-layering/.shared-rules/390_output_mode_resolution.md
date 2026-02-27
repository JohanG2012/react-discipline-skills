# Output Mode Resolution

## Summary
Defines strict precedence for `output_mode` selection so human-invoked skill
runs do not accidentally emit raw JSON.

---

## Rule: Output Mode Resolution and Display Safety
**Rule ID:** sr-output-mode-resolution  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents accidental machine-mode output to humans and enforces
deterministic mode selection.
**Covers:** Output Mode Resolution and Display Safety.
**Index mode:** inline

### Requirement

- Resolve `output_mode` using strict precedence:
  1. if request explicitly sets `output_mode`, honor it,
  2. else if requester explicitly asks for machine-readable/raw JSON output
     (automation/integration intent), set `output_mode=agent`,
  3. else if a human explicitly asks to run/use the skill, set
     `output_mode=human`,
  4. else default to `output_mode=agent`.
- Ambiguity fallback:
  - when uncertain between human and agent, choose `output_mode=human`.
- Display contract remains strict:
  - if `output_mode=human`, display only `presentation.user_markdown`,
  - if `output_mode=agent`, display full JSON payload.
- A human-invoked skill run must not infer automation intent unless the human
  explicitly requests machine-readable output.

### Forbidden

- Selecting `output_mode=agent` by habit/default when a human explicitly
  requested skill usage and did not request machine-readable output.
- Inferring automation intent without explicit signal from the request context.
- Displaying raw JSON to a human when `output_mode=human`.
