# Output and Planning Discipline

## Summary
Defines required output structure for planning and implementation guidance.

---

## Rule: Output and Planning Discipline
**Rule ID:** sr-output-discipline  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline  
**Inherited from:** shared-rules  
**Rationale:** Keeps downstream planning and implementation outputs consistent,
compact, and reviewable.

### Requirement

- Planning outputs must include:
  - File touch plan (`Create`/`Update`/`Reuse` with paths).
  - Layer justification.
  - Reuse decision notes (`reuse as-is`, `updated`, `new`).
  - A short decision explanation that states detected architecture signals and
    chosen direction.
- Planning outputs must use a machine-readable JSON object with:
  - `output_mode` (`human|agent`)
  - `presentation.user_markdown` (prettified summary of the payload)
  - `notes[]` limited to 5 items
- `output_mode` defaulting must be deterministic:
  - resolve with strict precedence:
    1. explicit `output_mode` in request,
    2. explicit machine-readable/raw JSON request -> `agent`,
    3. human explicitly instructs a skill to run -> `human`,
    4. otherwise -> `agent`
  - if uncertain between `human` and `agent`, choose `human`
- The full JSON payload is always produced for both `output_mode` values.
- If `output_mode=human`, print/display only `presentation.user_markdown` to the human.
- If `output_mode=human`, do not print/display raw JSON, envelope fields, or any payload field other than `presentation.user_markdown`.
- If `output_mode=agent`, print/display the full JSON payload.
- Implementation output must:
  - Use changed snippets for updated files by default.
  - Use unified diff when edits are scattered across non-adjacent regions.
  - Use full content for new files.

### Forbidden

- Full existing-file dumps unless explicitly requested or file is small and
  fully changed.
- Unstructured narrative-only planning outputs.
- Omitting `presentation.user_markdown` from output payloads.
- Selecting `output_mode=agent` by habit/default when a human-invoked run does
  not explicitly request machine-readable output.
