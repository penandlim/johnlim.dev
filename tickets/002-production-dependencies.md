# Ticket 002: Upgrade vulnerable production dependencies

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `fix/upgrade-production-dependencies`
- Scope: remove the production dependency vulnerabilities reported by `npm audit` while preserving the existing React, Bootstrap, Three.js, and postprocessing behavior.

## Current problem

The committed dependency graph contains:

- `jquery <=3.4.1`, reported by npm as a moderate potential XSS vulnerability.
- `three <0.125.0`, reported by npm as a high-severity denial-of-service vulnerability.

The installed `postprocessing@6.7.0` peer range only supports Three.js versions below `0.109.0`, so upgrading Three.js alone creates an incompatible dependency tree.

## Proposed solution

Upgrade jQuery to the maintained 3.x line and move Three.js to the first compatible non-vulnerable 0.125 release line. Upgrade postprocessing to `6.21.5`, whose peer range supports Three.js `0.125.x`. Keep the Three.js range within `0.125.x` and pin postprocessing to the compatible release so a future semver resolution cannot silently reintroduce a peer conflict.

This ticket intentionally does not perform the broader Webpack/Node modernization; that work is isolated on `fix/build-modern-node`.

## Acceptance criteria

- `npm audit --omit=dev` reports zero production vulnerabilities.
- `npm ci` succeeds from the committed lockfile.
- The production build succeeds with the baseline Node compatibility flag required by the unmodified build branch.
- Home, Works, project navigation, and Contact continue to render without application runtime errors.
- The existing postprocessing effects and Three.js canvas remain functional.

## Implementation

- `jquery`: `^3.4.1` → `^3.7.1`
- `three`: `^0.108.0` → `^0.125.2`
- `postprocessing`: `^6.7.0` → exact `6.21.5`
- Regenerated the lockfile using lockfile version 1 to preserve the repository's existing package-manager format.

## Verification

```bash
npm ci
npm audit --omit=dev
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Browser smoke coverage: Home → Works → next project → Contact. Expected result: no application errors and one rendered Three.js canvas.
