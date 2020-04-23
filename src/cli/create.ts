import { Datapack } from "@throw-out-error/minecraft-datapack";
import { InferredOptionTypes } from "yargs";
import { Context } from ".";

export const options = {
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
};

export async function action(
  { config: { cache } }: Context,
  { name, description }: InferredOptionTypes<typeof options>
) {
  const pack = new Datapack(name, ".", { description });
  pack.path = cache;
  pack.compile();
}
