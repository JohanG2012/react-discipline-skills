---
description: "Rule-aware clarify wrapper: consult installed skill rules and inject high-impact clarification questions before planning."
---

## User Input

```text
$ARGUMENTS
```

You are running a rule-aware clarify flow. Do not use this command for
implementation. This command only clarifies the active spec.

### Goal

Run clarification on the active feature specification while consulting installed
react-discipline skill rules, then inject additional high-impact clarification
questions derived from those rules.

### Required Behavior

1. Determine active spec paths by running:
   - `.specify/scripts/bash/check-prerequisites.sh --json --paths-only`
2. Load and analyze:
   - active `spec.md`
   - available planning docs if present
   - installed rule sources from one of:
     - project-local `.agents/skills/react-*/AGENTS.md`
     - user-level `$HOME/.agents/skills/react-*/AGENTS.md`
     - fallback: repository local `shared/rules/*.md` and `skills/**/rules/*.md`
3. Build a candidate clarification queue from rule-triggered gaps:
   - include only questions that materially affect architecture, boundaries,
     validation expectations, operational safety, or acceptance criteria
   - maximum 4 rule-injected questions
4. Ask questions one-at-a-time:
   - each question must provide `A`/`B`/`C` options (optional `D` when needed)
   - include one recommended option with short rationale
   - accept `yes`/`recommended` as recommendation acceptance
5. Persist accepted answers directly into the active `spec.md` in a
   `## Clarifications` section (session dated subheading)
6. Maintain consistency:
   - remove obsolete contradictory statements
   - keep updates minimal and testable
7. Stop when:
   - all critical rule-triggered ambiguities are resolved, or
   - user says `done`/`stop`, or
   - 4 injected questions are asked

### Output

- Report:
  - number of injected questions asked/answered
  - updated spec path
  - rule IDs that triggered injected questions
  - deferred items (if any) and why
- Recommend next command:
  - `/speckit.plan` when clarification quality is sufficient
  - or rerun this command if critical items remain
