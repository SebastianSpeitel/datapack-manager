//#!/usr/bin/env node
import { DatapackManager } from "./index";
import World, { InstallMode } from "./world";
import yargs from "yargs";

const manager = new DatapackManager();
manager;

yargs
  .command("install", "Install a datapack", async yargs => {
    const args = yargs
      .positional("pack", { desc: "Pack to install" })
      .positional("world", { desc: "World to install into" })
      .options({
        mode: {
          desc: "Install mode",
          alias: "m",
          choices: ["symlink", "copy", "compile", "move"] as InstallMode[]
        }
      });

    const {
      mode,
      _: [, p, w]
    } = args.argv;

    const world = new World(w);
    try {
      await world.install(p, { mode });
    } catch (e) {
      console.error(e?.message ?? e);
    }
  })
  .help()
  .demandCommand()
  .recommendCommands().argv;
