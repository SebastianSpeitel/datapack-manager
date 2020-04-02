import { DatapackManager } from "./index";
import World, { InstallMode } from "./world";
import yargs from "yargs";
import os from "os";
import pth from "path";
import { Datapack } from "@throw-out-error/minecraft-datapack";

const manager = new DatapackManager();

function getMinecraftPath(): string {
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

yargs
  .command(["install <pack> <world>", "i"], "Install a datapack", yargs => {
    const argv = yargs.options({
      mode: {
        desc: "Install mode",
        alias: "m",
        choices: ["symlink", "copy", "compile", "move"] as InstallMode[]
      },
      root: {
        desc: "Path of the minecraft folder",
        alias: "r",
        normalize: true,
        default: getMinecraftPath()
      }
    }).argv;

    const {
      root,
      mode,
      _: [, _pack, _world]
    } = argv;

    manager.root = root;
    manager.install(_pack, _world, { mode }).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .command(["uninstall <pack> <world>", "u"], "Uninstall a datapack", yargs => {
    const argv = yargs.options({
      root: {
        desc: "Path of the minecraft folder",
        alias: "r",
        normalize: true,
        default: getMinecraftPath()
      }
    }).argv;

    const {
      root,
      _: [, _pack, _world]
    } = argv;

    manager.root = root;
    manager.uninstall(_pack, _world).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .command(["list"], "List local datapacks", async yargs => {
    const argv = yargs.options({
      root: {
        desc: "Path of the minecraft folder",
        alias: "r",
        normalize: true,
        default: getMinecraftPath()
      }
    }).argv;
    const { root } = argv;

    manager.root = root;
    const packs = await manager.list();
    console.log("Local datapacks:");
    const locations = new Map<World["path"], Datapack[]>();
    packs.forEach(pack => {
      locations.set(pack.path, [...(locations.get(pack.path) || []), pack]);
    });
    for (let [path, packs] of locations.entries()) {
      console.log(` * ${path}`);
      for (let { name } of packs) {
        console.log(`   * ${name}`);
      }
    }
  })
  .help()
  .demandCommand()
  .recommendCommands().argv;
