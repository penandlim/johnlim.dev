# Ticket 004: Add accessible DOM interaction fallbacks

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `fix/accessible-dom-fallbacks`
- Scope: make portfolio links and previews usable with keyboard navigation, assistive technology, and without relying on WebGL hit testing.

## Current problem

The Contact view presents social destinations as Three.js meshes inside a canvas. The canvas has no semantic link targets, so keyboard users and screen readers cannot discover or activate GitHub, LinkedIn, Facebook, or Twitter. The old HTML footer links are commented out.

Project links rendered by React are icon-only anchors without accessible names. External anchors use `target="_blank"` without `rel="noopener noreferrer"`. The YouTube iframe has no title, and preview image text is generic.

## Proposed solution

Restore a semantic footer navigation with visible text links for the social profiles. Keep the WebGL icons as a visual enhancement, but treat the canvas as decorative. Add accessible labels to icon-only project links, safe external-link attributes, meaningful image alt text, and a descriptive iframe title derived from the work title.

The fallback remains in the DOM regardless of WebGL availability and does not depend on canvas raycasting.

## Acceptance criteria

- All social destinations are keyboard reachable as normal anchors.
- Screen readers receive meaningful names for social and project links.
- External links opened in a new tab include `rel="noopener noreferrer"`.
- The YouTube iframe has a non-empty descriptive title.
- Preview images have work-specific alt text.
- Canvas content is marked decorative so it does not duplicate the semantic links.
- Existing visual navigation and project rendering continue to work.

## Implementation

- Replace the commented footer links in `src/index.html` with a semantic social navigation.
- Mark `#threejs` as `aria-hidden`.
- Update `src/App.jsx` to add labels, safe `rel`, iframe titles, and meaningful image alt text.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Browser smoke coverage should include tab navigation, Home → Works → Contact, and inspection of anchor labels/iframe title in the accessibility tree.

Browser verification completed against the built site:

- all four social anchors were keyboard-focusable;
- every social/project link had a meaningful name and `noopener noreferrer`;
- the YouTube iframe and image had non-empty descriptive text;
- the canvas was marked `aria-hidden`;
- Home → Works → Contact → Home handlers completed without application errors.

Visual keyboard traversal and screen-reader confirmation remain part of the manual review.
