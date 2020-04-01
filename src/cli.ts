import { DatapackManager } from "./index";
import World, { InstallMode } from "./world";
import yargs from "yargs";

const manager = new DatapackManager();
manager;

yargs
  .command("install <pack> <world>", "Install a datapack", yargs => {
    const args = yargs.options({
      mode: {
        desc: "Install mode",
        alias: "m",
        choices: ["symlink", "copy", "compile", "move"] as InstallMode[]
      }
    });

    const {
      mode,
      _: [, _pack, _world]
    } = args.argv;

    const world = new World(_world);

    world.install(_pack, { mode }).catch(e => {
      console.error(e?.message ?? e);
    });
  })
  .help()
  .demandCommand()
  .recommendCommands().argv;
