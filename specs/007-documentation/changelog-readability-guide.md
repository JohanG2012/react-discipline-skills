# Changelog Readability Guide

## Objective

Help contributors find milestone changes quickly without scanning raw commit history.

## Conventions

1. Use one entry per milestone ID with a clear label (`major` or `context`).
2. Keep milestone IDs in ascending order within each section.
3. For each entry, include exactly two explanatory bullets:
   - `What changed`
   - `Why it matters`
4. Include a source reference path for each milestone entry.
5. Keep sentence length concise and avoid repository-internal jargon where possible.
6. Keep section headers stable (`Major Milestones`, `Context Milestones`, `Supplemental Minor Entries`) so readers can scan predictably.

## Findability Rules

- A reader should identify the four production milestones in one pass through `Major Milestones`.
- Context milestones must be visibly labeled so they are not mistaken for production scope.
- Optional supplemental entries must remain clearly optional and not block milestone discovery.
