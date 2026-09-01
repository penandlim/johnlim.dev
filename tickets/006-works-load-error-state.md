# Ticket 006: Add a visible works-data failure state

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `fix/works-load-error-state`
- Scope: make failures loading `works.json` visible and recoverable instead of leaving the startup spinner indefinitely.

## Current problem

The startup fetch calls `response.json()` without checking `response.ok`. Any network failure, HTTP error, invalid JSON, or malformed payload is sent only to `console.error`. The spinner remains visible and the application body remains hidden, leaving visitors with no explanation or recovery action.

## Proposed solution

Centralize portfolio loading in a retryable `loadWorks` function. Check the HTTP status and validate that the payload contains an array of works before rendering. Add an accessible alert with a retry button outside the hidden application body. On failure, stop the spinner and reveal the alert; on retry, hide the alert and restart the loading state.

The existing successful render and Three.js initialization path remains unchanged.

## Acceptance criteria

- Non-2xx responses produce a visible, accessible error state.
- Invalid JSON and malformed payloads produce the same error state.
- The startup spinner stops after failure.
- Retry requests `works.json` again and can recover to the normal site.
- Successful loading still renders every work and initializes the existing UI.
- No unhandled promise rejection is produced.

## Implementation

- Add `#loadError` and `#retryLoad` to `src/index.html`.
- Add focused error-state styling in `src/css/index.css`.
- Replace the one-shot fetch chain in `src/index.js` with status/payload validation, rendering, and retry handling.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Browser verification should abort the first `works.json` request, confirm the alert and stopped spinner, then allow retry and confirm normal recovery.

Observed results:

- `npm ci` completed on the branch.
- `NODE_OPTIONS=--openssl-legacy-provider npm run build` completed successfully.
- With the first `works.json` request aborted, `#loadError` was visible (`display: block`) and `#spinner` was hidden.
- Clicking `Try again` recovered to four rendered work cards and one canvas.
- An `unhandledrejection` listener recorded no events during the failed request.
- A simulated HTTP 503 response also revealed the error state (`#spinner` display `none`) and recovered to four cards after retry.
