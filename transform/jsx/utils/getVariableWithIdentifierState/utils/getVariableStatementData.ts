import ts from "typescript";
import { CustomContextType, VariableDeclarationNodeType, variableDeclarationType } from "../../../..";

export const getVariableStatementData = (context: CustomContextType, node: ts.VariableStatement) => {
    let substituteBlockData = context.substituteNodesData.get(node)
    if (!substituteBlockData) {
        context.substituteNodesData.set(node, (substituteBlockData = {
            addAfterVariableDeclaration: new Map()
        }));
    }
    return substituteBlockData
}