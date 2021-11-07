"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xhrtGetRequet = void 0;
const xhrtGetRequet = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    });
    xhr.open("GET", "http://www.example.org/example.txt");
    xhr.send();
    return xhr;
};
exports.xhrtGetRequet = xhrtGetRequet;
