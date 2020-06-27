import { Arguments, Argv } from "yargs";
import { DatapackManager, SearchResult } from "..";
import Table, { Cell, TableConstructorOptions } from "cli-table3";

function formatResult(
  result: SearchResult,
  opts: { desc?: boolean; path?: boolean; dereference?: boolean } = {}
): Cell[] {
  let path = result.path;
  if (result.symlink && opts.dereference) {
    path = result.symlink;
  }

  return [
    result.name,
    opts.desc && result.datapack.description,
    opts.path && path
  ].filter(Boolean);
}

type Options = Arguments<{
  description: boolean;
  border: boolean;
  location: boolean;
  dereference: boolean;
}>;

export const command = ["list", "l", "ls"];

export const desc = "List local datapacks";

export function builder(yargs: Argv) {
  return yargs.options({
    description: {
      desc: "Print descriptions",
      alias: "d",
      default: true,
      type: "boolean"
    },
    border: {
      type: "boolean",
      alias: "b",
      desc: "Prints borders around the table",
      default: true
    },
    location: {
      type: "boolean",
      desc: "Print locations",
      default: true
    },
    dereference: {
      type: "boolean",
      alias: "L",
      desc: "Dereference symlinks",
      default: false
    }
  }) as Argv<Options>;
}

const borderlessConfig: TableConstructorOptions = {
  chars: {
    top: "",
    "top-mid": "",
    "top-left": "",
    "top-right": "",
    bottom: "",
    "bottom-mid": "",
    "bottom-left": "",
    "bottom-right": "",
    left: "",
    "left-mid": "",
    mid: "",
    "mid-mid": "",
    right: "",
    "right-mid": "",
    middle: " "
  },
  style: {
    "padding-left": 0,
    "padding-right": 0,
    compact: true
  }
};

export async function handler({
  description,
  border,
  location,
  dereference
}: Options) {
  const manager = new DatapackManager();
  const results = await manager.search({ installed: true, global: true });

  console.log(results);

  const global = results.filter(r => r.global);
  const installed = results.filter(r => r.world) as Array<
    SearchResult & {
      world: string;
    }
  >;

  let head = ["World", "Name"];
  if (description) head.push("Description");
  if (location) head.push("Location");

  const tableConfig: TableConstructorOptions = {
    head,
    wordWrap: true
  };

  if (!border) {
    Object.assign(tableConfig, borderlessConfig);
  }

  const table = new Table(tableConfig);

  if (global.length) {
    const rows: Cell[][] = global.map(r =>
      formatResult(r, { desc: description, path: location, dereference })
    );
    rows[0].unshift({ content: "global", rowSpan: global.length });
    table.push(...rows);
  }

  if (installed.length) {
    const worlds = new Map<string, SearchResult[]>();
    installed.forEach(result => {
      const results = worlds.get(result.world) || [];
      results.push(result);
      worlds.set(result.world, results);
    });

    for (let [world, results] of worlds) {
      const rows: Cell[][] = results.map(r =>
        formatResult(r, { desc: description, path: location, dereference })
      );
      rows[0].unshift({ content: world, rowSpan: results.length });
      table.push(...rows);
    }
  }

  console.log(table.toString());
}
