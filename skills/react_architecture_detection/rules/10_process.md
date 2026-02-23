# Detection Process

## Summary
Defines how to scan repositories for architecture signals.

---

## Rule: Deterministic Signal Scan
**Rule ID:** rad-process  
**Priority:** MUST  
**Applies to:** react_architecture_detection  
**Rationale:** Ensures consistent detection across runs.

### Requirement

- Scan routing, UI, data access, and domain boundaries.
- Record the primary structure and gravity signals.
- Use deterministic defaults when multiple signals conflict.

### Forbidden

- Ignoring clear existing conventions.
- Introducing new conventions during detection.

### Notes

- If no clear signal exists, classify as flat/ad-hoc and state assumptions.
