import { build } from "esbuild";

(async function () {
  try {
    const commonOptions = {
      entryPoints: ["src/index.ts"],
      bundle: true,
      sourcemap: true,
      minify: false,
      target: "es2019",
      platform: "node",
    };

    // output for CJS
    await build({
      ...commonOptions,
      format: "cjs",
      outfile: "dist/index.cjs",
    });

    // output for ESM
    await build({
      ...commonOptions,
      format: "esm",
      outfile: "dist/index.mjs",
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
