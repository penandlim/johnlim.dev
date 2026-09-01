# Ticket 001: Modern Node build compatibility

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `fix/build-modern-node`
- Scope: make the existing Webpack build run on current Node releases without the OpenSSL legacy-provider workaround.

## Current problem

The repository uses Webpack `4.40.2`. Its default module/chunk hashing uses MD4, which is disabled by modern Node/OpenSSL releases. On Node `v22.14.0`, the documented command fails:

```text
npm run build
Error: error:0308010C:digital envelope routines::unsupported
```

The current workaround is to set `NODE_OPTIONS=--openssl-legacy-provider`. That weakens the runtime configuration and is not a maintainable deployment contract. The project also has no declared Node/npm compatibility range.

## Proposed solution

Configure Webpack 4 to use `sha256` for generated build hashes, disable the Webpack 4 module-concatenation path that hard-codes MD4, and use the existing Terser generation with its cache disabled so its own MD4 cache key is not created. Add an `engines` declaration to document the supported Node/npm floor. Do not rely on `--openssl-legacy-provider` for the normal build.

The change deliberately avoids a broad Webpack upgrade in this ticket; the old plugin set requires a separate migration and regression pass.

## Acceptance criteria

- `npm run build` succeeds on the current Node runtime without `NODE_OPTIONS`.
- Generated assets remain deterministic for the same source and lockfile.
- The build output still contains the HTML entry point, JavaScript bundle, CSS, media, fonts, and portfolio data.
- Supported Node/npm versions are explicit in `package.json`.
- No source behavior changes outside build configuration and metadata.

- Set `output.hashFunction` to `sha256` in `webpack.config.js`.
- Disable `optimization.concatenateModules`, which otherwise calls MD4 directly in Webpack 4.
- Configure `terser-webpack-plugin` with `cache: false` and declare it as a direct development dependency.
- Add a conservative `engines` range that covers the verified runtime.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
npm ci
npm run build
```

Expected result: successful production compilation without `NODE_OPTIONS`.
