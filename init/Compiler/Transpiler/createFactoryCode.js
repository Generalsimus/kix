import {
    type
} from "os";
import ts, {
    factory,
    SyntaxKind
} from "typescript";
import {
    getColumnName
} from "../../../helpers/utils";
import {
    App
} from "../../App";
import {
    codePolyfillPath,
    createObjectPropertyLoop,
    nodeModuleThree
} from "./utils";
const {
    createToken,
    createBinaryExpression,
    createVariableStatement,
    createVariableDeclarationList,
    createVariableDeclaration,
    createBlock,
    createIdentifier,
    createPropertyAccessExpression,
    createObjectLiteralExpression,
    createParameterDeclaration,
    createParenthesizedExpression,
    createArrowFunction,
    createCallExpression,
    createObjectBindingPattern,
    createBindingElement,
    createExpressionStatement,
    createElementAccessExpression,
    createForInStatement,
    createPropertyAssignment,
    createStringLiteral,
    createSpreadAssignment,
    createUniqueName,
    createReturnStatement,
} = factory;
const {
    PlusToken,
    EqualsToken
} = SyntaxKind;
export const generateFactory = {
    CREATE_Plus_Token_Nodes(Nodes) {
        return this.CREATE_Token_Nodes(Nodes, PlusToken);
    },
    CREATE_Equals_Token_Nodes(Nodes) {
        return this.CREATE_Token_Nodes(Nodes, EqualsToken);
    },
    CREATE_Token_Nodes(Nodes, Token) {
        return Nodes.reduce((NodeA, NodeB) => {
            return createBinaryExpression(this.CREATE_Identifier(NodeA), createToken(Token), this.CREATE_Identifier(NodeB));
        });
    },
    CREATE_Identifier(StringOrNode) {
        return typeof StringOrNode === "string" ?
            createIdentifier(StringOrNode) :
            StringOrNode;
    },
    CREATE_Parameter_Declaration(ArgumentsNodes) {
        return ArgumentsNodes.map((argNode) =>
            createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                this.CREATE_Identifier(argNode),
                undefined,
                undefined,
                undefined
            )
        );
    },
    // CREATE_Async_Import_Function(compilerOptions, moduleInfo) {
    //     return factory.createArrowFunction(
    //         undefined,
    //         undefined,
    //         [],
    //         undefined,
    //         factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    //         factory.createElementAccessExpression(
    //             factory.createIdentifier(compilerOptions.__Module_Window_Name),
    //             factory.createNumericLiteral(moduleInfo.moduleIndex)
    //         )
    //     )
    // },
    CREATE_Arrow_Function_With_Parenthesized_Expression(
        ClildNode,
        ArgumentsNodes
    ) {
        return createArrowFunction(
            undefined,
            undefined,
            this.CREATE_Parameter_Declaration(ArgumentsNodes),
            undefined,
            createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(ClildNode)
        );
    },
    CREATE_Prop_Registrator_For_Attribute(newNode, getRegistratorName) {

        return this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(getRegistratorName, [
            this.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [getRegistratorName])
        ]), [
            createUniqueName("__node"),
            createUniqueName("__atrName"),
            getRegistratorName,
        ]);
    },
    CREATE_Prop_Registrator_For_Child(newNode, getRegistratorName) {

        return this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(getRegistratorName, [
            this.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [getRegistratorName])
        ]), [
            createUniqueName("__node"),
            getRegistratorName
        ]);
    },
    CREATE_Object_Binding_Pattern(namesObject, returnValue = []) {
        for (const nameKey in namesObject) {
            const value = namesObject[nameKey];
            returnValue.push(
                createBindingElement(
                    undefined,
                    value && createIdentifier(nameKey),
                    (value && this.CREATE_Object_Binding_Pattern(value)) ||
                    createIdentifier(nameKey),
                    undefined
                )
            );
        }
        return createObjectBindingPattern(returnValue);
    },
    CREATE_CAll_Function(CallNameOrNode, Arguments) {
        return createCallExpression(
            this.CREATE_Identifier(CallNameOrNode),
            undefined,
            Arguments.map((arg) => this.CREATE_Identifier(arg))
        );
    },
    CREATE_Const_Variable(Nodes, flag = ts.NodeFlags.Const) {
        return createVariableStatement(
            undefined,
            createVariableDeclarationList(
                Nodes.map(([NameNode, ValueNode]) => {
                    return createVariableDeclaration(
                        NameNode,
                        undefined,
                        undefined,
                        ValueNode
                    );
                }),
                flag
            )
        );
    },
    CREATE_Object_WiTH_String_Keys(Nodes) {
        return createObjectLiteralExpression(
            Nodes.map(
                (ArgNodesOrNode) =>
                    ArgNodesOrNode instanceof Array ?
                        createPropertyAssignment.apply(null, ArgNodesOrNode) :
                        ArgNodesOrNode,
                false
            )
        );
    },
    CREATE_Spread_Assignment(Node) {
        return createSpreadAssignment(createParenthesizedExpression(Node));
    },
    CREATE_Assign_Polyfil(AppNameNode, Nodes) {
        return this.CREATE_Const_Variable([
            [
                AppNameNode,
                createArrowFunction(
                    undefined,
                    undefined,
                    this.CREATE_Parameter_Declaration(["n", "s"]),
                    undefined,
                    createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    createBlock(
                        [
                            createForInStatement(
                                createVariableDeclarationList(
                                    [
                                        createVariableDeclaration(
                                            createIdentifier("o"),
                                            undefined,
                                            undefined,
                                            undefined
                                        ),
                                    ],
                                    ts.NodeFlags.Const
                                ),
                                createIdentifier("s"),
                                createBlock(
                                    [
                                        createExpressionStatement(
                                            this.CREATE_Token_Nodes([
                                                this.CREATE_Element_Access_Expression(["n", "o"]),
                                                this.CREATE_Element_Access_Expression(["s", "o"])
                                            ], ts.SyntaxKind.EqualsToken)
                                        )
                                    ],
                                    false
                                )
                            ),
                        ],
                        false
                    )
                ),
            ],
        ]);
    },
    CREATE_Property_Access_Expression(propertys) {
        return propertys.reduce((propName1, propName2) => {
            return createPropertyAccessExpression(
                this.CREATE_Identifier(propName1),
                this.CREATE_Identifier(propName2),
            );
        });
    },
    CREATE_Element_Access_Expression(propertys) {
        return propertys.reduce((propName1, propName2) => {
            return createElementAccessExpression(
                this.CREATE_Identifier(propName1),
                this.CREATE_Identifier(propName2),
            );
        });
    },
    CREATE_Property_Access_Equals_Token(Node, decoratorPropertys = []) {
        return this.CREATE_Equals_Token_Nodes([
            this.CREATE_Property_Access_Expression(decoratorPropertys),
            Node,
        ]);
    },
    CREATE_Export_File_Function(
        body,
        __Import_Module_Name,
        moduleIndex
    ) {
        return this.CREATE_CAll_Function(__Import_Module_Name + "_Module", [
            factory.createNumericLiteral(moduleIndex),
            factory.createArrowFunction(
                undefined,
                undefined,
                this.CREATE_Parameter_Declaration(["exports"]),
                undefined,
                factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(body, true)
            )
        ]);
    },

    CREATE_Bind_Function(Name, ClildNode, ArgumentsNodes) {
        return factory.createFunctionDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier(Name),
            undefined,
            this.CREATE_Parameter_Declaration(ArgumentsNodes),
            undefined,
            factory.createBlock(ClildNode, true)
        );
    },
    CREATE_Module_GET_POLYFIL(__Import_Module_Name) {
        return this.CREATE_Const_Variable([
            [
                __Import_Module_Name + "_Module",
                this.CREATE_Arrow_Function_With_Parenthesized_Expression(
                    this.CREATE_CAll_Function(
                        this.CREATE_Property_Access_Expression(["Object", "defineProperty"]),
                        [
                            __Import_Module_Name,
                            "accessKey",
                            this.CREATE_Object_WiTH_String_Keys([
                                [
                                    "get",
                                    this.CREATE_Arrow_Function_With_Parenthesized_Expression(
                                        this.CREATE_Token_Nodes([
                                            factory.createIdentifier("exported"),
                                            this.CREATE_Token_Nodes([
                                                this.CREATE_CAll_Function("moduleBlockFunction", [
                                                    this.CREATE_Token_Nodes([
                                                        factory.createIdentifier("exported"),
                                                        this.CREATE_Object_WiTH_String_Keys([])
                                                    ], ts.SyntaxKind.EqualsToken)
                                                ]),
                                                factory.createIdentifier("exported")
                                            ],
                                                ts.SyntaxKind.CommaToken
                                            )
                                        ], ts.SyntaxKind.BarBarToken),
                                        []
                                    )
                                ]
                            ])
                        ]
                    ),
                    [
                        "accessKey",
                        "moduleBlockFunction",
                        "exported",
                    ]
                ),
            ]
        ])
    },
    CREATE_Async_Module_SourceFile(sourceFile, moduleInfo, compilerOptions) {
        const polyfillModuleInfo = nodeModuleThree.get(codePolyfillPath)
        /*
        sadas[2a] = (url)=>mod.ss(url,()=>location)
        */
        return ts.updateSourceFileNode(sourceFile, [
            factory.createExpressionStatement(
                this.CREATE_Token_Nodes([
                    this.CREATE_Element_Access_Expression([
                        compilerOptions.__Import_Module_Name,
                        /* a === async */
                        factory.createStringLiteral(moduleInfo.moduleIndex + "a")
                    ]),
                    this.CREATE_Arrow_Function_With_Parenthesized_Expression(
                        this.CREATE_CAll_Function(
                            this.CREATE_Element_Access_Expression([
                                polyfillModuleInfo.__Module_Window_Name,
                                /* a === async */
                                factory.createStringLiteral("A")
                            ]),
                            ["u"]
                        ),
                        ["u"]
                    )
                ], ts.SyntaxKind.EqualsToken)

            )
        ])
    }
};