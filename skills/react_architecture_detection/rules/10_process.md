# Detection Process

## Summary
Defines how to scan repositories for architecture signals.

---

## Rule: Deterministic Signal Scan
**Rule ID:** rad-process  
**Priority:** MUST  
**Applies to:** react_architecture_detection  
**Rationale:** Ensures consistent detection across runs.

### Requirement

- Scan routing signals and route-entry points first.
- Scan UI-home signals next.
- Scan domain-organization signals next.
- Scan data-access-home signals next.
- Scan state-home signals next.
- Produce one gravity map after all concern scans complete.
- Select exactly one migration strategy after concern scans complete.
- Determine a clear home for each concern using explicit gravity heuristics.
- Compute alignment blockers and one recommended next migration step.
- Use deterministic defaults when multiple signals conflict.
- Apply pause mode thresholds for structural ambiguity:
  - `strict`: pause on structural ambiguity.
  - `balanced` (default): pause when decision-safety confidence is below `0.7`.
  - `autonomous`: pause when decision-safety confidence is below `0.5`.

### Detection sequence

1. **Routing scan**
   - Detect active routing style and route entry files/folders.
2. **UI scan**
   - Detect active UI home and shared-component structure.
3. **Domain scan**
   - Detect domain organization (`features`, `modules`, `routes`, `flat`, or `mixed`).
4. **Data-access scan**
   - Detect canonical backend-access home and access pattern.
5. **State scan**
   - Detect server-state/client-state ownership and home.
6. **Gravity synthesis**
   - Assign one authoritative home per concern for downstream reuse.
7. **Clear-home scoring**
   - Treat a concern home as clear when at least one is true:
     - About 70% or more related files are already there.
     - Most concern imports resolve there.
     - Recent active edits for that concern consistently use that location.
8. **Strategy selection**
   - Choose exactly one strategy:
     - `follow-existing`
     - `introduce-boundaries`
     - `migrate-as-you-touch`
   - Use explicit selection criteria:
     - `follow-existing` when local gravity is clear, migration churn would be
       high, or scope is small/urgent.
     - `introduce-boundaries` when the repository is flat/messy or partially
       structured and target structure can be introduced in isolated boundaries.
     - `migrate-as-you-touch` only when migration scope is explicit and
       touched-area moves create immediate clarity.
   - Provide rationale for why the selected strategy best fits observed
     repository gravity and task scope.
9. **Alignment synthesis**
   - Compute `alignment_score` (`0-100`) plus:
     - `alignment.blockers` (top issues reducing alignment)
     - `alignment.next_migration_step` (one concrete step)
10. **Bootstrap trigger handling**
   - Classify repository as bootstrap-triggered when:
     - Overall shape is `flat/ad-hoc`.
     - No clear homes exist for routing/UI/API/domain (all below `0.7` confidence).
   - In bootstrap-triggered cases, output notes must constrain bootstrap
     recommendations to the canonical set:
     - `pages/`
     - `features/`
     - `ui/primitives/`
     - `ui/composites/`
     - `api/client/`
     - `api/dto/`
     - `api/endpoints/`
     - `core/`
     - `lib/`
     - `hooks/`
     - `config/`
     - `store/` only when global client-state is truly required.
   - Apply minimal bootstrap discipline:
     - Recommend only folders needed for current task scope.
     - Do not recommend speculative, currently-unused bootstrap folders.
   - Enforce bootstrap exit condition:
     - Once a canonical concern home exists, do not recommend creating an
       alternative home for that concern unless explicit migration mode is enabled.
11. **Ambiguity and pause handling**
   - If any structural concern gravity confidence is `< 0.7`, set concern
     `home` to `unknown` and concern `status` to `ambiguous`.
   - Compute decision-safety confidence separately from concern gravity
     confidence.
   - Determine pause by mode when impact is structural:
     - `strict`: pause on structural ambiguity.
     - `balanced`: pause when `decision_safety_confidence < 0.7`.
     - `autonomous`: pause when `decision_safety_confidence < 0.5`.
   - If any structural concern gravity confidence is `< 0.7`, treat this as a
     structural low-confidence case and require `pause_required: true`.
   - For low-confidence non-structural decisions, apply deterministic defaults.
   - Emit a `pause_decision` payload with:
     - `pause_required: true`
     - `pause_mode`
     - `decision_safety_confidence`
     - `impact`
     - `trigger`
     - `options` (2-3 bounded choices)
     - `recommended_option`
   - When structural ambiguity pause is not required, still emit
     `pause_decision` with `pause_required: false`, `pause_mode`,
     `decision_safety_confidence`, and `impact`.

### Forbidden

- Ignoring clear existing conventions.
- Introducing new conventions during detection.
- Returning a partial concern scan without explicit uncertainty notes.
- Returning multiple strategies for the same task.
- Recommending strategies that create competing homes for one concern.
- Leaving low-confidence structural concerns unresolved without a pause
  decision.
- Emitting bootstrap recommendations outside the canonical bootstrap set.
- Recommending speculative bootstrap folders unrelated to current task scope.
- Recommending alternate concern homes after bootstrap exit unless explicit
  migration mode is enabled.

### Notes

- If no clear signal exists, classify as flat/ad-hoc and state assumptions.
- Concern evidence should reference concrete files or folders.
- Strategy selection must preserve one-home-per-concern output discipline.
- Decision-safety confidence threshold for structural pause behavior is fixed at
  `0.7`.
- Decision-safety confidence is separate from concern gravity confidence used
  for placement decisions.
- `api.home` must be emitted as the canonical endpoint layer for downstream
  boundary checks in the task.
