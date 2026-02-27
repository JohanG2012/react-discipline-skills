# Rules Bridge Extension

Adds `speckit.rules-bridge.clarify`, a wrapper clarify flow that:

1. Loads the active feature spec.
2. Consults installed react-discipline skill rules.
3. Injects high-impact clarification questions when the spec is ambiguous
   against those rules.
4. Updates the spec with accepted answers.

This extension does not patch core `/speckit.clarify`; it provides an explicit,
opt-in command for rule-aware clarification.
