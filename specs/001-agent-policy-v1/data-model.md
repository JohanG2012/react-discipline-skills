# Data Model: Shared Agent Policy Baseline

## Overview

This feature is documentation-governance focused. The model describes policy objects and their relationships so downstream skill specs can be validated consistently.

## Entities

### 1. SharedPolicyBaseline

- **Description**: The authoritative shared governance baseline for downstream skill specs.
- **Fields**:
  - `baseline_id` (string, required): fixed identifier (`agent-policy-v1`)
  - `version` (string, required): semantic policy version label
  - `applies_to_skills` (array[string], required): list of downstream skill identifiers under coverage
  - `production_scope` (string, required): must indicate all covered skills are production
  - `document_precedence` (string, required): defines authoritative ordering of governing documents
  - `mandatory_rule_groups` (array[string], required): named rule categories enforced by baseline
  - `created_date` (date, required)
  - `updated_date` (date, required)
- **Validation rules**:
  - `baseline_id` MUST equal `agent-policy-v1`.
  - `applies_to_skills` MUST contain exactly four skill identifiers for this initiative.
  - `document_precedence` MUST designate master spec as authoritative source.

### 2. DownstreamSkillSpec

- **Description**: A skill-specific spec that inherits and applies the shared baseline.
- **Fields**:
  - `skill_id` (string, required)
  - `is_production` (boolean, required)
  - `baseline_reference` (string, required): points to `SharedPolicyBaseline.baseline_id`
  - `local_rules` (array[string], required)
  - `policy_conflicts` (array[string], optional): conflict references against baseline rules
- **Validation rules**:
  - `is_production` MUST be `true` for all four downstream skills in this initiative.
  - `baseline_reference` MUST be present and match the active baseline.
  - Local mandatory rules MUST NOT conflict unless a valid exception record exists.

### 3. PolicyExceptionRecord

- **Description**: Approved governance exception for a downstream conflict with shared baseline.
- **Fields**:
  - `exception_id` (string, required)
  - `requesting_skill_id` (string, required)
  - `conflicting_rule_ref` (string, required)
  - `rationale` (string, required)
  - `approved_by_role` (string, required): must be `repo_maintainer`
  - `status` (enum, required): `proposed | approved | rejected | active | revoked | superseded`
  - `decision_note` (string, required for non-proposed states)
  - `created_date` (date, required)
  - `updated_date` (date, required)
  - `superseded_by_version` (string, optional)
- **Validation rules**:
  - `approved_by_role` MUST be `repo_maintainer` for approved/active records.
  - Expiry metadata MUST NOT exist.
  - `status=active` MUST have prior approved decision trail.

### 4. PreApprovedCollisionRegistry

- **Description**: Registry field for categories that may be pre-approved for collision handling.
- **Fields**:
  - `field_name` (string, required): fixed as `pre_approved_collisions`
  - `location` (string, required): must be shared baseline header only
  - `categories` (array[string], required): empty by default for this version
- **Validation rules**:
  - Registry MUST exist only once in shared baseline header.
  - Downstream skill specs MUST NOT define their own registry.

### 5. PolicyVersionRecord

- **Description**: Version history entry for shared policy changes.
- **Fields**:
  - `version` (string, required)
  - `change_summary` (string, required)
  - `change_reason` (string, required)
  - `effective_date` (date, required)
  - `supersedes_version` (string, optional)
- **Validation rules**:
  - Any policy rule change MUST produce a new version record.
  - Version updates MUST include explicit reason and summary.

## Relationships

- `SharedPolicyBaseline (1) -> (many) DownstreamSkillSpec`
- `SharedPolicyBaseline (1) -> (many) PolicyExceptionRecord`
- `SharedPolicyBaseline (1) -> (1) PreApprovedCollisionRegistry`
- `SharedPolicyBaseline (1) -> (many) PolicyVersionRecord`
- `DownstreamSkillSpec (1) -> (many) PolicyExceptionRecord` (via `requesting_skill_id`)

## State Transitions

### PolicyExceptionRecord

- `proposed -> approved -> active`
- `proposed -> rejected`
- `active -> revoked`
- `active -> superseded` (when new policy version replaces exception need)

### PolicyVersionRecord

- `draft -> published -> superseded`

## Traceability to Requirements

- `FR-001`, `FR-002`, `FR-003`, `FR-004`: `SharedPolicyBaseline`
- `FR-010`, `FR-015`: `PolicyExceptionRecord`
- `FR-013`: `PreApprovedCollisionRegistry`
- `FR-009`: `PolicyVersionRecord`
- `FR-014`: `DownstreamSkillSpec` production coverage and baseline reference
