"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutCodeForHigliting = exports.getProgramDiagnostics = exports.sendFileDiagnostics = void 0;
const utils_1 = require("../../helpers/utils");
const CompileFile_1 = require("../Compiler/CompileFile");
const path_1 = __importDefault(require("path"));
const App_1 = require("../App");
const loger_1 = require("../../helpers/loger");
const highlighter_1 = require("../../helpers/highlighter");
const chalk_1 = __importDefault(require("chalk"));
const typescript_1 = require("typescript");
const sendFileDiagnostics = (connectedWs, socketClientSender) => {
    var _a;
    let ifNoHaveError = true;
    for (const [compiledFilePath, program] of CompileFile_1.__compiledFilesThreshold) {
        const diagnostics = (0, exports.getProgramDiagnostics)(program);
        for (var diagnose of diagnostics) {
            if (diagnose.file) {
                ifNoHaveError = false;
                const { line, character } = diagnose.file.getLineAndCharacterOfPosition(diagnose.start);
                const errorInfo = {
                    path: (0, utils_1.filePathToUrl)(path_1.default.relative(App_1.App.__RunDirName, diagnose.file.originalFileName)),
                    errorMessage: ((_a = diagnose.messageText) === null || _a === void 0 ? void 0 : _a.messageText) || diagnose.messageText,
                    fileCode: diagnose.file.text,
                    column: character + 1,
                    line: line + 1,
                };
                (0, loger_1.logError)({
                    messageText: errorInfo.errorMessage,
                    errorText: (0, exports.cutCodeForHigliting)(errorInfo)
                });
                socketClientSender("ALERT_ERROR", errorInfo);
            }
        }
    }
    if (ifNoHaveError) {
        (0, loger_1.log)({
            "\n√": "green",
            "Compiled successfully.": "green"
        });
    }
};
exports.sendFileDiagnostics = sendFileDiagnostics;
const getProgramDiagnostics = (program) => {
    return [
        ...program.getSemanticDiagnostics(),
        ...program.getSyntacticDiagnostics(),
    ];
};
exports.getProgramDiagnostics = getProgramDiagnostics;
const cutCodeForHigliting = (errorInfo) => {
    const { line, column, path: filePath, fileCode } = errorInfo;
    var SPLITED = fileCode.split('\n').slice(line - 1, line + 4).join('\n');
    return `\nat (${(0, typescript_1.normalizeSlashes)(path_1.default.join(App_1.App.__RunDirName, filePath))}:${line}:${column})` + "\n " +
        (0, highlighter_1.highlighter)(SPLITED).split('\n').map((v, index) => {
            let leng = (String(Math.max(line - 2, line + 2)).length - String(line + index).length);
            let left_join = Array.from(Array(Math.max(0, leng)), x => " ").join("");
            return chalk_1.default[index ? "grey" : "redBright"](left_join + ((line) + index) + '|' + (index ? "  " : "> ")) + v;
        }).join('\n');
};
exports.cutCodeForHigliting = cutCodeForHigliting;
