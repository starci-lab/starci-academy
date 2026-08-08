/**
 * Forbid CSS-door laundering through TypeScript utility types and layout-tier
 * inheritance of rendered-component props.
 *
 * `Omit<T, "className">` is not closure — it hides a placement door while the
 * owning component still exposes it. Layouts/pages must not extend or nest
 * NavbarProps/FooterProps, and must not spread opaque bags into Navbar/Footer.
 */

const CSS_DOOR_KEYS = new Set(["className", "classNames"])
const SHELL_PROP_TYPES = new Set(["NavbarProps", "FooterProps"])
const SHELL_COMPONENTS = new Set(["Navbar", "Footer"])
const UTILITY_NAMES = new Set(["Omit", "Pick", "Exclude"])

const LAYOUT_PAGE_DIRS = "(?:layouts|pages)"

/** True for src / Storybook layout and page component files. */
export const isLayoutOrPageFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  if (new RegExp(`/src/components/${LAYOUT_PAGE_DIRS}/`).test(file)) return true
  if (new RegExp(`/\\.storybook/components/${LAYOUT_PAGE_DIRS}/`).test(file)) return true
  if (new RegExp(`/\\.storybook/components/[^/]+/${LAYOUT_PAGE_DIRS}/`).test(file)) return true
  return false
}

/** True for product or Storybook TypeScript trees. */
const isProductOrStorybookFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  return file.includes("/src/") || file.includes("/.storybook/")
}

/** Literal string from a TS type node when it is a simple string literal. */
const typeLiteralString = (node) => {
  if (!node) return null
  if (node.type === "TSLiteralType" && node.literal?.type === "Literal" && typeof node.literal.value === "string") {
    return node.literal.value
  }
  return null
}

/** Collect string literals from a union / single literal type used as Omit/Pick keys. */
const collectKeyLiterals = (node, out) => {
  if (!node) return
  if (node.type === "TSUnionType") {
    for (const member of node.types || []) collectKeyLiterals(member, out)
    return
  }
  const lit = typeLiteralString(node)
  if (lit != null) out.push(lit)
}

/** Identifier name from a type reference or expression. */
const typeName = (node) => {
  if (!node) return null
  if (node.type === "TSTypeReference") {
    const name = node.typeName
    if (name?.type === "Identifier") return name.name
    if (name?.type === "TSQualifiedName" && name.right?.type === "Identifier") return name.right.name
  }
  if (node.type === "Identifier") return node.name
  return null
}

/** JSX element / member tag name for shell components. */
const jsxTagName = (opening) => {
  const name = opening?.name
  if (!name) return null
  if (name.type === "JSXIdentifier") return name.name
  if (name.type === "JSXMemberExpression" && name.property?.type === "JSXIdentifier") {
    return name.property.name
  }
  return null
}

/**
 * Report utility-type hiding of className/classNames for an Omit/Pick/Exclude
 * invocation described by `utilityName` + type-argument params.
 */
const reportUtilityKeys = (context, reportNode, utilityName, params) => {
  if (!UTILITY_NAMES.has(utilityName) || !params || params.length < 2) return false
  const keys = []
  collectKeyLiterals(params[1], keys)
  const hit = keys.find((k) => CSS_DOOR_KEYS.has(k))
  if (!hit) return false
  context.report({
    node: reportNode,
    messageId: "utilityHide",
    data: { utility: utilityName, prop: hit },
  })
  return true
}

/** Report shell prop-type inheritance at layout/page tiers. */
const reportShellType = (context, node, name) => {
  if (!name || !SHELL_PROP_TYPES.has(name)) return
  context.report({ node, messageId: "shellInherit", data: { type: name } })
}

export const noCssDoorTypeLaundering = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbid utility-type hiding of className/classNames and Navbar/Footer prop inheritance at layout/page tiers.",
    },
    schema: [],
    messages: {
      utilityHide:
        "`{{utility}}` of `{{prop}}` is CSS-door laundering, not closure. Remove `{{prop}}` from the owning component's public props and every consumer.",
      shellInherit:
        "Do not inherit `{{type}}` on a layout/page contract. Prefer `ComponentTypeWithSkeleton` slots, or declare explicit named data props — never extend or nest the rendered component's props.",
      shellSpread:
        "Do not spread props into `{{component}}` from a layout/page. Pass an explicit slot or named data props so CSS doors cannot ride along.",
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename()
    if (!isProductOrStorybookFile(filename)) return {}
    const layoutOrPage = isLayoutOrPageFile(filename)

    const checkUtilityReference = (node) => {
      const name = typeName(node)
      if (!UTILITY_NAMES.has(name)) return
      const params = node.typeArguments?.params || node.typeParameters?.params
      reportUtilityKeys(context, node, name, params)
      if (layoutOrPage && params?.[0]) {
        reportShellType(context, params[0], typeName(params[0]))
      }
    }

    return {
      TSTypeReference(node) {
        checkUtilityReference(node)
        if (layoutOrPage) {
          // Nested `navbar: NavbarProps` is caught via TSPropertySignature; direct
          // references inside utilities are handled above.
        }
      },

      TSInterfaceHeritage(node) {
        if (!layoutOrPage) return
        const exprName = node.expression?.type === "Identifier" ? node.expression.name : null
        const params = node.typeArguments?.params || []
        if (exprName && UTILITY_NAMES.has(exprName)) {
          reportUtilityKeys(context, node, exprName, params)
          if (params[0]) reportShellType(context, params[0], typeName(params[0]))
          return
        }
        if (exprName) reportShellType(context, node, exprName)
      },

      TSTypeAliasDeclaration(node) {
        if (!layoutOrPage) return
        const ann = node.typeAnnotation
        if (!ann) return
        if (ann.type === "TSIntersectionType") {
          for (const part of ann.types || []) reportShellType(context, part, typeName(part))
        } else if (ann.type === "TSTypeReference" && !UTILITY_NAMES.has(typeName(ann))) {
          reportShellType(context, ann, typeName(ann))
        }
      },

      TSPropertySignature(node) {
        if (!layoutOrPage) return
        const ann = node.typeAnnotation?.typeAnnotation
        if (!ann) return
        reportShellType(context, ann, typeName(ann))
      },

      JSXOpeningElement(node) {
        if (!layoutOrPage) return
        const tag = jsxTagName(node)
        if (!tag || !SHELL_COMPONENTS.has(tag)) return
        for (const attr of node.attributes || []) {
          if (attr.type === "JSXSpreadAttribute") {
            context.report({ node: attr, messageId: "shellSpread", data: { component: tag } })
          }
        }
      },
    }
  },
}
