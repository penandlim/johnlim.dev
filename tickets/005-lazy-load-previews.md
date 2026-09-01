# Ticket 005: Reduce initial media payload

## Status

Ready for manual review. Local branch only; not pushed.

- Branch: `perf/lazy-load-previews`
- Scope: prevent hidden portfolio previews from loading and playing during the initial Home view.

## Current problem

`App` renders every portfolio item at startup. Both video previews are declared with `autoPlay loop muted`, so hidden work cards can start media work before the user opens Works. The initial page also creates the YouTube iframe and image preview immediately. The production output contains an approximately 813 KiB JavaScript bundle plus two videos of roughly 5 MiB each.

On mobile, videos also lack `playsInline`, which can trigger unwanted fullscreen behavior or prevent the intended inline preview experience.

## Proposed solution

Render video elements with `preload="none"`, `muted`, `loop`, and `playsInline`, and explicitly start only the selected preview when entering Works or changing the selected work. Pause the previous preview when changing items and pause all previews when leaving Works. Add native lazy loading and asynchronous decoding to non-video previews.

The visual card transitions remain unchanged; this ticket only changes when media work begins.

## Acceptance criteria

- Initial Home load does not request either MP4 preview.
- Entering Works starts only the selected video's playback.
- Moving between works pauses the old video and starts the new selected video.
- Leaving Works pauses preview playback.
- Video previews remain inline-capable on mobile.
- YouTube and image previews use native lazy-loading hints.
- Existing navigation and visual transitions continue to work.

## Implementation

- Update `PreviewVideo`, `PreviewYoutube`, and `PreviewImg` media attributes in `src/App.jsx`.
- Add a small preview playback helper in `src/index.js` and call it at Works entry, list movement, and Works exit.
- Keep the ticket and implementation together on this branch for isolated review.

## Verification

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Use browser resource timing to confirm no MP4 request on Home, then enter Works and confirm the selected preview is the only video started.

Browser verification completed against the built site:

- Home loaded with zero MP4 resource entries;
- both videos reported `preload="none"`, `autoplay=false`, `playsInline=true`, and `paused=true`;
- entering Works played only the first selected video;
- advancing to the second work paused the first and played the second;
- returning Home paused both videos;
- iframe and image loading attributes were `lazy`.
