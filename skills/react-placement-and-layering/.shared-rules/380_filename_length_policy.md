# File Name Length Policy

## Summary
Defines deterministic file-name length limits to preserve readability,
discoverability, and tooling ergonomics.

---

## Rule: File Name Length Discipline
**Rule ID:** sr-filename-length  
**Priority:** MUST  
**Applies to:** react-architecture-detection, react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Long file names reduce grepability, readability, and review
velocity, and often signal mixed responsibilities.
**Covers:** File Name Length Discipline.
**Index mode:** reference

### Requirement

- File naming must stay concise and searchable:
  - keep semantic base name length at `<= 64` characters (excluding extension),
  - prefer concise descriptive names and established local terminology,
  - keep file name and primary export aligned when applicable.
- Suffix handling:
  - known suffixes such as `.test`, `.spec`, `.stories`, `.dto`, and
    framework-required route names do not justify oversized semantic base names.
- When a candidate name exceeds limit:
  - split responsibility rather than encoding multiple concerns in one name,
  - shorten vocabulary using established local terms (no ad hoc abbreviations),
  - keep role suffixes clear (`Page`, `Section`, `Row`, `Badge`, `use*`, etc.).
- Deterministic default:
  - if uncertain, choose the shortest name that remains unambiguous in the
    local feature/layer context.

### Forbidden

- Introducing new files with semantic base names longer than 64 characters.
- Using file names that concatenate multiple responsibilities to avoid
  extraction/splitting.
- Renaming purely for style if the current name is within limit and clear.
