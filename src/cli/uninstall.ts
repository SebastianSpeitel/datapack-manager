import { Arguments, Argv } from "yargs";
import { DatapackManager } from "..";

type Options = Arguments<{
  pack: string;
  world: string;
}>;

export const command = ["uninstall <pack> <world>", "u"];

export const desc = "Uninstall a datapack";

export function builder(yargs: Argv) {
  return yargs as Argv<Options>;
}

export async function handler({ pack, world }: Options) {
  const manager = new DatapackManager();
  try {
    await manager.uninstall(pack, world);
  } catch (e) {
    console.error(e?.message ?? e);
  }
}
