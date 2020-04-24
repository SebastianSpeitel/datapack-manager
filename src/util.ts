import { promises as fs } from "fs";
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

export async function datapackFromPath(path: string): Promise<Datapack> {
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
