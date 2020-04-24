import yargs from "yargs";
import * as install from "./install";
import * as uninstall from "./uninstall";
import * as list from "./list";
import * as create from "./create";
import * as configCmd from "./config";

yargs
  .command(install)
  .command(uninstall)
  .command(list)
  .command(create)
  .command(configCmd)
  .help()
  .demandCommand()
  .recommendCommands().argv;
