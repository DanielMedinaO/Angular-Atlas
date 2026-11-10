
# Angular Atlas — Development Guidelines

## Project
Angular Atlas is an evergreen, interactive
Angular knowledge base.

## Architecture
- Use Angular standalone components.
- Prefer the modern Angular APIs.
- Organize code by features.
- Use Angular Router for navigation.
- Keep components small and reusable.
- Use Signals for local reactive state.
- Use RxJS when reactive streams are appropriate.
- Follow strict TypeScript practices.

## Documentation
Each learning topic must include:
1. Conceptual documentation.
2. Executable Angular demonstrations.
3. Examples of source code.
4. Practical exercises.
5. Unit tests where appropriate.

## Quality
- Use Angular built-in features where possible.
- Keep the application compatible with zoneless.
- Use Vitest for unit testing.
- Avoid deprecated APIs in new code.
- Explain architectural decisions.
- Do not add dependencies without justification.
- Preserve existing working functionality.

## Collaboration
Before implementing a requested feature:
- Inspect the existing architecture.
- Explain the proposed changes.
- Implement the smallest useful solution.
- Include tests.
- Explain the Angular concepts being applied.
