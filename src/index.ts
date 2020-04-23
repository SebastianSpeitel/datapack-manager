import World from "./world";
import { Datapack } from "@throw-out-error/minecraft-datapack";
import { searchDatapacks } from "./util";

export class DatapackManager {
  declare root: string;

  constructor() {
    this.root = "";
  }

  async install(
    pack: Datapack | string,
    world: World | string,
    opts?: Parameters<World["install"]>[1]
  ) {
    if (typeof world === "string") {
      world = new World(world);
    }

    return world.install(pack, opts);
  }

  async uninstall(name: string, world: World | string): Promise<void>;
  /**@param {string} path absolute path of the datapack */
  async uninstall(path: string, world: World | string): Promise<void>;
  async uninstall(nameOrPath: string, world: World | string): Promise<void> {
    if (typeof world === "string") {
      world = new World(world);
    }

    return world.uninstall(nameOrPath);
  }

  async list(): ReturnType<typeof searchDatapacks> {
    return searchDatapacks();
  }
}
