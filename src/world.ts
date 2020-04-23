import { promises as fs } from "fs";

import { Datapack } from "@throw-out-error/minecraft-datapack";
import pth from "path";

export type InstallMode = "symlink" | "copy" | "compile" | "move";

const worldCache = new Map<string, World>();

export default class World {
  static fromPath(path: string) {
    const world = worldCache.get(path);
    return world || new World(path);
  }

  declare path: string;

  constructor(path: string) {
    this.path = path;
    worldCache.set(path, this);
  }

  async getDatapacks() {
    const packs: Datapack[] = [];
    const packsPath = pth.join(this.path, "datapacks");
    try {
      const packsDir = await fs.opendir(packsPath);
      for await (let { name } of packsDir) {
        packs.push(new Datapack(name, packsPath, {}));
      }
    } catch (e) {}
    return packs;
  }

  async install(
    pack: Datapack | string,
    { mode = "symlink" }: { mode?: InstallMode } = {}
  ) {
    let packPath: unknown = pack;
    if (pack instanceof Datapack) {
      packPath = pth.join(pack.path, pack.name);
    }

    if (typeof packPath !== "string") {
      throw TypeError("Invalid datapack");
    }

    const newPath = pth.join(this.path, "datapacks", pth.basename(packPath));

    switch (mode) {
      case "symlink":
        return fs.symlink(packPath, newPath);
      case "move":
        return fs.rename(packPath, newPath);
      default:
        throw Error(`install-mode "${mode}" not implemented`);
    }
  }

  async uninstall(name: string): Promise<void>;
  /**@param {string} path absolute path of the datapack */
  async uninstall(path: string): Promise<void>;
  async uninstall(nameOrPath: string): Promise<void> {
    const path = pth.resolve(this.path, "datapacks", nameOrPath);

    const { isSymbolicLink, isDirectory } = await fs.stat(path);
    if (isSymbolicLink()) {
      await fs.unlink(path);
    } else if (isDirectory()) {
      await fs.rmdir(path, { recursive: true });
    }
  }
}
