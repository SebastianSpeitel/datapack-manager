import { Datapack } from "@throw-out-error/minecraft-datapack";
import { Argv, Arguments } from "yargs";
import config from "../config";

type Options = Arguments<{
  name: string;
  description?: string;
}>;

export const command = ["create", "c"];

export const desc = "Create a new datapack";

export function builder(yargs: Argv) {
  return yargs.options({
    name: {
      desc: "Name of the datapack",
      alias: "n",
      type: "string" as "string",
      required: true as true
    },
    description: {
      desc: "Description for the datapack",
      alias: ["d", "desc"],
      type: "string" as "string"
    }
  }) as Argv<Options>;
}

export async function handler({ name, description }: Options) {
  const pack = new Datapack(name, ".", { description });
  pack.compile(config.global);
}
