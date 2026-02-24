# Output Mode Selection

## Summary

Defines deterministic selection between snippet/diff updates and full-file output.

---

## Rule: Output Mode Selection
**Rule ID:** rid-output-mode-selection  
**Priority:** MUST  
**Applies to:** react-implementation-discipline  
**Rationale:** Keep implementation output reviewable while minimizing misapply risk.

### Requirement

- For existing files, default to changed snippets or unified diffs.
- If `diff_preference` is provided, treat it as the initial mode bias:
  - `snippet_first` -> prefer snippets when safe.
  - `unified_diff` -> prefer unified diffs.
- Automatically prefer unified diff when:
  - edits are non-adjacent in one file
  - imports/exports and logic are changed together
  - snippet-only output risks incorrect application
- For new files, provide full file content.
- Do not return unrelated full files.
- If an existing file is very small and fully changed, full-file output is
  allowed.
- If a newly created file would exceed about 250 lines, prefer splitting
  responsibilities before finalizing output.

### Forbidden

- Returning entire existing files by default.
- Mixing unrelated file content into one output package.

### Notes

- Favor the smallest clear output that preserves apply correctness.
