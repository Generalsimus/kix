"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenSocketMessages = exports.SocketControlerFunctions = void 0;
exports.SocketControlerFunctions = {
    RESTART_SERVER: (data) => {
        window.location.reload();
    }
};
const listenSocketMessages = (event) => {
    try {
        const { action, data } = JSON.parse(event.data);
        exports.SocketControlerFunctions[action](data);
    }
    catch (e) { }
};
exports.listenSocketMessages = listenSocketMessages;
