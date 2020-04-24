import { SearchResult, getMinecraftPath } from "../util";
import { Arguments, Argv } from "yargs";
import { DatapackManager } from "..";

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
  const results = await manager.list();

  const locations = new Map<string, SearchResult[]>();
  results.forEach(result => {
    locations.set(result.world || "", [
      ...(locations.get(result.world || "") || []),
      result
    ]);
  });

  const cached = locations.get("");
  if (cached && cached.length) {
    console.log("Available:");
    for (let result of cached) {
      printDatapack(result, { desc });
    }
  }
  console.log("Installed:");
  for (let [world, results] of locations.entries()) {
    if (world === "") continue;
    console.log(` * ${world}`);
    for (let result of results) {
      printDatapack(result, { desc, indent: 2 });
    }
  }
}
