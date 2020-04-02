import { promises as fs, Dir } from "fs";
import pth from "path";
import World from "./world";
import { Datapack } from "@throw-out-error/minecraft-datapack";

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

  async uninstall(pack: Datapack | string, world: World | string) {
    if (typeof world === "string") {
      world = new World(world);
    }

    return world.uninstall(pack);
  }

  async list() {
    const packs: Datapack[] = [];
    const worldsPath = pth.join(this.root, "saves");
    let worldsDir: Dir;
    try {
      worldsDir = await fs.opendir(worldsPath);
    } catch (e) {
      console.error(e?.message ?? e);
      return;
    }

    for await (let { name } of worldsDir) {
      const world = World.fromPath(pth.join(worldsPath, name));
      const worldPacks = await world.getDatapacks();
      packs.push(...worldPacks);
    }

    return packs;
  }
}
