import { Command } from "commander";
import { addSwapCommand } from "./commands/add-swap.js";
import { addCommand } from "./commands/add.js";

const program = new Command();

program
  .name("svg-animated-icons")
  .description("Copy animated SVG icon components into your project — shadcn-style.")
  .version("0.0.1");

const add = program
  .command("add")
  .description("Add an icon component to your project")
  .argument(
    "<icon>",
    "Icon name (e.g. accessibility, arrow-left) — or 'swap' for a two-icon component",
  )
  .argument("[partner]", "When using 'swap', the first icon name")
  .argument("[partner2]", "When using 'swap', the second icon name")
  .option("--react", "Generate a React component")
  .option("--vue", "Generate a Vue 3 component")
  .option("--angular", "Generate an Angular standalone component")
  .option("--dest <dir>", "Destination directory (default: components/animated-icons)")
  .option("--registry <url>", "Override the registry base URL")
  .option("--force", "Overwrite existing files")
  .action(async (icon: string, partner: string | undefined, partner2: string | undefined, opts) => {
    if (icon === "swap") {
      if (!partner || !partner2) {
        console.error("Usage: add swap <fromIcon> <toIcon> [--react]");
        process.exit(1);
      }
      await addSwapCommand({ from: partner, to: partner2, ...opts });
      return;
    }
    await addCommand({ icon, ...opts });
  });

add.exitOverride();

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
});
