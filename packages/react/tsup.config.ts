import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/icons/*.tsx"],
  format: ["esm"],
  target: "es2022",
  bundle: false,
  clean: true,
  dts: true,
  external: ["react"],
});
