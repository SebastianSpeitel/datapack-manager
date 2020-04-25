import { getMinecraftPath } from "../util";
import { Arguments, Argv } from "yargs";
import { DatapackManager, SearchResult } from "..";
import Table, { Cell } from "cli-table3";

function formatResult(
  result: SearchResult,
  { desc = true }: { desc?: boolean } = {}
): Cell[] {
  return [result.name, desc && result.datapack.description, result.path].filter(
    Boolean
  );
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

  const head = desc
    ? ["World", "Name", "Description", "Location"]
    : ["World", "Name", "Location"];

  const table = new Table({
    head,
    wordWrap: true
  });

  if (cached.length) {
    const rows: Cell[][] = cached.map(r => formatResult(r, { desc }));
    rows[0].unshift({ content: "global", rowSpan: cached.length });
    table.push(...rows);
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

    for (let [world, results] of worlds) {
      const rows: Cell[][] = results.map(r => formatResult(r, { desc }));
      rows[0].unshift({ content: world, rowSpan: results.length });
      table.push(...rows);
    }
  }

  console.log(table.toString());
}
