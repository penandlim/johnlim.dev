# Ticket 003: Bundle runtime dependencies locally

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `fix/bundle-runtime-dependencies`
- Scope: remove the production runtime dependency on unpkg for jQuery, React, and ReactDOM.

## Current problem

`webpack.config.js` enables `dynamic-cdn-webpack-plugin`. The production build therefore emits remote script tags for jQuery, React, and ReactDOM from `https://unpkg.com`, without Subresource Integrity attributes. The application cannot start when that CDN is unavailable, and a compromised or changed remote response would execute in the site origin.

The JavaScript entry point already imports these packages, but the generated bundle currently leaves them as external globals.

## Proposed solution

Remove the dynamic CDN plugin and its now-unused helper dependencies. Let Webpack bundle the declared npm dependencies into `bundle.js`, preserve the existing source imports, and assign the imported jQuery value to both `window.$` and `window.jQuery` for legacy code that expects the global alias. Keep the self-hosted Font Awesome and portfolio assets unchanged.

This is intentionally separate from dependency version upgrades; it removes the delivery risk without combining unrelated library migrations.

## Acceptance criteria

- Generated HTML contains no `unpkg.com`, `jsdelivr.net`, or other runtime CDN script tags for application dependencies.
- The bundle contains and initializes jQuery, React, and ReactDOM locally.
- `npm ci` succeeds from the committed lockfile.
- The production build succeeds with the baseline Node compatibility flag required by the unmodified build branch.
- The browser loads and navigates Home → Works → Contact without application errors.

- Remove `DynamicCdnWebpackPlugin` from `webpack.config.js`.
- Remove `dynamic-cdn-webpack-plugin` and `module-to-cdn` from development dependencies and the lockfile.
- Keep the existing package imports in `src/index.js` and set `window.jQuery = $` after the jQuery import.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Then inspect `dist/index.html` for remote script tags and run the local browser smoke flow.
