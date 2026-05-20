# svg-animated-icons

Animated SVG icons you copy into your project — shadcn-style. No runtime dependency: a CLI fetches an icon's source from a hosted registry and writes a framework-specific component file directly into your repo.

```sh
npx @svg-animated-icons/cli add accessibility --react
npx @svg-animated-icons/cli add arrow-left --react
```

## Repository layout

```
apps/
  docs/                         # Next.js — showcase + hosts the registry
packages/
  cli/                          # @svg-animated-icons/cli (only published package)
  icons/                        # icon source files + build script
```

## Development

```sh
pnpm install                    # install everything
pnpm registry:build             # generate apps/docs/public/r/*.json
pnpm dev                        # run docs and watch icon sources to rebuild the registry
pnpm build                      # build everything
pnpm typecheck
pnpm lint
```

## Adding a new icon

1. Create `packages/icons/<name>/{icon.svg,styles.css,meta.json}`
2. Run `pnpm registry:build`
3. The new icon appears at `/icons/<name>` in docs and is available via the CLI

## Adding a new framework

Add a template under `packages/cli/templates/<framework>.tpl` and wire its flag in `src/commands/add.ts`.
