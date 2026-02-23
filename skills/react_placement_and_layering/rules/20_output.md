# Output Contract

## Summary
Defines the expected output structure for placement decisions.

---

## Rule: Structured Placement Output
**Rule ID:** rpl-output  
**Priority:** MUST  
**Applies to:** react_placement_and_layering  
**Rationale:** Ensures decisions are traceable and actionable.

### Requirement

- Output must list planned file touches with paths.
- Output must include layer justification notes.
- Output must mark reuse/update/new decisions.

### Forbidden

- Vague placement guidance without concrete paths.
- Omitting justification for layer selection.

### Notes

- Keep notes concise and tied to the request.
