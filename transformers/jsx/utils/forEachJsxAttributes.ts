import ts from "typescript";
import { stringLiteral } from "../../factoryCode/stringLiteral";
import { safeInitializer } from "./safeInitializer";

export const forEachJsxAttributes = (
  attributeProperties: ts.JsxAttributes["properties"],
  forEachCallback: (attributeName: ts.Identifier | string, attributeValueNode: ts.Expression) => void
) => {
  for (const attribute of attributeProperties) {
    if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
      const attributeName = attribute.name;
      let attributeValueNode = safeInitializer(attribute.initializer);
      if (!attributeValueNode) continue;
      if (ts.isJsxText(attributeValueNode)) {
        attributeValueNode = stringLiteral(attributeValueNode.text);
        // attributeValueNode = stringLiteral(attributeValueNode.getText())
      }

      const attributeNameSafe = ts.isJsxNamespacedName(attributeName) ? `${ts.idText(attributeName.namespace)}:${ts.idText(attributeName.name)}` : attributeName

      forEachCallback(attributeNameSafe, attributeValueNode);

    }
  }
};
