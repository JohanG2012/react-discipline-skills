# Deterministic Defaults and Pause Discipline

## Summary
Defines pause thresholds, deterministic defaults, and clarification quality for
architecture detection.

---

## Rule: Default Bias and Clean Pause Protocol
**Rule ID:** rad-default-bias  
**Priority:** MUST  
**Applies to:** react-architecture-detection  
**Rationale:** Keeps detection decisive while pausing only for high-impact
structural ambiguity.

### Requirement

- Evaluate pause need using decision-safety confidence and impact:
  - `strict`: structural ambiguity requires pause.
  - `balanced` (default): pause only when `impact=structural` and
    `decision_safety_confidence < 0.7`.
  - `autonomous`: pause only when `impact=structural` and
    `decision_safety_confidence < 0.5`.
- Concern-gravity confidence and decision-safety confidence are distinct:
  - low concern confidence must set concern `home=unknown` and
    `status=ambiguous`
  - low concern confidence alone must not force pause
- Emit `pause_decision` for every run.
- For non-structural ambiguity, proceed with deterministic defaults and record
  concise notes.
- Do not over-ask:
  - avoid pausing for minor naming/style questions
  - avoid pausing when a safe default exists
- When pausing, use clean protocol:
  1. state ambiguity clearly
  2. provide two or three bounded options
  3. provide recommended option
  4. stop and wait

### Forbidden

- Pausing on local/non-structural ambiguity when safe defaults exist.
- Proceeding on unresolved structural ambiguity that meets pause threshold.
- Asking vague or non-blocking architecture questions.

### Notes

- Question quality must remain high-leverage, structural, and blocking.
