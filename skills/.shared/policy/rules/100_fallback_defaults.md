# Fallback Technology Defaults

## Summary
Defines shared fallback defaults used only when repository conventions are
missing or ambiguous.

---

## Rule: Fallback Technology Defaults
**Rule ID:** apv-fallback-defaults  
**Priority:** MUST  
**Applies to:** agent-policy-v1  
**Rationale:** Ensures deterministic cross-skill defaults while honoring
existing repository gravity first.

### Requirement

- Existing repository stack/conventions take precedence over fallback defaults.
- If no clear convention exists, defaults are:
  - Server-state: TanStack Query; keep transport in `api/endpoints/**`.
  - Client-state: local-first; global store only when truly global.
  - Routing: React Router for plain React; framework-native routing when
    framework is detected.
  - Styling: follow existing; Tailwind default only for greenfield.
  - Forms: react-hook-form.
  - Validation: Zod at boundaries (DTO/form), with domain schema ownership in
    feature domain layers.
  - HTTP client: native `fetch` via shared wrapper; normalized `ApiError`;
    conservative retry posture.
  - Build tool: Vite for greenfield plain React unless existing conventions say
    otherwise.
  - Date/localization: native `Date` and `Intl` unless domain needs justify
    more.
  - Identifier strategy: string IDs by default.

### Forbidden

- Introducing competing stack choices mid-repository without explicit request.
- Mirroring server-state into global store without explicit justification.
