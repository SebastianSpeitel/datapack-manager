import { promises as fs, Dir } from "fs";
import pth from "path";
import os from "os";
import { Datapack } from "@throw-out-error/minecraft-datapack";

export function getMinecraftPath(): string {
  switch (os.platform()) {
    case "win32":
      return pth.join(os.homedir(), "AppData/Roaming/.minecraft");
    case "darwin":
      return pth.join(os.homedir(), "Library/Application Support/minecraft");
    case "linux":
    default:
      return pth.join(os.homedir(), ".minecraft");
  }
}

async function datapackFromPath(path: string): Promise<Datapack> {
  const stats = await fs.stat(path);
  if (!stats.isDirectory()) {
    throw Error("Invalid datapack. Not a directory.");
  }
  let json: Buffer;
  try {
    json = await fs.readFile(pth.join(path, "pack.mcmeta"));
  } catch (e) {
    throw Error("Invalid datapack. No pack.mcmeta.");
  }
  let meta: {
    pack: {
      pack_format: 5;
      description: string;
    };
  };
  try {
    meta = JSON.parse(json.toString());
  } catch (e) {
    throw Error("Invalid datapack. Invalid pack.mcmeta");
  }

  return new Datapack(pth.basename(path), path, meta.pack);
}

export interface SearchResult {
  path: string;
  datapack: Datapack;
  name: string;
  world?: string;
}
type SearchOptions = {
  name?: string | RegExp;
  world?: string;
  here?: boolean;
  cached?: boolean;
  installed?: boolean;
};
export async function searchDatapacks({
  name,
  world,
  here = !world,
  cached = !world,
  installed = !world
}: SearchOptions = {}): Promise<SearchResult[]> {
  type IntermediateResult = Omit<SearchResult, "datapack" | "path" | "name"> & {
    dir: string;
  };
  const dirs: IntermediateResult[] = [];

  if (here) {
    dirs.push({
      dir: "./"
    });
  }

  if (cached) {
    dirs.push({
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
