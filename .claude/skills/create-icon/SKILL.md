---
name: create-icon
description: Use when adding new animated icons to the svg-animated-icons project, when porting icons from the svg-icons/ source directory, or when refining existing icon animations. Covers file structure, the 700ms duration rule, the no-scale/no-pure-opacity rule, how to derive meaningful animations from the icon's meaning, the build/registry workflow, and common pitfalls (path fidelity, transform-origin, viewBox clipping). Also use when the user asks "add N more icons", "animate this icon", "fix this icon's animation", or pastes/refers to a Radix source.
---

# Creating animated icons

You are working on `packages/icons/` — a registry of animated SVG icons hand-ported from the Radix icon set in `svg-icons/`. Each icon is a directory with two files. The build script auto-discovers everything; you do not need to touch any registry index.

## File structure (per icon)

```
packages/icons/<name>/
  icon.svg     # the SVG with named-part classes for animation targeting
  styles.css   # the CSS animation
```

The icon `name` is the same as the source `svg-icons/<name>.svg`. Build script: `pnpm registry:build` from `packages/icons`. Output lands in `apps/docs/public/r/<name>.json` (one JSON per icon plus an index).

No `meta.json` exists — `displayName` auto-derives from the directory name and `viewBox` auto-extracts from the SVG.

## The two non-negotiable rules

### 1. Initial state must match the original Radix file exactly

Read `svg-icons/<name>.svg` and use its `<path d="...">` data **verbatim**. Do not redraw or simplify the geometry by hand — your approximations will not match.

- Filled paths stay filled (`fill="currentColor"`).
- If the Radix path is a single complex shape, copy it as one `<path>`.
- If you need to animate parts independently, split the path at its existing subpath boundaries (`M ... Z M ...`). Each subpath in Radix starts with `M` and ends with `Z` — keep them whole when splitting.
- The user has rejected hand-drawn approximations multiple times. Always start from the Radix `<path d>`.

### 2. All animations are 700ms

Every `animation: name <duration> easing` declaration uses `700ms`. No exceptions. No `infinite`. No staggered children that push total time past ~1100ms.

Recommended easings:
- `ease-in-out` for symmetric "go and return" motions (the default — most icons).
- `ease-out` for one-shot reveals (stroke-dashoffset draw-ins).
- `linear` only for full rotations where constant speed reads better.

## Step 0: Understand WHAT the icon is before designing the animation

**Before you write a single CSS keyframe, identify what the icon depicts as a real-world object or concept.** This is not optional — generic motions ("rotate", "bounce") applied without understanding produce bad animations the user will reject.

Ask yourself:
1. **What is this icon a picture of?** (a magic wand, a moon with stars, a slider knob on a track, a hammer, a locked padlock…) Be specific. "An icon with a star" is not enough — "a magic wand whose tip casts sparks" tells you the wand should move and the sparks should react to it.
2. **What is the most characteristic motion of that object?** (A magic wand WAVES. A moon doesn't move — the stars around it twinkle. A slider knob slides along its track — the track does not move. A door swings on a hinge.) Match the animation to the object's real behavior.
3. **If there are multiple parts, what is their relationship?** (Wand and sparkles: the wand drives motion, sparkles react in sequence. Lock body and shackle: the body is fixed, the shackle hinges. Slider track and knob: the track is fixed, the knob moves.) Static parts must stay static — animating the wrong piece kills the metaphor.
4. **If multiple parts move, do they move in sync that makes physical sense?** Don't reuse the same keyframes for every part. A magic wand's sparkles should twinkle in cascade (one after another), not all pulse together. Bar chart bars rise one at a time. Dots in a row bounce sequentially. Whatever the motion, give each part its own role and timing.

Only after answering these should you pick a CSS pattern. If the table below doesn't fit, the answers above tell you what to build.

## Animation must be meaningful

The motion should communicate what the icon represents. Reach for the metaphor first, then find the CSS transform.

| Icon family | Meaningful motion |
|---|---|
| Arrows (`arrow-*`, `caret-*`, `chevron-*`) | Double-bounce in the pointing direction (translate ~1.5px, keyframes at 0/25/50/75/100%) |
| Check / checkbox | `stroke-dashoffset` draw of the checkmark (the path is stroked) |
| Clock, countdown, timer | Hand sweeps via `rotate()` from view-box center |
| Borders (sides) | Solid edge "draws in" via `stroke-dashoffset` from the correct end |
| Bar chart / data | Bars change height via `scaleY` with `transform-origin: bottom` — this is one of the rare valid scale uses (the metaphor IS size change) |
| Database / cylinder | Top half slides down to merge with bottom half |
| Cross, plus | Rotate 90° (becomes the other symbol) |
| Lock, bell | Rotate small angle (swing/jiggle) from a pivot |
| Dots in a row | Sequential bounce with `animation-delay` |
| Pill / button | Inner content moves; outer frame stays still |
| Component instance/boolean (diamond) | Horizontal 3D-flip via `scaleX(1 → 0 → -1 → 0 → 1)` |
| Crumpled paper, discord | Whole shape rocks ±6–8° around its center |

If the icon has multiple parts, isolate the part the metaphor lives in:
- Frame stays static, contents move (`enter`, `dropdown-menu`, `download`)
- Outer shell stays, inner spins (`counter-clockwise-clock` inner hands)
- Lid moves, body stays (`clipboard`)

## What NOT to do

**No scale-only animations.** Scaling a 2D icon flat to 0 looks like paper flipping, not a 3D rotation. Use scale only when:
- The metaphor genuinely IS size change (bar chart heights, single-dot heartbeat pulse where there's nothing else to animate).
- Or as part of a 3D flip sequence (`scaleX 1 → 0 → -1 → 0 → 1` for diamond flips).

**No opacity-only animations.** A static fade pulse is lazy — find the part that should move. Opacity is fine as one piece of a richer animation (e.g., phantom dots in conveyors, sequential pulse on dotted borders).

**No animation that distorts the rest state.** When the cursor leaves, the icon must look identical to the original Radix file. Don't rely on `animation-fill-mode: forwards`.

**No `infinite`.** All animations play once per hover and stop.

## Animation patterns (CSS recipes)

### Double-bounce translate (arrows, chevrons)
```css
.ai-<name>-icon .arrow { transform-origin: center; }
.ai-<name>-icon:not(.no-hover):hover .arrow { animation: ai-<name>-motion 700ms ease-in-out; }
@keyframes ai-<name>-motion {
  0%, 50%, 100% { transform: translateX(0); }
  25%, 75% { transform: translateX(1.5px); }
}
```

### Stroke-dashoffset draw-in
```css
.ai-<name>-icon .check {
  stroke-dasharray: 13;       /* approximate path length */
  stroke-dashoffset: 13;       /* hidden at rest */
}
.ai-<name>-icon:not(.no-hover):hover .check {
  animation: ai-<name>-draw 700ms ease-out forwards;
}
.ai-<name>-icon:not(:hover) .check { stroke-dashoffset: 0; }  /* visible when not hovered */
@keyframes ai-<name>-draw {
  from { stroke-dashoffset: 13; }
  to { stroke-dashoffset: 0; }
}
```

### Erase-and-redraw (line redraws itself)
```css
@keyframes redraw {
  0% { stroke-dashoffset: 0; }
  50% { stroke-dashoffset: -L; }     /* erases left-to-right */
  100% { stroke-dashoffset: -2L; }    /* redraws left-to-right via next dash period */
}
```

### Full rotation
```css
.ai-<name>-icon .target {
  transform-box: view-box;
  transform-origin: 7.5px 7.5px;     /* always icon center for full-icon spins */
}
.ai-<name>-icon:not(.no-hover):hover .target {
  animation: ai-<name>-spin 700ms ease-in-out;
}
@keyframes ai-<name>-spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
```

### Horizontal 3D flip (component-boolean / -instance style)
```css
@keyframes flip {
  0%   { transform: scaleX(1); }
  25%  { transform: scaleX(0); }
  50%  { transform: scaleX(-1); }
  75%  { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
```

## Base CSS template (every styles.css starts with this)

```css
.ai-<name>-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  cursor: pointer;
  overflow: visible;
}

.ai-<name>-icon * {
  transform-box: fill-box;
}

.ai-<name>-icon.no-hover * {
  transform: none;
  opacity: 1;
  animation: none;
}

/* part-specific transform-origin + hover animation goes here */
```

The `.no-hover` modifier disables the animation entirely — this is how the CLI bakes a static variant.

## transform-origin: the pivot trap

For most icons `transform-origin: center` (combined with `transform-box: fill-box`) is right — it pivots from the bounding box center of the animated element.

**Switch to `transform-box: view-box; transform-origin: 7.5px 7.5px;` when:**
- Rotating around the icon's geometric center (clock hands, full-icon spin, diamond flip)
- The rotation pivot is a specific viewport coordinate, not the element's own bbox

For corner/edge pivots use percentage origins (`center top`, `left center`, etc.) with the default `fill-box`.

## Workflow for a new icon

1. **Read the source**: `cat svg-icons/<name>.svg` — note the geometry, identify which logical parts exist.
2. **Choose the meaning**: what does this icon represent? What part of it would meaningfully move?
3. **Decide what to split** (if anything): keep one `<path>` for whole-icon motions; split into 2+ for "part moves, frame stays" motions. Split at existing subpath boundaries to preserve the original.
4. **Write `icon.svg`** with `class="..."` attributes added to the targetable elements. Geometry must be byte-identical to the Radix path.
5. **Write `styles.css`** using the base template plus the appropriate pattern above.
6. **Rebuild**: `cd packages/icons && pnpm registry:build`. Confirm the entry count increased and the JSON for your icon contains the expected classes.
7. **Spot-check in the docs app**: hover the icon, confirm rest state matches the original, animation reads as the intended metaphor.

## Common pitfalls (each one has bitten us)

- **Hand-drawn approximations**: the user will reject these. Use the Radix `d` verbatim.
- **Stroke-dashoffset on a filled path**: does nothing. The path must be `stroke="currentColor" fill="none"` (or have a stroke).
- **Path length mismatch**: if dashoffset doesn't draw correctly, the path's actual length doesn't equal what you wrote in `stroke-dasharray`. Measure with `getTotalLength()` mentally or pad generously.
- **Wrong pivot**: rotating a part using `transform-origin: center` (the part's own center) instead of the icon center (`view-box` + `7.5px 7.5px`) — the part wobbles instead of orbiting.
- **`overflow: hidden` losing intentional out-of-bounds rendering**: the host has `overflow: visible` by default. Override only when you specifically need to clip phantom elements (e.g., conveyor belts).
- **Path subpath bugs in Radix**: occasionally the upstream path has a typo (e.g., `double-arrow-up` had `L7.14669 8.14645Z` that should be `L7.14669 2.14645Z`). If a fill looks wrong, trace the path manually before assuming the SVG is correct.
- **Forgetting to rebuild**: edits to `icon.svg`/`styles.css` aren't picked up by the docs app until `pnpm registry:build` runs (or until the icons-package `dev` watch script rebuilds it).

## Bulk operations

When adding many icons at once, write a Node script that emits both files per icon and run it once, then `pnpm registry:build`. Don't hand-write 50+ files via individual edits — it's slow and error-prone. See prior batch scripts under `/tmp/build-batch*.mjs` for examples.

Cap a single batch at ~25 icons. Beyond that, design quality degrades and review becomes impractical.
