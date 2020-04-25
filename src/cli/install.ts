import { Arguments, Argv } from "yargs";
import { InstallMode } from "../world";
import { DatapackManager } from "..";

type Options = Arguments<{
  pack: string;
  world: string;
  mode: InstallMode;
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
    }
  }) as Argv<Options>;
}

export async function handler({ mode, pack, world }: Options) {
  const manager = new DatapackManager();
  try {
    await manager.install(pack, world, { mode });
  } catch (e) {
    console.error(e?.message ?? e);
  }
}
