import ts from "typescript";
import { CustomContextType } from "..";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";

export const ArrowFunction = createGlobalBlockNodesVisitor(
    (visitedNode: ts.ArrowFunction, declarationVariableNode, context) => {

        return context.factory.updateArrowFunction(
            visitedNode,
            visitedNode.modifiers,
            visitedNode.typeParameters,
            visitedNode.parameters,
            visitedNode.type,
            visitedNode.equalsGreaterThanToken,
            ConciseBodyToMultiLineBlock(visitedNode.body, context, [
                declarationVariableNode,
            ]),
        )
    }
)

const ConciseBodyToMultiLineBlock = (body: ts.ConciseBody, context: CustomContextType, addStatement: ts.Statement[] = []) => {
    if (ts.isBlock(body)) {
        return context.factory.updateBlock(body, [...addStatement, ...body.statements])
    }

    return context.factory.createBlock([
        ...addStatement,
        context.factory.createReturnStatement(body)
    ], true)
}