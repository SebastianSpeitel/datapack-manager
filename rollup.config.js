import ts from "rollup-plugin-typescript2";

function makeConfig() {
  return {
    input: "src/index.ts",
    output: {
      format: "cjs",
      dir: "legacy",
      exports: "named",
      hoistTransitiveImports: false,
      banner: "#!/usr/bin/env node"
    },
    preserveModules: true,
    context: "this",
    plugins: [
      ts({ tsconfigOverride: { compilerOptions: { rootDir: "src" } } })
    ],
    external: [
      "fs",
      "yargs",
      "path",
      "@throw-out-error/minecraft-datapack",
      "os",
      "cli-table3"
    ]
  };
}

const cjsConfig = makeConfig();
cjsConfig.input = [cjsConfig.input, "src/cli/index.ts"].flat();
const esmConfig = makeConfig();
esmConfig.output.format = "esm";
esmConfig.output.dir = "dist";

export default [cjsConfig, esmConfig];
