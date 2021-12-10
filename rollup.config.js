import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
// import { terser } from "rollup-plugin-terser";

export default {
  input: "index.js",
  output: [
    {
      file: "public/bundle.min.js",
      format: "iife",
      name: "version",
    },
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: [".js"],
    }),
    commonjs({
      include: "node_modules/**",
    }),
  ],
};
