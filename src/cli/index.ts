import { DatapackManager } from "..";
import { InstallMode } from "../world";
import yargs from "yargs";
import { getMinecraftPath } from "../util";
import config from "../config";
import * as list from "./list";
import * as create from "./create";
import * as configCmd from "./config";

const manager = new DatapackManager();

export interface Context {
  manager: DatapackManager;
  config: {
    cache: string;
  };
}
const context: Context = {
  manager,
  config
};

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
      _: [, pack, world]
    } = argv;

    manager.root = root;
    manager.install(pack, world, { mode }).catch(e => {
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
      _: [, pack, world]
    } = argv;

    manager.root = root;
    manager.uninstall(pack, world).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .command(["list"], "List local datapacks", yargs => {
    const argv = yargs.options(list.options).argv;
    list.action(context, argv);
  })
  .command(create)
  .command(configCmd)
  .help()
  .demandCommand()
  .recommendCommands().argv;
