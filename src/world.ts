import { promises as fs } from "fs";

import { Datapack } from "@throw-out-error/minecraft-datapack";
import pth from "path";

export type InstallMode = "symlink" | "copy" | "compile" | "move";

export default class World {
  declare path: string;

  constructor(path: string) {
    this.path = path;
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

  async uninstall(pack: Datapack | string) {
    let packPath: unknown = pack;
    if (pack instanceof Datapack) {
      packPath = pth.join(pack.path, pack.name);
    }

    if (typeof packPath !== "string") {
      throw TypeError("Invalid datapack");
    }

    const { isSymbolicLink, isDirectory } = await fs.stat(packPath);
    if (isSymbolicLink()) {
      await fs.unlink(packPath);
    }

    if (isDirectory()) {
      await fs.rmdir(packPath, { recursive: true });
    }
  }
}
