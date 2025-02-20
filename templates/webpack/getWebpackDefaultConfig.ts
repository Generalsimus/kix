




export const getWebpackDefaultConfig = (mainFileName: string) => {
    return /* js */`
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getTransformers } = require("kix/transformers");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ts } = require("webpack-ts-load")

module.exports = function (env, argv) {
  const getOption = (name) => env?.[name] || argv?.[name];

  const isEnvDevelopment = getOption("mode") === "development";
  const publicDirectory = path.resolve(__dirname, "public");
  const outputDirectory = path.resolve(__dirname, getOption("outDir") || "dist");
  const indexHtmlFile = path.resolve(__dirname, "index.html");
  const devPort = parseInt(getOption("port")) || 2206;

  return {
    entry: {
      index: "${mainFileName}",
    },
    module: {
      rules: [
        {
          test: /.(((t|j)sx?)|json|svg)$/i,
          exclude: path.resolve(__dirname, "node_modules"),
          use: [
            {
              loader: "webpack-ts-load",
              options: {
                compilerOptions: {
                  sourceMap: isEnvDevelopment
                },
                extensionsSupport: {
                  ".svg": {
                    extension: ts.Extension.Js,
                    scriptKind: ts.ScriptKind.JS
                  }
                },
                transformers: getTransformers(),
              },
            }
          ],
        },
        {
          test: /.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                jsxRuntime: "automatic",
                babel: false,
              }
            }
          ],
        },
        {
          test: /.(s?c|sa)ss$/i,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                sourceMap: isEnvDevelopment,
                // for use css modules names 'import module from "./style.css"'
                // modules: true,
                url: true,
                import: true,
              },
            },
            { loader: "postcss-loader" },
            { loader: "sass-loader" },
          ],
        }
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
    },
    output: {
      filename: "[chunkhash].bundle.js",
      path: outputDirectory,
      clean: true,
      asyncChunks: true,
      publicPath: "/",
    },
    devServer: {
      static: publicDirectory,
      historyApiFallback: true,
      port: devPort,
      open: true,
      hot: true,
    },
    devtool: isEnvDevelopment ? "source-map" : undefined,
    plugins: [
      new HtmlWebpackPlugin({
        template: indexHtmlFile,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: publicDirectory, to: outputDirectory }],
      })
    ],
  };
};
`.trim()
}