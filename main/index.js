const type = (arg) => Object.prototype.toString.call(arg)
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const routeParams = {};
const createSVGElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName)
// TODO:svg Ns ის დეფაულთი და ასევე გენერირებული
const abstractNodes = {
    svg(objectNodeProperty, objectNode, createElementName, createElement) {
        return (parent) => {
            if (createElementName === createSVGElement) {
                objectNode = { ...objectNode };
                const node = createSVGElement(objectNodeProperty);
                KixSVG(node, objectNode[objectNodeProperty]);
                delete objectNode[objectNodeProperty];
                return createElement(objectNode, parent, node)
            } else {
                return KixSVG(parent, objectNode)
            }
        }

    },
    switch(objectNodeProperty, objectNode, createElementName, createElement) {
        let switchObjectNode = {
            ...objectNode
        };
        const namedNode = createElementName("a")
        kix(namedNode, switchObjectNode[objectNodeProperty])
        delete switchObjectNode[objectNodeProperty];
        namedNode.e({
            click: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                const state = {
                    _routeID: new Date().getTime()
                }
                const routeEvent = new CustomEvent('popstate', { detail: state });
                history.pushState(state, document.title, this.getAttr("href"));
                window.dispatchEvent(routeEvent);
            },
        });
        return (parent) => createElement(switchObjectNode, parent, namedNode)

    },
    routing(_, routeObjectNode) {
        let tagName = routeObjectNode.tagName || "div",
            ifEmptyComponent = routeObjectNode.ifEmptyComponent || "",
            routing = routeObjectNode.routing,
            fakeNode = kix(null, ""),
            existNode = fakeNode,
            newRouteObjectNode = {
                [tagName]: [fakeNode, routing],
                ...routeObjectNode,
            };

        delete newRouteObjectNode.tagName;
        delete newRouteObjectNode.ifEmptyComponent;
        delete newRouteObjectNode.routing;


        const node = kix(null, newRouteObjectNode)


        const resetRoute = () => {
            let exis_node = existNode.previousElementSibling || existNode.nextElementSibling
            if (exis_node && fakeNode != existNode) {
                existNode.Replace(fakeNode)
                existNode = fakeNode
            } else if (!exis_node && fakeNode == existNode) {
                existNode.Replace(ifEmptyComponent = kix(null, ifEmptyComponent));
                existNode = ifEmptyComponent;
            }
        }
        window.addEventListener("popstate", resetRoute)
        resetRoute()


        return node;
    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {
        /////////////////////////////////////////////////////////////////
        return (parent) => {
            const to = flatFunction(path),
                uniqValue = flatFunction(unique),
                componentValue = flatFunction(component),
                escapeRegexp = [/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&"],
                toPath = (uniqValue ? [
                    escapeRegexp,
                    [/:[^\s/]+/g, "([\\w-]+)"]
                ] : [
                    escapeRegexp,
                    [/\((.*?)\)/g, "(?:$1)?"],
                    [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
                    [/\*\w+/g, "(.*?)"]
                ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to),
                routeRegExp = new RegExp(uniqValue ? toPath : "^" + toPath + "$", "i"),
                routeNodes = {},
                createRouterNode = (_routeID) => {
                    var localPath = decodeURI(document.location.pathname),
                        matchPath = localPath.match(routeRegExp) || [];

                    to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (routeParams[v] = matchPath[i]))

                    return routeRegExp.test(localPath) ? routeNodes[_routeID] || (routeNodes[_routeID] = componentValue) : "";
                };
            // console.log("🚀 --> file: index.js --> line 107 --> return --> createRouterNode()", componentValue);
            let currentNodes;
            // console.log("🚀 --> file: index.js --> line 106 --> return --> currentNodes", currentNodes);

            console.log({
                currentNodes,
                // newNode,
                value: createRouterNode()
            });
            replaceArrayNodes(
                kix(parent, [""]),
                [createRouterNode()],
                (currentNodes = [])
            )

            window.addEventListener("popstate", (routeEvent) => {
                const newNode = createRouterNode(routeEvent.detail?._routeID);
                console.log({
                    currentNodes,
                    newNode,
                    value: createRouterNode()
                });
                replaceArrayNodes(
                    currentNodes,
                    [newNode],
                    (currentNodes = [])
                );
            })
        }

    },
    _R(objectNodeProperty, objectNode, createElementName, createElement) {
        return propertyRegistry(objectNode[objectNodeProperty])
    },
    _F(objectNodeProperty, objectNode, createElementName, createElement) {
        const component = objectNode._F
        if (!(component instanceof Function)) return;
        const prototypeDescriptor = Object.getOwnPropertyDescriptor(component, 'prototype');
        if (component.prototype.render || !prototypeDescriptor?.writable) {
            class ComponentNode extends component {
                constructor() {
                    super();
                    // console.log("🚀 --> file: index.js --> line 94 --> ComponentNode --> constructor --> this", this);
                    // console.log("🚀 --> file: index.js --> line 95 --> ComponentNode --> constructor --> objectNode", objectNode);
                    const props = { ...(objectNode.s || {}), ...registerProps(this, objectNode.d) }

                    for (const propKey in props) {
                        this[propKey] = props[propKey];
                    }
                    this.children = objectNode.c || this.children
                    this.render = this.render || (() => { })
                }
            }

            return new ComponentNode().render();
        } else {
            const props = registerProps({}, objectNode.d);
            // console.log(component(props))
            return component(props)
        }


    }
}
//TODO: ტეგზე სპრეადის უსაფრთხო ასინგისთვის  სჯობს სბსტრაქტული ატრიბუტი შეიქმნას და ევენთის ფროფერთები გაიფილტროს

const abstractAttributes = {
    getAttr(a) {
        return this.getAttribute(a);
    },
    setAttr(attribute, value) {
        value = flatFunction(value, this, attribute)
        abstractAttributes[attribute] ? this[attribute](value, attribute) : this.setAttribute(attribute, value);
    },
    Append(childNode) {
        return kix(this, childNode);
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
        const parent = this.parentNode
        if (parent) {
            // console.log("🚀 --> file: index.js --> line 202 --> Replace --> replaceNode", replaceNode);
            console.log({ replaceNode, vvv: flatFunction(replaceNode, parent), node: kix(null, flatFunction(replaceNode, parent)) });
            replaceNode = kix(null, flatFunction(replaceNode, parent));
            if (replaceNode instanceof Array) {

                // console.log("🚀 --> file: index.js --> line 149 --> Replace --> this", this);
                replaceArrayNodes([this], replaceNode, []);
            } else {
                parent.replaceChild(replaceNode, this);
            }
            return replaceNode;
        }
        return this;
    },
    Insert(method, node) {
        const parent = this.parentNode,
            HtmlNode = kix(null, flatFunction(node, parent));
        if (!parent) return;
        switch (method) {
            case "after":
                const netNode = this.nextSibling;
                if (netNode) {
                    parent.insertBefore(HtmlNode, netNode);
                    return HtmlNode;
                } else {
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
}
for (const key in abstractAttributes) { (Node.prototype[key] = abstractAttributes[key]) }

function createApp(createElementName) {


    function createElement(objectNode, parent, elementNode) {
        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            } else {
                // console.log("🚀 --> file: index.js --> line 172 --> createElement --> objectNodeProperty", objectNodeProperty);
                if (abstractNodes.hasOwnProperty(objectNodeProperty)) {

                    return kix(parent, abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement))
                    //  kix(parent, "");

                }
                kix((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
                elementNode._kixNode = objectNode;
            }
        }
        return elementNode
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
                child = ""
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
                if (!(child instanceof Node)) {
                    return kix(parent, String(child));
                }

        }

        return parent && parent.appendChild(child), child;
    }
    // return kix;
}


const KixSVG = createApp(createSVGElement);
export const kix = createApp(document.createElement.bind(document));
export default kix;
export const styleCssDom = kix(document.body, { style: "" });
export class Component { }
export const useListener = (objectValue, propertyName, callback) => {
    let closed = false;
    let callBackList = [];
    const listenerService = {
        addCallback(callback) {
            if (callback instanceof Function) {
                callBackList.push(callback)
            }
            return listenerService
        },
        removeCallback(callback) {
            callBackList = callBackList.filter(f => (f !== callback))
            return listenerService
        },
        close() {
            closed = true;
        },
        open() {
            closed = false;
        }
    }
    const registerFunction = (r) => (r(objectValue, propertyName));
    ((registration(registerFunction, (value) => {
        if (closed) return;
        for (const callback of callBackList) {
            callback(value, propertyName)
        }
    }))());

    return listenerService.addCallback(callback)
};
/////////////////////////////////////
function registration(registerFunction, onSet) {
    const getValue = () => (registerFunction(function () {
        return Array.prototype.reduce.call(arguments, (obj, key) => {
            let descriptor = Object.getOwnPropertyDescriptor(obj, key) || {},
                value = obj[key],
                defineRegistrations = descriptor?.set?._R_C || [];
            if (defineRegistrations.indexOf(registerFunction) === -1) {
                defineRegistrations.push(registerFunction);
                function set(setValue) {
                    value = setValue;
                    descriptor.set && descriptor.set(value)
                    onSet(value);
                }
                set._R_C = defineRegistrations
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return value;
                    },
                    set
                })
            }
            return obj[key]
        })
    }));
    return getValue
}
/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
დინამიური jsx კომპონენტების prop ები სარეგისტრაციო
*/
function registerProps(props, registerProps) {
    for (const attrKey in (registerProps || {})) {
        const getValue = registration(registerProps[attrKey], () => {
            props[attrKey] = getValue()
        })
        props[attrKey] = getValue()
    }
    return props;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
ანაცვლებს მასივურ ელემენტებს ახლით
*/
// document.getElementsById("test");

function replaceArrayNodes(nodes, values, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {

    while ((valuesIndex in values) || (nodeIndex in nodes)) {
        value = values[valuesIndex];
        node = nodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceArrayNodes(nodes, (value.length ? value : [""]), returnNodes, 0, nodeIndex);
        } else if (node) {
            console.log({ node, value, returnNodes });
            if (valuesIndex in values) {
                const replacedNodes = node.Replace(value)
                if (replacedNodes instanceof Array) {
                    returnNodes.push(...replacedNodes)
                } else {
                    returnNodes.push(replacedNodes)
                }
                returnNodes.push(node.Replace(value));
            } else {
                node.Remove();
            }
            nodeIndex++;
        } else {
            returnNodes.push(returnNodes[returnNodes.length - 1].Insert("after", value));
        }
        valuesIndex++;
    }
    return nodeIndex
}

/////////////////////////////////////////////////////////////////////////////////////
/*
აკეთებს დინამიური ფროფერთების რეგისტრაციას
*/
function propertyRegistry(registerFunction) {
    let currentNodes;
    return (parent, attribute) => {
        const getRenderValue = registration(registerFunction, (value) => {
            if (attribute) {
                parent.setAttr(attribute, getRenderValue(parent, attribute));
            } else {
                replaceArrayNodes(
                    currentNodes,
                    [getRenderValue(parent, attribute)],
                    (currentNodes = [])
                );
                // console.log("🚀 --> file: index.js --> line 374 --> getRenderValue --> currentNodes", currentNodes);
            }
        });

        const value = getRenderValue();
        if (attribute) {
            return value;
        }
        replaceArrayNodes(
            kix(parent, [""]),
            [value],
            (currentNodes = [])
        )
        return "";
    }
}
/////////////////////////////////////////////////////////////////////////////////////