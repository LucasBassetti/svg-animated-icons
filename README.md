# svg-animated-icons

347 hover-animated SVG icons for React, Vue, and Angular. Two ways to consume them — install a pre-compiled npm package, or copy a single framework-specific source file directly into your repo with the CLI (shadcn-style). Animations are pure CSS, triggered on `:hover`. No runtime dependency, no theme provider, nothing to wire up.

Browse and search every icon at the [docs site](https://github.com/LucasBassetti/svg-animated-icons), or peek at [`apps/docs/public/llms.txt`](apps/docs/public/llms.txt) for the agent-readable summary.

---

## Install

You can either install one of the per-framework packages and import components like any other library, or use the CLI to copy a single self-contained component file into your project.

### Option 1 — Install the framework package

Pre-compiled ESM packages. Consumer needs only the package itself plus the matching framework peer dep.

#### React (≥ 18)

```sh
npm install @svg-animated-icons/react
# or: pnpm add @svg-animated-icons/react
# or: yarn add @svg-animated-icons/react
# or: bun add @svg-animated-icons/react
```

```tsx
import { ArrowDownIcon } from "@svg-animated-icons/react";

export function Example() {
  return <ArrowDownIcon />;
}
```

Per-icon subpath imports for paranoid tree-shaking:

```tsx
import { ArrowDownIcon } from "@svg-animated-icons/react/arrow-down";
```

Props:

- `disableHover?: boolean` — skip the hover animation.
- `className?: string` — extra classes merged onto the root SVG.

#### Vue 3 (≥ 3.4)

```sh
npm install @svg-animated-icons/vue
# or: pnpm add @svg-animated-icons/vue
# or: yarn add @svg-animated-icons/vue
# or: bun add @svg-animated-icons/vue
```

```vue
<script setup lang="ts">
import { ArrowDownIcon } from "@svg-animated-icons/vue";
</script>

<template>
  <ArrowDownIcon />
  <ArrowDownIcon class="text-blue-500" />
  <ArrowDownIcon :disable-hover="true" />
</template>
```

Vue's class fallthrough merges any `class` you pass onto the root SVG. CSS is injected at runtime by the bundle — no separate import needed.

#### Angular (≥ 17, standalone components)

```sh
npm install @svg-animated-icons/angular
# or: pnpm add @svg-animated-icons/angular
# or: yarn add @svg-animated-icons/angular
# or: bun add @svg-animated-icons/angular
```

```ts
import { Component } from "@angular/core";
import { ArrowDownIcon } from "@svg-animated-icons/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ArrowDownIcon],
  template: `
    <ai-arrow-down />
    <ai-arrow-down [disableHover]="true" />
  `,
})
export class AppComponent {}
```

The package follows the Angular Package Format (FESM2022 + `.d.ts`); Angular CLI's build pipeline handles linking automatically. No extra configuration required.

### Option 2 — Copy components into your project with the CLI

If you prefer the shadcn-style "you own the file" model, use the CLI to write a framework-specific source file directly into your repo. No runtime dependency, no `node_modules` entry — just a TS/TSX/Vue file you can edit.

```sh
npx @svg-animated-icons/cli add arrow-down --react
npx @svg-animated-icons/cli add arrow-down --vue
npx @svg-animated-icons/cli add arrow-down --angular
```

The CLI fetches the icon from the hosted registry and writes the rendered component to `components/animated-icons/<name>.<ext>` (default). Useful flags:

| Flag | Default | Purpose |
| --- | --- | --- |
| `--react` / `--vue` / `--angular` | — | Pick a framework (required). |
| `--dest <dir>` | `components/animated-icons` | Where to write the file. |
| `--registry <url>` | hosted registry | Use a custom registry (e.g. self-hosted). |
| `--force` | off | Overwrite an existing file. |

#### Two-icon components

The CLI also generates components that combine a pair of icons:

```sh
# State-based swap (e.g. toggle between menu and close icons).
npx @svg-animated-icons/cli add swap menu cross --react
```

---

## How to choose

| | Package (`npm install`) | CLI (`npx ... add`) |
| --- | --- | --- |
| Update strategy | `npm update` bumps every icon | Re-run the CLI per icon |
| Bundle | Tree-shakable ESM, ~1–8 KB per icon imported | One file per icon you've added |
| Customizable | Limited to props | Full ownership — edit the SVG, CSS, or component freely |
| Best for | Apps that want versioned dependencies | Codebases that prefer copy-in / no extra runtime dep |

Both modes share the same icon SVG and CSS — the only difference is whether the component file lives in `node_modules` or in your repo.

---

## Repository layout

```
apps/
  docs/                       # Next.js — icon browser + hosts the registry
packages/
  cli/                        # @svg-animated-icons/cli (published)
  react/                      # @svg-animated-icons/react (published)
  vue/                        # @svg-animated-icons/vue (published)
  angular/                    # @svg-animated-icons/angular (published)
  codegen/                    # private — template engine shared by CLI + generator + docs
  icons/                      # icon source files + registry build + package generator
```

## Development

```sh
pnpm install                  # install everything
pnpm registry:build           # generate apps/docs/public/r/*.json from icon sources
pnpm generate:packages        # write per-framework sources into packages/{react,vue,angular}/src
pnpm dev                      # docs + watcher in parallel
pnpm build                    # full turbo build of every package
pnpm typecheck
pnpm lint
```

## Adding a new icon

1. Create `packages/icons/<name>/{icon.svg,styles.css,aliases.json}`.
2. Run `pnpm registry:build`.
3. The icon appears at `/icons/<name>` in the docs and is available via the CLI immediately. Run `pnpm generate:packages` to fold it into the three framework packages.

## Adding a new framework

1. Add `packages/codegen/templates/<framework>.tpl` (plus `-swap.tpl` if you want that variant).
2. Wire the framework into `packages/cli/src/commands/{add,add-swap}.ts` and the `--<framework>` flag in `packages/cli/src/index.ts`.
3. Optionally create a `packages/<framework>/` published package and add it to `packages/icons/generate-packages.ts`.

## Releasing

The four published packages (`cli`, `react`, `vue`, `angular`) are versioned with [changesets](https://github.com/changesets/changesets).

```sh
pnpm changeset                # describe the change
pnpm version                  # bump versions + write changelogs
pnpm release                  # build everything and publish
```

Private packages (`codegen`, `icons`, `docs`) are skipped automatically.
