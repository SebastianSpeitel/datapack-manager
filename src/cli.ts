import { DatapackManager } from "./index";
import World, { InstallMode } from "./world";
import yargs from "yargs";

const manager = new DatapackManager();
manager;

yargs
  .command(["install <pack> <world>", "i"], "Install a datapack", yargs => {
    const argv = yargs.options({
      mode: {
        desc: "Install mode",
        alias: "m",
        choices: ["symlink", "copy", "compile", "move"] as InstallMode[]
      }
    }).argv;

    const {
      mode,
      _: [, _pack, _world]
    } = argv;

    const world = new World(_world);

    world.install(_pack, { mode }).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .command(["uninstall <pack> <world>", "u"], "Uninstall a datapack", yargs => {
    const argv = yargs.argv;

    const {
      _: [, _pack, _world]
    } = argv;

    const world = new World(_world);

    world.uninstall(_pack).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .help()
  .demandCommand()
  .recommendCommands().argv;
