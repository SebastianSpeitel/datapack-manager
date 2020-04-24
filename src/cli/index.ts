import { DatapackManager } from "..";
import yargs from "yargs";
import config from "../config";
import * as install from "./install";
import * as uninstall from "./uninstall";
import * as list from "./list";
import * as create from "./create";
import * as configCmd from "./config";

export const manager = new DatapackManager();

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
  .command(install)
  .command(uninstall)
  .command(["list"], "List local datapacks", yargs => {
    const argv = yargs.options(list.options).argv;
    list.action(context, argv);
  })
  .command(create)
  .command(configCmd)
  .help()
  .demandCommand()
  .recommendCommands().argv;
