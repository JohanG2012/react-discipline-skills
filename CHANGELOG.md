# Changelog

This file records completed repository milestones merged into the default branch.

## Reading Guide

- `major`: production-skill milestone.
- `context`: supporting-policy or extension milestone included for historical completeness.

## Major Milestones

- **001-agent-policy-v1** (`context`, source: `<REPO_ROOT>/specs/001-agent-policy-v1/`)
  - What changed: Added the shared policy baseline for agent behavior and repository governance expectations.
  - Why it matters: Provides consistent foundational rules used by the production skills and associated tooling.

- **002-skill-react-architecture-detection** (`major`, source: `<REPO_ROOT>/specs/002-skill-react-architecture-detection/`)
  - What changed: Added the production skill specification for React architecture detection and its supporting contracts/validation artifacts.
  - Why it matters: Establishes a baseline skill that improves architecture-awareness decisions across React codebases.
- **003-skill-react-placement-layering** (`major`, source: `<REPO_ROOT>/specs/003-skill-react-placement-layering/`)
  - What changed: Added the production skill specification for placement and layering guidance in React projects.
  - Why it matters: Improves consistency of file/module placement decisions and reduces layering drift.
- **004-skill-react-reuse-update-new** (`major`, source: `<REPO_ROOT>/specs/004-skill-react-reuse-update-new/`)
  - What changed: Added the production skill specification for reuse-vs-update-vs-create decisions.
  - Why it matters: Helps contributors choose lower-risk change paths and avoid unnecessary duplication.
- **005-skill-react-implementation-discipline** (`major`, source: `<REPO_ROOT>/specs/005-skill-react-implementation-discipline/`)
  - What changed: Added the production skill specification for implementation discipline and delivery controls.
  - Why it matters: Improves execution reliability and alignment with repository governance standards.

- **006-skill-react-refactoring-progression** (`context`, source: `<REPO_ROOT>/specs/006-skill-react-refactoring-progression/`)
  - What changed: Added an optional extension-skill specification for refactoring progression planning and output contracts.
  - Why it matters: Preserves historical progression context while remaining outside the fixed four-skill production scope.
