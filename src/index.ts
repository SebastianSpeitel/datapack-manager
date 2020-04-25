import World from "./world";
import { Datapack } from "@throw-out-error/minecraft-datapack";
import { getMinecraftPath, datapackFromPath } from "./util";
import config from "./config";
import pth from "path";
import { promises as fs, Dir } from "fs";

type InstallOptions = Parameters<World["install"]>[1];

export interface SearchResult {
  path: string;
  datapack: Datapack;
  name: string;
  world?: string;
  global?: boolean;
}
type SearchOptions = {
  name?: string | RegExp;
  world?: string;
  here?: boolean;
  global?: boolean;
  installed?: boolean;
};

export class DatapackManager {
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
      pack = pth.resolve(config.global, nameOrPathOrPack);
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

  async search({
    name,
    world,
    here = !world,
    global = !world,
    installed = !world
  }: SearchOptions = {}): Promise<SearchResult[]> {
    type IntermediateResult = Omit<
      SearchResult,
      "datapack" | "path" | "name"
    > & {
      dir: string;
    };
    const dirs: IntermediateResult[] = [];

    if (here) {
      dirs.push({
        dir: "./"
      });
    }

    if (global) {
      dirs.push({
        global: global,
        dir: pth.join(getMinecraftPath(), "datapacks")
      });
    }

    if (world) {
      dirs.push({
        world: pth.basename(world),
        dir: pth.resolve(getMinecraftPath(), "saves", world)
      });
    }

    if (installed) {
      const saves = pth.join(getMinecraftPath(), "saves");
      let worlds: Dir | null = null;

      try {
        worlds = await fs.opendir(saves);
      } catch (e) {}

      if (worlds) {
        for await (let { name: world } of worlds) {
          dirs.push({
            world,
            dir: pth.join(saves, world, "datapacks")
          });
        }
      }
    }

    if (typeof name === "string") {
      const results = await Promise.all(
        dirs.map(async r => {
          const path = pth.join(r.dir, name);
          let datapack: Datapack;
          try {
            datapack = await datapackFromPath(path);
          } catch (e) {
            return false as false;
          }
          return {
            ...r,
            name,
            path,
            datapack
          };
        })
      );
      return results.filter(Boolean) as SearchResult[];
    }

    const promises = await Promise.all(
      dirs.map(async r => {
        let dir: Dir | null = null;

        try {
          dir = await fs.opendir(r.dir);
        } catch (e) {}
        if (!dir) return false as false;

        const results: Promise<SearchResult | false>[] = [];
        for await (let { name: pack } of dir) {
          if (name instanceof RegExp && !name.test(pack)) continue;
          const path = pth.join(r.dir, pack);
          results.push(
            datapackFromPath(path)
              .then(datapack => {
                return {
                  ...r,
                  name: pack,
                  path,
                  datapack
                };
              })
              .catch(() => false as false)
          );
        }
        return results;
      })
    );

    const results = await Promise.all(promises.flat());

    return results.filter(Boolean) as SearchResult[];
  }
}
