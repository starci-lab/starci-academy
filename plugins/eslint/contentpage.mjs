/**
 * Path-scoped regression: reject `Box` layout `className` on ContentPage and
 * ContentArticle product files. Stories keep fixture wrappers. Box remains a
 * global foreign-mount escape hatch elsewhere — this rule does not ban Box app-wide.
 *
 * Diagnostics refer to singular `principle` (never plural terminology).
 */

/** True when the file is a ContentPage or ContentArticle product implementation (not a story). */
export const isContentPageProductFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  if (file.includes(".stories.") || file.includes("/stories/")) return false
  return (
    /\/pages\/ContentPage\/(ContentPage\.tsx|component\.tsx|index\.tsx)$/.test(file) ||
    /\/starci\/pages\/ContentPage\/ContentPage\.tsx$/.test(file) ||
    /\/ContentArticle\/(ContentArticle\.tsx|index\.tsx)$/.test(file)
  )
}

/**
 * Ban `<Box className=...>` / `<Box classNames=...>` inside ContentPage /
 * ContentArticle product files. Prefer a named frame (`HideAbove`, `PageEndPad`,
 * `Container`) or composite (`LockedContentMask`), or one semantic `principle`
 * on an honest frame — never a raw CSS string on Box for page/article layout.
 */
export const noContentPageBoxClassName = {
  meta: {
    type: "problem",
    docs: {
      description:
        "ContentPage/ContentArticle must not use Box className for layout CSS — use a named frame/composite or one semantic principle.",
    },
    schema: [],
    messages: {
      boxClass:
        "ContentPage/ContentArticle must not put page/layout CSS on `Box` via `{{prop}}`. Own the decision on a named frame/composite, or one semantic `principle` on an honest frame — do not use `Box` as a layout escape hatch here.",
    },
  },
  create(context) {
    const file = context.filename || context.getFilename()
    if (!isContentPageProductFile(file)) return {}
    return {
      JSXOpeningElement(node) {
        const name =
          node.name && node.name.type === "JSXIdentifier" ? node.name.name : null
        if (name !== "Box") return
        for (const attr of node.attributes || []) {
          if (attr.type !== "JSXAttribute" || !attr.name || attr.name.type !== "JSXIdentifier") continue
          const prop = attr.name.name
          if (prop !== "className" && prop !== "classNames") continue
          context.report({ node: attr, messageId: "boxClass", data: { prop } })
        }
      },
    }
  },
}
