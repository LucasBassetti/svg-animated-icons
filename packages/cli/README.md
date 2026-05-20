# @svg-animated-icons/cli

Copy animated SVG icon components into your project — shadcn-style.

## Usage

```sh
npx @svg-animated-icons/cli add accessibility --react
npx @svg-animated-icons/cli add arrow-left --react
```

### Options

- `--react` — generate React (default). `--vue` and `--svelte` reserved for later.
- `--dest <dir>` — destination directory (default: `components/svg-icons`)
- `--lib-dest <dir>` — where to write helper libs like the morph engine (default: `lib/svg-icons`)
- `--registry <url>` — override the registry base URL (env var: `SVG_ICONS_REGISTRY`)
- `--force` — overwrite existing files
