# Ticket 008: Document repository setup and correct metadata

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `docs/repository-setup`
- Scope: make a fresh checkout's setup path explicit, document the optional Unity helper submodule, correct the license link, and provide a useful page description.

## Current problem

The README starts at package installation and does not explain that the repository contains a git submodule. A normal clone therefore leaves `johnlim.dev-Unity-Helper` uninitialized without an obvious recovery command. The README links to `LICENSE.md`, but the tracked license file is `LICENSE`. The generated page also has an empty meta description. Finally, the checked-in npm lockfile uses the obsolete v1 format and the pinned Browserslist database emits an outdated-data warning during builds.

## Proposed solution

Add clone and existing-checkout instructions for recursive submodules, identify the Unity helper as optional, and add development/build commands to the README. Correct the license link to the tracked filename. Replace the empty HTML description with concise page metadata describing the portfolio. Convert the lockfile to npm's current v3 format and refresh its caniuse-lite entry so clean builds do not emit the stale Browserslist warning.

This ticket documents the existing repository layout; it does not vendor or rewrite the Unity helper submodule.

## Acceptance criteria

- A fresh clone command includes recursive submodule initialization.
- An existing checkout has a documented `git submodule update --init --recursive` recovery command.
- The README's license link resolves to the tracked `LICENSE` file.
- The README documents local development and production build commands.
- `src/index.html` contains a non-empty descriptive meta description.
- The submodule remains an independent gitlink rather than copied source.
- `package-lock.json` uses lockfile version 3 and pins current Browserslist data.
- A clean build does not emit the outdated Browserslist database warning.

## Implementation

- Update `README.md` with setup, development, deployment, and submodule guidance.
- Update the license link to `LICENSE`.
- Add a concise `description` meta tag in `src/index.html`.
- Convert `package-lock.json` to lockfile v3 and refresh `caniuse-lite`.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
git submodule update --init --recursive
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build
```
Observed results:

- `npm ci` completed on the branch.
- `git submodule update --init --recursive` checked out the pinned Unity helper commit.
- `NODE_OPTIONS=--openssl-legacy-provider npm run build` completed successfully.
- The generated `dist/index.html` contains the new non-empty description.
- `package-lock.json` is lockfile version 3 with caniuse-lite `1.0.30001810`.
- The clean build emitted no outdated Browserslist warning.
