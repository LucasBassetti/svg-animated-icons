import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: !options.watch,
  dts: true,
  loader: { ".tpl": "text" },
}));
