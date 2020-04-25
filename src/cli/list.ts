import { getMinecraftPath } from "../util";
import { Arguments, Argv } from "yargs";
import { DatapackManager, SearchResult } from "..";

function printDatapack(
  result: SearchResult,
  { indent = 0, desc }: { indent?: number | string; desc: boolean }
) {
  if (typeof indent === "number") {
    indent = " ".repeat(indent);
  }
  console.log(`${indent} * ${result.name} (${result.path})`);
  if (desc) {
    console.log(`${indent}   ${result.datapack.description}`);
  }
}

type Options = Arguments<{
  root: string;
  desc: boolean;
}>;

export const command = ["list", "l"];

export const desc = "List local datapacks";

export function builder(yargs: Argv) {
  return yargs.options({
    root: {
      desc: "Path of the minecraft folder",
      alias: "r",
      normalize: true,
      default: getMinecraftPath()
    },
    desc: {
      desc: "Print descriptions",
      alias: "d",
      default: true
    }
  }) as Argv<Options>;
}

export async function handler({ root, desc }: Options) {
  const manager = new DatapackManager();
  manager.root = root;
  const results = await manager.search({ installed: true, cached: true });

  const cached = results.filter(r => r.cached);

  if (cached.length) {
    console.log("Cached:");
    for (let result of cached) {
      printDatapack(result, { desc });
    }
  }

  const installed = results.filter(r => r.world) as Array<
    SearchResult & {
      world: string;
    }
  >;

  if (installed.length) {
    const worlds = new Map<string, SearchResult[]>();
    installed.forEach(result => {
      const results = worlds.get(result.world) || [];
      results.push(result);
      worlds.set(result.world, results);
    });
    console.log("Installed:");
    for (let [world, results] of worlds) {
      console.log(` * ${world}`);
      for (let result of results) {
        printDatapack(result, { desc, indent: 2 });
      }
    }
  }

  if (!installed.length && !cached.length) {
    console.log("No local datapacks found.");
  }
}
