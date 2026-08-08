/**
 * Public house-component contract rules.
 *
 * A public StarCi component owns its intrinsic appearance. Parent layout
 * is expressed by the parent frame/principle, not by a public className door.
 * Vendor wrappers and the documented Box foreign-mount remain boundaries.
 */

const HOUSE_IMPORT = /(?:^|\/)components\//
const PUBLIC_COMPONENT_FILE = /\/components\//
const VENDOR_BOUNDARY_FILE = [
  /\/components\/frames\/Box(?:\/|$)/,
  /\/components\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)(?:\/|$)/,
]
const FORBIDDEN_PROPS = new Set(["className", "classNames"])

const sourceValue = (node) => (node?.value == null ? "" : String(node.value).replace(/\\/g, "/"))

/** Normalize alias imports so vendor-boundary path checks match src. */
const normalizeHouseImportPath = (source) => {
  const file = sourceValue({ value: source })
  if (file.startsWith("@/components/")) return `/components/${file.slice("@/components/".length)}`
  const idx = file.indexOf("/components/")
  return idx >= 0 ? file.slice(idx) : file
}

const isPublicComponentFile = (filename) => PUBLIC_COMPONENT_FILE.test(String(filename || "").replace(/\\/g, "/"))

const isProductFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  return file.includes("/src/")
}

const isVendorBoundaryFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  return VENDOR_BOUNDARY_FILE.some((pattern) => pattern.test(file))
}

const isVendorBoundaryImport = (source) => {
  const normalized = normalizeHouseImportPath(source)
  return VENDOR_BOUNDARY_FILE.some((pattern) => pattern.test(normalized))
}

const propertyName = (node) => {
  if (!node) return null
  const key = node.key ?? node.property
  if (!key) return null
  if (key.type === "Identifier") return key.name
  if (key.type === "Literal" && typeof key.value === "string") return key.value
  return null
}

const reportPattern = (pattern, report) => {
  if (!pattern) return
  if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties || []) {
      if (property.type === "RestElement") {
        reportPattern(property.argument, report)
        continue
      }
      const name = propertyName(property)
      if (FORBIDDEN_PROPS.has(name)) report(property, name)
    }
  }
}

export const noPublicClassNameProp = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Public StarCi components must not expose className/classNames placement doors; parent layout owns placement.",
    },
    schema: [],
    messages: {
      declaration:
        "Public house component prop `{{prop}}` is forbidden. Parent layout owns placement; expose a semantic variant or use a named wrapper.",
      usage:
        "Do not pass `{{prop}}` to house component `{{component}}`. Parent layout owns placement; use the parent principle or a named wrapper.",
      withClassNames:
        "`WithClassNames<...>` is forbidden on a public house component. Replace the CSS door with a semantic API or named wrapper.",
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename()
    if (!isProductFile(filename) || isVendorBoundaryFile(filename)) return {}
    const enforceDeclarations = isPublicComponentFile(filename)

    const houseBindings = new Set()
    const vendorBindings = new Set()
    const reportProp = (node, prop) => context.report({ node, messageId: "declaration", data: { prop } })

    return {
      ImportDeclaration(node) {
        const source = sourceValue(node.source)
        if (!HOUSE_IMPORT.test(source)) return
        const vendor = isVendorBoundaryImport(source)
        for (const specifier of node.specifiers || []) {
          if (!specifier.local?.name) continue
          houseBindings.add(specifier.local.name)
          if (vendor) vendorBindings.add(specifier.local.name)
        }
      },

      TSPropertySignature(node) {
        if (!enforceDeclarations) return
        const name = propertyName(node)
        if (FORBIDDEN_PROPS.has(name)) reportProp(node, name)
      },

      TSInterfaceDeclaration(node) {
        if (!enforceDeclarations) return
        for (const heritage of node.extends || []) {
          const name = heritage.expression?.type === "Identifier" ? heritage.expression.name : null
          if (name === "WithClassNames") context.report({ node: heritage, messageId: "withClassNames" })
        }
      },

      TSTypeReference(node) {
        if (!enforceDeclarations) return
        if (node.typeName?.type === "Identifier" && node.typeName.name === "WithClassNames") {
          context.report({ node, messageId: "withClassNames" })
        }
      },

      ArrowFunctionExpression(node) {
        if (!enforceDeclarations) return
        for (const parameter of node.params || []) {
          reportPattern(parameter, reportProp)
        }
      },

      FunctionDeclaration(node) {
        if (!enforceDeclarations) return
        for (const parameter of node.params || []) {
          reportPattern(parameter, reportProp)
        }
      },

      FunctionExpression(node) {
        if (!enforceDeclarations) return
        for (const parameter of node.params || []) {
          reportPattern(parameter, reportProp)
        }
      },

      JSXOpeningElement(node) {
        const component = node.name?.type === "JSXIdentifier" ? node.name.name : null
        if (!component || !houseBindings.has(component)) return
        // Vendor wrappers + Box are documented CSS mount points — callers may pass className.
        if (vendorBindings.has(component)) return
        for (const attribute of node.attributes || []) {
          if (attribute.type !== "JSXAttribute") continue
          const prop = attribute.name?.type === "JSXIdentifier" ? attribute.name.name : null
          if (FORBIDDEN_PROPS.has(prop)) {
            context.report({ node: attribute, messageId: "usage", data: { prop, component } })
          }
        }
      },
    }
  },
}
