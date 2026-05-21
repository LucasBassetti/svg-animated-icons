# @svg-animated-icons/react

Animated SVG icon React components.

## Install

```bash
npm install @svg-animated-icons/react
```

## Usage

```tsx
import { ArrowDownIcon } from "@svg-animated-icons/react";

export function Example() {
  return <ArrowDownIcon />;
}
```

Each component animates on hover by default. Pass `disableHover` to opt out:

```tsx
<ArrowDownIcon disableHover />
```

Pass a `className` to extend styles:

```tsx
<ArrowDownIcon className="text-blue-500" />
```

## Tree-shaking

Per-icon entry points let bundlers strip everything you don't import:

```tsx
import { ArrowDownIcon } from "@svg-animated-icons/react/arrow-down";
```
