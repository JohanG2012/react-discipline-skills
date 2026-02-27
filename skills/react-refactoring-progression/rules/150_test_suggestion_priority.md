# Test Suggestion Priority

## Summary

Keeps refactor planning focused on implementation improvements while treating
test-only work as secondary fallback scope.

---

## Rule: Implementation-First Test Suggestion Priority
**Rule ID:** rrp-test-suggestion-priority  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents plans from drifting into test-only cleanup when higher
impact implementation improvements are still available.
**Covers:** Implementation-First Test Suggestion Priority.
**Index mode:** reference

### Requirement

- Refactor planning must prioritize implementation-focused improvements first.
- Test updates should be suggested when they are required by selected
  implementation-focused steps (for example preserving behavior coverage after
  rename/extraction/split).
- Test-only improvements may be proposed only when no meaningful
  implementation-focused improvements remain in active scope.
- When test-only fallback is used, include a concise rationale in plan notes
  indicating implementation-focused options were exhausted for current scope.

### Forbidden

- Prioritizing test-only improvements over available implementation-focused
  improvements.
- Expanding scope to test-only cleanup while unresolved implementation
  improvements still exist.
