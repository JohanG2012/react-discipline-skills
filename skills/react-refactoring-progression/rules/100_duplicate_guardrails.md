# Semantic Duplicate Guardrails

## Summary

Defines anti-over-abstraction constraints for duplication recommendations.

---

## Rule: Existing Home Alignment
**Rule ID:** rrp-dup-home-alignment  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents introducing a second architecture home by accident.

### Requirement

- Recommendations must align with existing concern homes in the repository.
- If UI concern homes are already established (for example `src/components`),
  prefer that existing home unless migration scope is explicitly declared.

### Forbidden

- Recommending a new parallel home for the same concern without migration scope.

---

## Rule: Slots Over Prop Matrix
**Rule ID:** rrp-dup-slots-over-props  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Avoids prop explosion and domain flags in shared UI composites.

### Requirement

- Shared UI composite recommendations should express variation with
  slots/children/render composition.
- If recommendation needs more than 2 behavioral toggles or domain mode flags,
  reject shared composite extraction.

### Forbidden

- Proposing shared composite extraction that needs domain mode flags.
- Proposing composite APIs with large boolean/variant prop matrices.

---

## Rule: One-Level-Up Preference
**Rule ID:** rrp-dup-one-level-up  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Keeps abstraction scope proportional to the duplication source.

### Requirement

- Within-feature duplication should be extracted one level up first
  (feature section or feature hook).
- Cross-feature extraction into shared UI is recommended only when cross-domain
  reuse is demonstrated and leakage risk is low.

### Forbidden

- Jumping directly to global shared extraction for local duplication.

---

## Rule: Keep-Separate by Default Under High Risk
**Rule ID:** rrp-dup-keep-separate  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Treats intentional duplication as valid when abstraction is
unsafe.

### Requirement

- If abstraction cost is high, leakage risk is high, or divergence risk is high,
  default recommendation must be `keep_separate` (or feature-local extraction).
- Include explicit rationale when `keep_separate` is selected.

### Forbidden

- Forcing unification when risk profile indicates separation is safer.

---

## Rule: Locality Preference
**Rule ID:** rrp-dup-locality  
**Priority:** SHOULD  
**Applies to:** react-refactoring-progression  
**Rationale:** Respects established repository sharing culture.

### Requirement

- If repository conventions favor feature-local sections, prefer local
  extraction unless a strong cross-feature reuse case exists.

### Forbidden

- Introducing cross-feature sharing strategy without strong evidence.

---

## Rule: Cognitive Load Guard
**Rule ID:** rrp-dup-cognitive-load  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** DRY does not justify harder-to-understand APIs.

### Requirement

- Reject recommendations that increase indirection or hide meaningful domain
  differences.
- Reject recommendations that require config-DSL style APIs to represent basic
  variations.

### Forbidden

- Recommending mega-config abstractions as default duplicate handling.

---

## Rule: Refactor Radius Bound
**Rule ID:** rrp-dup-refactor-radius  
**Priority:** MUST  
**Applies to:** react-refactoring-progression  
**Rationale:** Prevents high-churn suggestions in bounded planning modes.

### Requirement

- Every duplication cluster must classify refactor radius as `local`, `medium`,
  or `large`.
- `large` radius recommendations must be marked as follow-up scope unless
  explicit expansion is already approved.

### Forbidden

- Presenting large-radius extraction as immediate in-cap opportunistic work.

---

## Rule: Micro Extraction Before Mega Extraction
**Rule ID:** rrp-dup-micro-before-mega  
**Priority:** SHOULD  
**Applies to:** react-refactoring-progression  
**Rationale:** Improves safety by extracting high-leverage subparts first.

### Requirement

- For complex duplicated components, prefer extracting repeated subparts
  (boundary/layout/helper) before recommending full component unification.

### Forbidden

- Recommending full merge-first abstraction when a smaller extraction addresses
  most duplication safely.
