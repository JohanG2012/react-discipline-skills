# Reuse Decision Process

## Summary
Defines how to evaluate reuse, update, or new creation.

---

## Rule: Decision Ladder
**Rule ID:** rru-process  
**Priority:** MUST  
**Applies to:** react_reuse_update_new  
**Rationale:** Keeps decisions consistent and bounded.

### Requirement

- Search for existing implementations before proposing new ones.
- Evaluate complexity, coupling, and divergence risks.
- Document why reuse or update was accepted or rejected.

### Forbidden

- Skipping discovery of existing code.
- Creating new modules without justification.

### Notes

- Favor reuse when behavior matches without extra mode flags.
