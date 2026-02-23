# Output and Planning Discipline

## Summary
Defines required output structure for planning and implementation guidance.

---

## Rule: Output and Planning Discipline
**Rule ID:** apv-output-discipline  
**Priority:** MUST  
**Applies to:** agent-policy-v1  
**Rationale:** Keeps downstream planning and implementation outputs consistent,
compact, and reviewable.

### Requirement

- Planning outputs must include:
  - File touch plan (`Create`/`Update`/`Reuse` with paths).
  - Layer justification.
  - Reuse decision notes (`reuse as-is`, `updated`, `new`).
  - A short decision explanation that states detected architecture signals and
    chosen direction.
- Planning outputs must use a machine-readable JSON object with `notes[]`
  limited to 5 items.
- Implementation output must:
  - Use changed snippets for updated files by default.
  - Use unified diff when edits are scattered across non-adjacent regions.
  - Use full content for new files.

### Forbidden

- Full existing-file dumps unless explicitly requested or file is small and
  fully changed.
- Unstructured narrative-only planning outputs.
