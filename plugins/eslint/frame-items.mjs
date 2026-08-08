/** Frame item contracts that cannot be laundered through fragments. */

const FRAME_NAMES = new Set(["StackH", "StackV", "Grid"])

/** Return the simple JSX element name, or null for a complex member expression. */
const jsxName = (openingElement) => {
  const name = openingElement?.name
  return name?.type === "JSXIdentifier" ? name.name : null
}

/** Count rendered JSX children in a fragment, ignoring whitespace and comments. */
const fragmentChildCount = (fragment) => fragment.children.filter((child) => (
  child.type === "JSXElement"
  || child.type === "JSXFragment"
  || (child.type === "JSXExpressionContainer" && child.expression.type !== "JSXEmptyExpression")
)).length

/** Whether an item expression returns a multi-child fragment directly. */
const directFragment = (expression) => (
  expression?.type === "ArrowFunctionExpression"
  && expression.body.type === "JSXFragment"
  && fragmentChildCount(expression.body) > 1
)

/** ESLint rule: one typed frame item must build one item, not hide siblings in a fragment. */
export const noFrameFragmentItem = {
  meta: {
    type: "problem",
    docs: {
      description: "A typed frame item builds one semantic item; a multi-child fragment must be expressed as nested frames/items.",
    },
    schema: [],
    messages: {
      fragment: "One frame item returns multiple siblings through a fragment. Model each sibling as an item or introduce the honest nested frame; fragments must not launder the typed items contract.",
    },
  },
  create(context) {
    const multiFragmentVariables = new Set()

    return {
      VariableDeclarator(node) {
        if (
          node.id.type === "Identifier"
          && node.init?.type === "JSXFragment"
          && fragmentChildCount(node.init) > 1
        ) {
          multiFragmentVariables.add(node.id.name)
        }
      },
      JSXOpeningElement(node) {
        if (!FRAME_NAMES.has(jsxName(node))) return
        const items = node.attributes.find((attribute) => (
          attribute.type === "JSXAttribute"
          && attribute.name.type === "JSXIdentifier"
          && attribute.name.name === "items"
        ))
        const expression = items?.value?.type === "JSXExpressionContainer"
          ? items.value.expression
          : null
        if (expression?.type !== "ArrayExpression") return

        for (const item of expression.elements) {
          if (!item || item.type === "SpreadElement") continue
          if (directFragment(item)) {
            context.report({ node: item, messageId: "fragment" })
            continue
          }
          if (
            item.type === "ArrowFunctionExpression"
            && item.body.type === "Identifier"
            && multiFragmentVariables.has(item.body.name)
          ) {
            context.report({ node: item, messageId: "fragment" })
          }
        }
      },
    }
  },
}
