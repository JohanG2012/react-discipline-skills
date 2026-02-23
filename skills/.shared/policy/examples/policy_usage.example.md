# Policy Usage Example

```json
{
  "skill": "agent-policy-v1",
  "version": "1.0.0",
  "notes": ["Scope within requested feature", "Maintainer-approved exception"],
  "output": {
    "compliance": "pass",
    "violations": [],
    "exceptions": [
      {
        "exception_id": "apv-ex-001",
        "requesting_skill_id": "react_implementation_discipline",
        "conflicting_rule_ref": "apv-constraints",
        "rationale": "Temporary migration edge case with explicit governance sign-off.",
        "approved_by_role": "repo_maintainer",
        "status": "active",
        "decision_note": "Valid until revoked or superseded by policy version update."
      }
    ],
    "policy_version_records": [
      {
        "version": "v1",
        "change_summary": "Established shared governance baseline.",
        "change_reason": "Unify policy controls across four production execution skills.",
        "effective_date": "2026-02-23"
      }
    ],
    "pre_approved_collisions": []
  }
}
```
