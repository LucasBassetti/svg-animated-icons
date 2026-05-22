# @svg-animated-icons/cli

Copy animated SVG icon components into your project — shadcn-style.

## Usage

```sh
npx @svg-animated-icons/cli add accessibility --react
npx @svg-animated-icons/cli add arrow-left --react
```

### Options

- `--react`, `--vue`, `--angular` — pick a framework (one is required)
- `--dest <dir>` — destination directory (default: `components/animated-icons`)
- `--lib-dest <dir>` — where to write helper libs like the morph engine (default: `lib/animated-icons`)
- `--registry <url>` — override the registry base URL (env var: `SVG_ICONS_REGISTRY`)
- `--force` — overwrite existing files
