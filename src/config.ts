import fs from "fs";
import os from "os";
import pth from "path";
import { getMinecraftPath } from "./util";

class Config {
  static path = pth.join(os.homedir(), ".config", "datapack-manager", "config");

  global: string;

  constructor() {
    this.reload();
  }

  reload() {
    let json: string;
    try {
      json = fs.readFileSync(Config.path).toString();
    } catch (e) {
      json = "";
    }

    if (!json) {
      return this.init();
    }

    try {
      const config = JSON.parse(json) as Partial<Config>;
      Object.assign(this, config);
    } catch (e) {
      return this.init();
    }
  }

  init() {
    this.global = pth.join(getMinecraftPath(), "datapacks");
  }

  async save() {
    const dir = pth.dirname(Config.path);
    try {
      await fs.promises.access(dir);
    } catch (e) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    return fs.promises.writeFile(Config.path, JSON.stringify(this, null, 2));
  }

  toJSON() {
    return {
      global: this.global
    };
  }
}

export default new Config();
