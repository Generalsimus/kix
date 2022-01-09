import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import { App } from "../app"

export const createServer = () => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    const WebSocketServer = new WebSocket.Server({ server, path: "/WebSocket" });

    expressApp.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {

        next()
    })
    // app.use(function (req, res, next) {
    //     res.header("Cache-Control", "no-cache");
    //     // console.log("🚀 --> file: express.js --> line 25 --> __requestsThreshold", __requestsThreshold.keys())
    //     // console.log("🚀 --> file: express.js --> line 25 --> __requestsThreshold", req.path)
    //     if (__requestsThreshold.has(req.path)) {
    //         res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
    //         res.end(__requestsThreshold.get(req.path))
    //     } else {

    //         const requestPath = normalizeSlashes(path.join(__RunDirName, req.path).toLocaleLowerCase())
    //         for (const [_, value] of __compiledFilesThreshold) {
    //             if (value.getFilesByNameMap().has(requestPath)) {
    //                 return;
    //             }

    //         }
    //         next();
    //     }
    // });
    // // 
    expressApp.use("./", express.static(App.runDirName));

    const listener = server.listen(App.port, function () {
        // expressApp.get

        const httpUrl = `http://${`localhost:${App.port}`}`;

        open(httpUrl);
    });
    // saveLog({
    //     "\nYou can now view in the browser: ": "white",
    //     [http_url]: "blue",
    //     // "green",socketClientSender
    //     "\nTo create a production build, use": "white",
    //     "npm build": "blue",
    // })
}