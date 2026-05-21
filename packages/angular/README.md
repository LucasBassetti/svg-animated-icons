# @svg-animated-icons/angular

Animated SVG icon Angular standalone components.

## Install

```bash
npm install @svg-animated-icons/angular
```

## Usage

```ts
import { Component } from "@angular/core";
import { ArrowDownIcon } from "@svg-animated-icons/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ArrowDownIcon],
  template: `<ai-arrow-down />`,
})
export class AppComponent {}
```

Each component animates on hover by default. Pass `disableHover` to opt out:

```html
<ai-arrow-down [disableHover]="true" />
```
