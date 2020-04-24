import { Arguments, Argv } from "yargs";
import { getMinecraftPath } from "../util";
import { DatapackManager } from "..";

type Options = Arguments<{
  pack: string;
  world: string;
  root: string;
}>;

export const command = ["uninstall <pack> <world>", "u"];

export const desc = "Uninstall a datapack";

export function builder(yargs: Argv) {
  return yargs.options({
    root: {
      desc: "Path of the minecraft folder",
      alias: "r",
      normalize: true,
      default: getMinecraftPath()
    }
  }) as Argv<Options>;
}

export async function handler({ pack, root, world }: Options) {
  const manager = new DatapackManager();
  manager.root = root;
  try {
    await manager.uninstall(pack, world);
  } catch (e) {
    console.error(e?.message ?? e);
  }
}
