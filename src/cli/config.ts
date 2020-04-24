import { Argv, Arguments } from "yargs";
import config from "../config";

type Key = keyof Omit<typeof config, "reload" | "init" | "save" | "toJSON">;

type Options = Arguments<{
  key: Key;
  value?: string;
}>;

export const command = "config <key> [<value>]";

export function builder(yargs: Argv) {
  return yargs as Argv<Options>;
}

export async function handler({ key, value }: Options) {
  if (typeof value === "undefined") {
    console.log(`${key} = ${JSON.stringify(config[key])}`);
    return;
  }
  config[key] = value;
  await config.save();
}
