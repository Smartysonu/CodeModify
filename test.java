# Project Instructions

This is an Angular UI application using the Proximus Lavandar design system.

The project already has:
- Angular application architecture
- UI implementation
- Lavandar integration
- Sonar configuration
- unit-test infrastructure
- environment configuration

Backend APIs are currently not available.

## Repository First

Always inspect existing repository code before making implementation decisions.

Use package.json and the actual source code as the source of truth for Angular version, dependencies and architecture.

Search for existing implementations before creating new components, services, models or utilities.

## Data Architecture

Maintain:

Component
→ Service
→ Data-access layer
→ Mock data or real API

Components must not know whether data comes from local mocks or backend APIs.

## Runtime Behaviour

When the application runs on localhost:
- use local mock data

When the application runs on a deployed environment:
- use that environment's configured API base URL
- use real backend APIs

Environment detection must be centralized.

Do not perform hostname checks throughout components or feature services.

Do not hardcode UAT, production or other environment URLs inside components.

## API Integration

When APIs become available:
- preserve the existing UI where possible
- use typed request/response contracts
- use the configured API base URL
- keep HttpClient/API logic outside components
- handle loading, error and empty states
- preserve localhost mock-data support

## Lavandar

Reuse existing Proximus Lavandar components and patterns before implementing custom equivalents.

Avoid unnecessary global CSS or design-system overrides.

## Quality

Follow existing:
- TypeScript conventions
- Angular architecture
- unit-test patterns
- Sonar requirements

Avoid:
- `any`
- duplicated code
- unused code
- unnecessary complexity
- unrelated refactoring
- hardcoded configuration

## Development Workflow

For non-trivial changes:

1. inspect relevant code
2. search for related implementations
3. trace dependencies
4. implement the smallest maintainable change
5. update relevant tests
6. run appropriate tests/build/lint checks
7. clearly report anything that could not be verified
