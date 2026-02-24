# Contract: Shared Policy Governance Interface

## Purpose

Define the normative interface between the shared policy baseline (`agent-policy-v1`) and downstream skill specifications.

## Contract Scope

- Producer: shared policy baseline documentation for this initiative
- Consumers: all four downstream production skill specs
- Contract type: internal governance contract (documentation interface)

## Baseline Reference Compliance Matrix

| Skill | Required Baseline Reference | Required Status |
|-------|-----------------------------|-----------------|
| `react-architecture-detection` | `agent-policy-v1` | Mandatory |
| `react-placement-and-layering` | `agent-policy-v1` | Mandatory |
| `react-reuse-update-new` | `agent-policy-v1` | Mandatory |
| `react-implementation-discipline` | `agent-policy-v1` | Mandatory |

## Required Interface Rules

1. **Baseline Reference Contract**
   - Each downstream skill spec MUST reference `agent-policy-v1` as its shared baseline.
   - Missing baseline reference is a contract violation.

2. **Baseline Coverage and Precedence Contract**
   - Shared baseline coverage MUST include all four downstream production skills:
     - `react-architecture-detection`
     - `react-placement-and-layering`
     - `react-reuse-update-new`
     - `react-implementation-discipline`
   - `specs/001-agent-policy-v1/master_spec.md` remains authoritative for shared policy conflicts.
   - No other spec document may override `specs/001-agent-policy-v1/master_spec.md`.
   - Production execution skill scope remains fixed to those four skills;
     `agent-policy-v1` remains shared baseline policy and is not counted as a
     production execution skill.

3. **Conflict Handling Contract**
   - Downstream specs MUST NOT define conflicting mandatory rules unless an exception record exists.
   - Exception records MUST include:
     - `requesting_skill_id`
     - `conflicting_rule_ref`
     - `rationale`
     - `approved_by_role=repo_maintainer`
   - Exception records MUST NOT include expiry metadata.

4. **Collision Registry Contract**
   - The `pre_approved_collisions` field MUST exist only in the shared baseline header.
   - In this version, `pre_approved_collisions` MUST be present and empty.
   - Downstream specs MUST NOT define local collision registries.

5. **Versioning Contract**
   - Any shared policy rule change MUST create a new policy version entry with explicit rationale.

6. **Shared Rule Coverage Contract**
   - Shared baseline rule modules MUST explicitly cover:
     - Architecture/dependency boundaries.
     - Ownership and naming conventions.
     - Deterministic defaults and pause protocol.
     - Output/planning discipline.
     - Planning and reuse workflow.
     - Migration and placement strategy.
     - Fallback technology defaults.
     - Implementation defaults.
     - Layer contracts and error ownership.
     - Access/write control behavior.
     - File-size responsibility guidance.
     - Architecture-detection output/bootstrap contract.
     - Enforcement heuristics.
     - Scope-governor hard defaults and expansion path.
     - Completion and quality baseline checks.
   - The shared baseline MUST expose the corresponding rule IDs in
     `skills/.shared/policy/SKILL.md` quick-reference rules.

## Exception Validation Checks

- `approved_by_role` MUST equal `repo_maintainer` for approved or active exceptions.
- Exception records MUST include rationale and conflicting-rule reference.
- Exception records MUST NOT include expiry metadata.
- Exceptions remain active until explicitly revoked or superseded by shared policy version change.
- Shared rule IDs listed in `SKILL.md` MUST resolve to concrete rules in
  `skills/.shared/policy/rules/` files.

## Compliance Verification

A downstream skill spec is compliant when all checks pass:

- Baseline reference exists and matches `agent-policy-v1`.
- Baseline coverage includes all four downstream production skills.
- No unapproved expansion beyond the four-skill production execution scope.
- Document precedence is explicitly defined (`specs/001-agent-policy-v1/master_spec.md` first).
- No unapproved mandatory-rule conflicts.
- Any exception is maintainer-approved and rationale-backed.
- No exception expiry field present.
- No downstream-local `pre_approved_collisions` field.
- Shared policy version update exists for any baseline rule changes.
- Shared rule coverage exists for architecture, defaults/pause, scope caps,
  output discipline, planning/reuse workflow, migration strategy, fallback and
  implementation defaults, layer contracts, access/write control, file-size
  guidance, architecture-detection contract, enforcement heuristics,
  naming/ownership, and completion checks.
- Rule IDs in `skills/.shared/policy/SKILL.md` map to existing rule definitions.

## Failure Modes

- Missing baseline reference -> reject spec for planning.
- Conflicting rule without valid exception -> reject spec for planning.
- Exception approved by non-maintainer role -> reject exception.
- Exception includes expiry metadata -> reject exception.
- Duplicate collision registry sources -> reject downstream spec update.
- Policy rule change without version increment -> reject policy update.
- Missing shared-rule module for required baseline category -> reject baseline update.
- Rule ID listed in shared baseline skill without matching rule definition ->
  reject baseline update.
