# Data Model: Root Changelog

## Overview

This feature models a repository-level changelog that records merged historical milestones with explicit distinction between major product milestones and context/supporting milestones.

## Entities

### 1. Changelog

- **Description**: Root-level documentation artifact that provides repository change history.
- **Fields**:
  - `path` (string, required, const): `<REPO_ROOT>/CHANGELOG.md`
  - `entries` (array[ChangelogEntry], required)
  - `notes` (array[string], optional)
- **Validation rules**:
  - File must exist at repository root.
  - Must include required pre-`007` milestone coverage from default-branch history.

### 2. ChangelogEntry

- **Description**: One historical change record in the changelog.
- **Fields**:
  - `entry_id` (string, required): stable identifier (for example, milestone number or slug)
  - `title` (string, required)
  - `classification` (enum, required): `major | context | supplemental_minor`
  - `summary` (string, required)
  - `source_type` (enum, required): `spec_milestone | merged_branch_history`
  - `source_ref` (string, required): reference to originating artifact/path
  - `pre_007` (boolean, required)
- **Validation rules**:
  - `classification=major` is required for the four production skill milestones.
  - `classification=context` is required for non-production/supporting pre-`007` milestones.
  - `supplemental_minor` entries are optional and cannot replace required pre-`007` milestone coverage.

### 3. MilestoneSourceRecord

- **Description**: Canonical source used to determine mandatory milestone coverage.
- **Fields**:
  - `milestone_id` (string, required)
  - `spec_path` (string, required): `<REPO_ROOT>/specs/[number]-*/`
  - `merged_in_default_branch` (boolean, required)
  - `product_scope` (enum, required): `production_skill | supporting_policy | extension`
- **Validation rules**:
  - Only records merged into default branch are eligible for mandatory changelog inclusion.
  - Milestone identifiers lower than `007` are in required-coverage scope.

### 4. CoverageAudit

- **Description**: Verification result for changelog completeness and factual accuracy.
- **Fields**:
  - `required_milestones_total` (integer, required)
  - `required_milestones_present` (integer, required)
  - `missing_required_milestones` (array[string], required)
  - `conflict_count` (integer, required)
  - `context_labeling_errors` (array[string], required)
- **Validation rules**:
  - `required_milestones_present` must equal `required_milestones_total` for acceptance.
  - `conflict_count` must be `0` for acceptance.
  - `context_labeling_errors` must be empty for acceptance.

## Relationships

- `Changelog (1) -> (many) ChangelogEntry`
- `MilestoneSourceRecord (many) -> (many) ChangelogEntry` via `source_ref`
- `CoverageAudit (1) -> (1) Changelog`

## State Transitions

### Entry Lifecycle

- `drafted -> reviewed -> accepted`
- `accepted -> revised` (if a factual conflict is discovered)
- `revised -> accepted` (after conflict resolution)

### Coverage Audit Lifecycle

- `not_run -> failed` (missing required milestones/conflicts found)
- `not_run -> passed` (all required milestones present, no conflicts)
- `failed -> passed` (after changelog corrections)

## Invariants

- Required pre-`007` milestones are sourced from merged default-branch `specs/[number]-*` records.
- The four production skills are represented as major entries.
- Non-production/supporting pre-`007` milestones are represented as context entries.
- No changelog claim conflicts with default-branch repository history.
- Changelog remains readable without enforcing a mandatory global ordering/grouping pattern.
