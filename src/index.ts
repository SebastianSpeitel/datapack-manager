import World from "./world";
import { Datapack } from "@throw-out-error/minecraft-datapack";
import { searchDatapacks } from "./util";
import config from "./config";
import pth from "path";

type InstallOptions = Parameters<World["install"]>[1];

export class DatapackManager {
  declare root: string;

  constructor() {
    this.root = "";
  }

  async install(
    name: string,
    world: World | string,
    opts?: InstallOptions
  ): Promise<void>;
  /**@param {string} path absolute path of the datapack */
  async install(
    path: string,
    world: World | string,
    opts?: InstallOptions
  ): Promise<void>;
  async install(
    datapack: Datapack,
    world: World | string,
    opts?: InstallOptions
  ): Promise<void>;
  async install(
    nameOrPathOrPack: Datapack | string,
    world: World | string,
    opts?: InstallOptions
  ) {
    if (typeof world === "string") {
      world = World.fromPath(world);
    }

    let pack: string | Datapack = nameOrPathOrPack;
    if (typeof nameOrPathOrPack === "string") {
      pack = pth.resolve(config.cache, nameOrPathOrPack);
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
