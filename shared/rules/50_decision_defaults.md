# Decision Defaults and Pause Rules

## Summary
Defines deterministic default behavior and high-impact clarification triggers.

---

## Rule: Deterministic Defaults and Pause Protocol
**Rule ID:** apv-decision-defaults  
**Priority:** MUST  
**Applies to:** __TARGET_SKILL__  
**Inherited from:** shared-rules  
**Rationale:** Reduces unnecessary clarification loops while protecting
high-impact structural decisions.

### Requirement

- Use deterministic defaults for non-structural ambiguity.
- Pause only when both are true:
  - `confidence < 0.7`
  - `impact = structural`
- Structural impact includes top-level structure changes, competing concern
  homes, dependency-direction changes, cross-layer moves, global state strategy
  changes, or scope-cap violations.
- When pausing, use clean pause protocol:
  - State ambiguity clearly.
  - Present 2-3 options.
  - Recommend a default.
  - Wait for confirmation.
- Use `balanced` pause mode by default unless explicitly configured otherwise.
- Do not pause for minor decisions when a safe default exists.

### Forbidden

- Proceeding on structural ambiguity without pause.
- Repeated low-value questions when a safe deterministic default exists.
- Vague, non-blocking, or style-only clarification questions that do not change
  structural outcomes.
