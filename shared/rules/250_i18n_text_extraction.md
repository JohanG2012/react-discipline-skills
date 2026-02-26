# i18n Text Extraction

## Summary
Defines required extraction behavior for user-facing UI text when a canonical
i18n folder already exists in the repository.

---

## Rule: i18n Extraction for User-Facing UI Text
**Rule ID:** sr-i18n-text-extraction  
**Priority:** MUST  
**Applies to:** react-placement-and-layering, react-reuse-update-new, react-implementation-discipline, react-refactoring-progression  
**Inherited from:** shared-rules  
**Rationale:** Prevents hardcoded copy drift and keeps user-facing text
maintainable, localizable, and consistent.

### Requirement

- Trigger this rule when both are true:
  - a canonical i18n home exists (for example `i18n/**`, `src/i18n/**`, or
    gravity-equivalent localization home),
  - user-facing UI text literals are found in touched presentation files (for
    example `pages/**`, `features/*/sections/**`, `ui/**`).
- Extract user-facing UI text from touched files into the existing i18n home
  and reference it by translation key.
- Apply extraction to modified/new UI copy in scope; do not perform unrelated
  repository-wide localization sweeps unless explicitly requested.
- Preserve behavior and message meaning during extraction:
  - keep interpolation/variables equivalent,
  - keep state-conditional copy equivalent,
  - keep accessibility text (labels for user-facing controls) in i18n when
    localization is supported by existing repo patterns.
- Keep canonical ownership singular:
  - reuse existing i18n structure and conventions,
  - do not create a second localization home.
- Allow inline literals only when non-user-facing (for example internal debug
  logs, test-only labels/selectors, class names, protocol constants, or other
  machine-facing strings).

### Forbidden

- Leaving new or modified user-facing UI text literals inline in touched
  components when an i18n home exists.
- Introducing a second localization folder/pattern when a canonical one already
  exists.
- Mixing key-based and hardcoded user-facing variants of the same message in
  the same flow without explicit product requirement.

### Notes

- This rule governs extraction when localization infrastructure already exists;
  it does not mandate introducing i18n infrastructure into repositories that do
  not already have it.
