import path from "path";
import express from "express"
import { readIndexHtml } from "./createProgram/readIndexHtml";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { resolveKixModule } from "../utils/resolveKixModule";
import { readCommandsAndRun } from "../command";
import { ArgumentsCamelCase } from "yargs";
import { rootWriter } from "./rootWriter";

const runDirName = path.resolve("./");
export const App = {
  runDirName,
  realModuleDirName: path.resolve(__dirname, "../../"),
  port: 2222,
  // initServer: false,
  outDir: "./dist/",
  indexHTMLUrlPaths: ["/", "/index.html"],
  nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
  importModulesAccessKey: `__KIX__IMPORT__MODULE__ACCESS_KEY__${new Date().getTime()}__`,
  windowModuleLocationName: "_KIX" + new Date().getTime(),
  requestsThreshold: new Map<string, express.RequestHandler>(),
  moduleThree: new Map<string, ModuleInfoType>(),
  kixModulePath: resolveKixModule(runDirName),
  devMode: false,
  parsedArgs: undefined as (ArgumentsCamelCase | undefined),
  resetRequestsThreshold() {
    const moduleMiddleware = this.requestsThreshold.get(this.nodeModulesUrlPath);
    if (!moduleMiddleware) throw new Error(`moduleMiddleware not found`);
    this.requestsThreshold.clear();
    this.requestsThreshold.set(this.nodeModulesUrlPath, moduleMiddleware);
  },
  start() {
    readCommandsAndRun()
  },
};
