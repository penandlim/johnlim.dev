# Ticket 007: Add automated content and syntax checks

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `chore/add-quality-checks`
- Scope: provide repeatable `npm test` and `npm run lint` commands for the repository's existing portfolio content and JavaScript/JSX syntax.

## Current problem

`package.json` exposes no test or lint command. Changes can break the `works.json` data contract, reference missing local preview media, or introduce parse errors without a fast repository-owned check.

## Proposed solution

Add a small deterministic Node test for the portfolio data contract. It validates the top-level works array, required entry fields, supported preview types, valid external URLs, and the existence of local preview assets. Add ESLint with the Babel parser so the existing JavaScript and JSX files are parsed by a standard lint command; enable syntax/control-flow rules that do not require a broad legacy style migration.

This deliberately avoids introducing a test framework or changing application behavior. It establishes checks that are useful immediately while keeping the old webpack/Babel application code's style out of scope.

## Acceptance criteria

- `npm test` validates the checked-in portfolio data and local assets.
- The test fails for malformed work entries, invalid URLs, duplicate titles, or missing local previews.
- `npm run lint` parses the JavaScript/JSX entrypoints and fails on unreachable code or constant conditions.
- Tooling runs from a clean `npm ci` install.
- No runtime bundle behavior changes.

## Implementation

- Add `test/portfolio-content.test.js` using Node's built-in assertion module.
- Add ESLint and `@babel/eslint-parser` development dependencies plus a repository config.
- Add `test` and `lint` scripts to `package.json`.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
npm ci
npm test
npm run lint
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Observed results:

- `npm install --save-dev @babel/eslint-parser@^7.25.9 eslint@^8.57.1 --lockfile-version=1` completed.
- `npm test` passed and validated four portfolio entries and their preview assets.
- `npm run lint` passed for `src/index.js`, `src/App.jsx`, and `webpack.config.js`.
- `NODE_OPTIONS=--openssl-legacy-provider npm run build` completed successfully.
