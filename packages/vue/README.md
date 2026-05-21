# @svg-animated-icons/vue

Animated SVG icon Vue 3 components.

## Install

```bash
npm install @svg-animated-icons/vue
```

## Usage

```vue
<script setup lang="ts">
import { ArrowDownIcon } from "@svg-animated-icons/vue";
</script>

<template>
  <ArrowDownIcon />
</template>
```

Each component animates on hover by default. Pass `disable-hover` to opt out:

```vue
<ArrowDownIcon disable-hover />
```

Vue's class fallthrough merges any `class` you pass onto the root SVG:

```vue
<ArrowDownIcon class="text-blue-500" />
```
