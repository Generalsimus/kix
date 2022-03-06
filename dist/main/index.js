"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.styleCssDom = exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const routeParams = {};
const createSVGElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName);
const abstractNodes = {
    svg(objectNodeProperty, objectNode, createElementName, createElement) {
        return (parent) => {
            if (createElementName === createSVGElement) {
                objectNode = Object.assign({}, objectNode);
                const node = createSVGElement(objectNodeProperty);
                KixSVG(node, objectNode[objectNodeProperty]);
                delete objectNode[objectNodeProperty];
                return createElement(objectNode, parent, node);
            }
            else {
                return KixSVG(parent, objectNode);
            }
        };
    },
    switch(objectNodeProperty, objectNode, createElementName, createElement) {
        let switchObjectNode = Object.assign({}, objectNode);
        const namedNode = createElementName("a");
        (0, exports.kix)(namedNode, switchObjectNode[objectNodeProperty]);
        delete switchObjectNode[objectNodeProperty];
        namedNode.e({
            click: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                const state = {
                    _routeID: new Date().getTime()
                };
                const routeEvent = new CustomEvent('popstate', { detail: state });
                history.pushState(state, document.title, this.getAttr("href"));
                window.dispatchEvent(routeEvent);
            },
        });
        return (parent) => createElement(switchObjectNode, parent, namedNode);
    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {
        return (parent) => {
            const to = flatFunction(path), uniqValue = flatFunction(unique), componentValue = flatFunction(component), escapeRegexp = [/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&"], toPath = (uniqValue ? [
                escapeRegexp,
                [/:[^\s/]+/g, "([\\w-]+)"]
            ] : [
                escapeRegexp,
                [/\((.*?)\)/g, "(?:$1)?"],
                [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
                [/\*\w+/g, "(.*?)"]
            ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to), routeRegExp = new RegExp(uniqValue ? toPath : "^" + toPath + "$", "i"), routeNodes = {}, createRouterNode = (_routeID) => {
                var localPath = decodeURI(document.location.pathname), matchPath = localPath.match(routeRegExp) || [];
                to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (routeParams[v] = matchPath[i]));
                return routeRegExp.test(localPath) ? routeNodes[_routeID] || (routeNodes[_routeID] = componentValue) : "";
            };
            let existNode = (0, exports.kix)(parent, createRouterNode());
            window.addEventListener("popstate", (routeEvent) => {
                var _a;
                const newNode = createRouterNode((_a = routeEvent.detail) === null || _a === void 0 ? void 0 : _a._routeID);
                if (existNode !== newNode) {
                    existNode = existNode.Replace(newNode);
                }
            });
            return existNode;
        };
    },
    _R(objectNodeProperty, objectNode, createElementName, createElement) {
        return propertyRegistry(objectNode[objectNodeProperty]);
    },
    _C(objectNodeProperty, objectNode, createElementName, createElement) {
        return objectNode[objectNodeProperty](registerProps);
    }
};
const abstractAttributes = {
    getAttr(a) {
        return this.getAttribute(a);
    },
    setAttr(attribute, value) {
        value = flatFunction(value, this, attribute);
        abstractAttributes[attribute] ? this[attribute](value, attribute) : this.setAttribute(attribute, value);
    },
    Append(childNode) {
        return (0, exports.kix)(this, childNode);
    },
    e(eventsObject) {
        for (var eventNames in eventsObject) {
            for (var eventName of eventNames.split("_")) {
                if (eventsObject[eventName] instanceof Function) {
                    this.addEventListener(eventName, eventsObject[eventName].bind(this));
                }
            }
        }
        return this;
    },
    Remove() {
        const parentNode = this.parentNode;
        parentNode && parentNode.removeChild(this);
        return this;
    },
    Replace(replaceNode) {
        const parent = this.parentNode;
        if (parent) {
            replaceNode = (0, exports.kix)(null, flatFunction(replaceNode, parent));
            if (replaceNode instanceof Array) {
                replaceArrayNodes([this], replaceNode);
            }
            else {
                parent.replaceChild(replaceNode, this);
            }
            return replaceNode;
        }
    },
    Insert(method, node) {
        const parent = this.parentNode, HtmlNode = (0, exports.kix)(null, flatFunction(node, parent));
        if (!parent)
            return;
        switch (method) {
            case "after":
                const netNode = this.nextSibling;
                if (netNode) {
                    parent.insertBefore(HtmlNode, netNode);
                    return HtmlNode;
                }
                else {
                    return parent.Append(node);
                }
            case "before":
                parent.insertBefore(HtmlNode, this);
                return HtmlNode;
        }
    },
    _R(value) {
        for (const attributeName in value) {
            this.setAttr(attributeName, propertyRegistry(value[attributeName]));
        }
    }
};
for (const key in abstractAttributes) {
    (Node.prototype[key] = abstractAttributes[key]);
}
function createApp(createElementName) {
    function createElement(objectNode, parent, elementNode) {
        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            }
            else {
                if (abstractNodes.hasOwnProperty(objectNodeProperty)) {
                    return (0, exports.kix)(parent, abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement));
                }
                (0, exports.kix)((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
                elementNode._kixNode = objectNode;
            }
        }
        return elementNode;
    }
    return function kix(parent, child) {
        switch (type(child)) {
            case "[object Array]":
                return child.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, child(parent));
            case "[object Object]":
                child = createElement(child, parent);
                break;
            case "[object Promise]":
                child.then(function (result) {
                    child.Replace(result);
                });
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                child = "";
            case "[object String]":
            case "[object Number]":
            case "[object Date]":
            case "[object RegExp]":
            case "[object BigInt]":
            case "[object Symbol]":
            case "[object Error]":
            case "[object Date]":
                const textNode = document.createTextNode(String(child));
                textNode._kixNode = child;
                child = textNode;
                break;
            default:
                if (!child instanceof Node) {
                    return kix(parent, String(child));
                }
        }
        return parent && parent.appendChild(child), child;
    };
}
const KixSVG = createApp(createSVGElement);
exports.kix = createApp(document.createElement.bind(document));
exports.default = exports.kix;
exports.styleCssDom = (0, exports.kix)(document.body, { style: "" });
class Component {
    constructor() {
        this.props = {};
    }
}
exports.Component = Component;
function registerProps(registerFunction) {
    const prop = registerFunction(function () {
        return [getPropValue, arguments];
    });
    function getPropValue(propName, args) {
        return Array.prototype.reduce.call(args, (obj, key) => {
            var _a;
            let descriptor = Object.getOwnPropertyDescriptor(obj, key), value = obj[key], defineRegistrations = ((_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.set) === null || _a === void 0 ? void 0 : _a._R_C) || [];
            if (defineRegistrations.indexOf(registerFunction) === -1) {
                defineRegistrations.push(registerFunction);
                function set(setValue) {
                    value = setValue;
                    descriptor.set && descriptor.set(value);
                    prop[propName] = getPropValue(propName, args);
                }
                set._R_C = defineRegistrations;
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    registrations: defineRegistrations,
                    get() {
                        return value;
                    },
                    set
                });
            }
            return value;
        });
    }
    for (const propName in prop) {
        const value = prop[propName];
        if (value instanceof Array && value[0] === getPropValue) {
            prop[propName] = getPropValue(propName, value[1]);
        }
    }
    return prop;
}
function replaceArrayNodes(nodes, values, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {
    while ((valuesIndex in values) || (nodeIndex in nodes)) {
        value = values[valuesIndex];
        node = nodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceArrayNodes(nodes, (value.length ? value : [""]), returnNodes, 0, nodeIndex);
        }
        else if (node) {
            if (valuesIndex in values) {
                returnNodes.push(node.Replace(value));
            }
            else {
                node.Remove();
            }
            nodeIndex++;
        }
        else {
            returnNodes.push(returnNodes[returnNodes.length - 1].Insert("after", value));
        }
        valuesIndex++;
    }
    return nodeIndex;
}
function propertyRegistry(registerFunction) {
    console.log("🚀 --> file: index.js --> line 306 --> propertyRegistry --> registerFunction", registerFunction);
    let currentNodes;
    const getRenderValue = (parent, attribute) => {
        return registerFunction(function () {
            const objValue = Array.prototype.reduce.call(arguments, (obj, key) => {
                var _a;
                let descriptor = Object.getOwnPropertyDescriptor(obj, key), value = obj[key], defineRegistrations = ((_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.set) === null || _a === void 0 ? void 0 : _a._R_C) || [];
                if (defineRegistrations.indexOf(registerFunction) === -1) {
                    defineRegistrations.push(registerFunction);
                    function set(setValue) {
                        value = setValue;
                        descriptor.set && descriptor.set(value);
                        if (attribute) {
                            parent.setAttr(attribute, value);
                        }
                        else {
                            replaceArrayNodes(currentNodes, [getRenderValue(parent, attribute)], (currentNodes = []));
                        }
                    }
                    set._R_C = defineRegistrations;
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        registrations: defineRegistrations,
                        get() {
                            return value;
                        },
                        set
                    });
                }
                return typeof value === "function" ? value.bind(obj) : value;
            });
            return objValue;
        });
    };
    return (parent, attribute) => {
        const value = getRenderValue(parent, attribute);
        if (attribute) {
            return value;
        }
        replaceArrayNodes((0, exports.kix)(parent, [""]), [value], (currentNodes = []));
        return "";
    };
}
