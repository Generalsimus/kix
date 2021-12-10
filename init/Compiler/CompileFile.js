import { readSourceFiles } from "./readSourceFiles"
import { App } from "../App"
import ts, { createProgram, getDirectoryPath, getBaseFileName, normalizeSlashes } from "typescript"
import chokidar from "chokidar"
import path from "path"
import { createCancellationToken, filePathToUrl, getImportModuleName, getModuleFiles, getModuleWindowName, getoutFilePath } from "../../helpers/utils"
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module"
import resolve from 'resolve'
import { getTransformersObject, ModulesThree, resolveModule } from "./Transpiler/utils"
import { NodeModuleTransformersBefore } from "./Transpiler/NodeModules"
import { JSXTransformersBefore } from "./Transpiler/JSX/index"
import fs from "fs"
import { getProgramDiagnostics } from "../SocketMessageControler/utils"
import { clareLog, log } from "../../helpers/loger"


const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App
const { resetFilesThree } = __Host






// let increm = 0;
export const __compiledFilesThreshold = new Map();
export const CompileFile = (FilePath, HTMLFilePaths, __compilerOptions) => {
    // console.log("🚀 --> file: CompileFile.js --> line 28 --> CompileFile --> __compilerOptions", __compilerOptions)

    let resetModules = true;
    let oldProgram;
    const __Import_Module_Name = getImportModuleName(),
        __Module_Window_Name = getModuleWindowName(),
        requestPath = filePathToUrl(__compilerOptions.outFile),
        mapRequestPath = requestPath + ".map",
        changeFileCallback = () => {
            clareLog({
                "Generating browser application bundles...": "yellow"
            })


            compilerOptions.cancellationToken = createCancellationToken()

            oldProgram = createProgram(
                compilerOptions.rootNames,
                compilerOptions,
                __Host,
                oldProgram
            );
            __compiledFilesThreshold.set(FilePath, oldProgram)

            // console.log("🚀 --> file: CompileFile.js --> line 49 --> CompileFile --> getProgramDiagnostics(oldProgram)", getProgramDiagnostics(oldProgram))
            oldProgram.emit(
                undefined /*sourceFile*/,
                writeFileCallback /*writeFileCallback*/,
                undefined /*cancellationToken*/,
                undefined /*emitOnlyDtsFiles*/,
                transformers /*transformers*/
            )
            // console.log("🚀 --> file: CompileFile.js --> line 55 --> CompileFile --> getDeclarationDiagnostics", oldProgram.getOptionsDiagnostics());
            if (resetModules) {
                const Modules = new Set(defaultModules)

                for (const ModuleFilePath of HTMLFilePaths) {

                    ModuleFilePath && getModuleFiles(ModulesThree.get(ModuleFilePath), Modules)
                }
                resetModules = false
                Compile_Node_Modules(
                    [...Modules],
                    compilerOptions
                )

            }

            resetFilesThree(oldProgram.getFilesByNameMap())
        },
        compilerOptions = {
            ...__compilerOptions,
            inlineSources: true,
            watch: true,
            __Module_Window_Name,
            rootDir: __RunDirName,
            rootNames: [FilePath],
            __Import_Module_Name,
            changeFileCallback,
            resetModuleFiles: () => {
                resetModules = true
            },
            __Url_Dir_Path: path.dirname(requestPath)
        },
        transformers = getTransformersObject([ModuleTransformersBefore, JSXTransformersBefore], [ModuleTransformersAfter]),
        defaultModules = [
            App.__kixModuleLocation || App.__kixLocalLocation,
            normalizeSlashes(path.join(__dirname, "./../../../main/codeController/index.js"))
        ],
        writeFileCallback = (fileName, content) => {
            // console.log({ fileName, requestPath })

            const ext = path.extname(fileName)
            if (ext === ".map") {
                __requestsThreshold.set(mapRequestPath, content)
            } else if (ext === ".js") {

                const Module_Text = `(function(${__Import_Module_Name}){${content} \n return ${__Import_Module_Name}; })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${mapRequestPath}`

                __requestsThreshold.set(requestPath, Module_Text)
                // console.log(Module_Text)
                // console.log(Module_Text.length)
            }
        };


    changeFileCallback()






}
































const Compile_Node_Modules = (NodeModuelsPaths, defaultcompilerOptions) => {

    let Node_oldProgram;
    const transformers = getTransformersObject([ModuleTransformersBefore, NodeModuleTransformersBefore], [ModuleTransformersAfter]),
        __Module_Window_Name = defaultcompilerOptions.__Node_Module_Window_Name;




    const compilerOptions = {
        ...defaultcompilerOptions,
        outFile: __ModuleUrlPath,
        // removeComments: false,
        lib: undefined,
        sourceMap: false,
        rootNames: NodeModuelsPaths,
        __Import_Module_Name: __Module_Window_Name,
        __Module_Window_Name,
        resetModuleFiles: () => { },
    }


    Node_oldProgram = createProgram(NodeModuelsPaths,
        compilerOptions,
        {
            ...__Host,
            resolveModuleNames: (moduleNames, containingFile, reusedNames, redirectedReference) => {
                // 
                return moduleNames.map((ModuleText) => {
                    try {
                        const modulePath = resolve.sync(ModuleText, {
                            basedir: path.dirname(containingFile),
                            extensions: ['.js', '.ts'],
                        })
                        return {
                            resolvedFileName: normalizeSlashes(modulePath),
                            originalPath: undefined,
                            extension: path.extname(modulePath),
                            isExternalLibraryImport: false,
                            packageId: undefined
                        }
                    } catch (e) {
                        return undefined
                    }
                })
            }
        },
        Node_oldProgram
    );
    Node_oldProgram.emit(
        undefined /*sourceFile*/,
        (fileName, content) => {

            if (path.extname(fileName) == ".js") {
                __requestsThreshold.set(
                    __ModuleUrlPath,
                    `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`
                )
                // console.log(
                //     __ModuleUrlPath,
                //     `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`
                // )
            }

        }
        // undefined
        /*writeFileCallback*/,
        undefined /*cancellationToken*/,
        undefined /*emitOnlyDtsFiles*/,
        transformers /*transformers*/
    )
}