import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: !options.watch,
  shims: true,
  banner: { js: "#!/usr/bin/env node" },
  dts: false,
  noExternal: ["@svg-animated-icons/codegen"],
}));
