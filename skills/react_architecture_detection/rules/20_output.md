# Output Contract

## Summary
Defines the expected output structure for architecture detection.

---

## Rule: Structured Output
**Rule ID:** rad-output  
**Priority:** MUST  
**Applies to:** react_architecture_detection  
**Rationale:** Ensures downstream skills can consume outputs reliably.

### Requirement

- Output must include repository classification and gravity summary.
- Output must list key detected paths and conventions.
- Output must include any assumptions or uncertainties in notes.

### Forbidden

- Omitting core classification fields.
- Returning unstructured prose instead of structured output.

### Notes

- Keep notes concise and limited to high-impact uncertainties.
