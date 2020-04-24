import { Arguments, Argv } from "yargs";
import { InstallMode } from "../world";
import { getMinecraftPath } from "../util";
import { DatapackManager } from "..";

type Options = Arguments<{
  pack: string;
  world: string;
  mode: InstallMode;
  root: string;
}>;

export const command = ["install <pack> <world>", "i"];

export const desc = "Install a datapack";

export function builder(yargs: Argv) {
  return yargs.options({
    mode: {
      desc: "Install mode",
      alias: "m",
      choices: ["symlink", "copy", "compile", "move"] as InstallMode[],
      default: "symlink" as InstallMode
    },
    root: {
      desc: "Path of the minecraft folder",
      alias: "r",
      normalize: true,
      default: getMinecraftPath()
    }
  }) as Argv<Options>;
}

export async function handler({ mode, pack, root, world }: Options) {
  const manager = new DatapackManager();
  manager.root = root;
  try {
    await manager.install(pack, world, { mode });
  } catch (e) {
    console.error(e?.message ?? e);
  }
}
