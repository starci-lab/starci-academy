/**
 * eslint-plugin-starci-fe — luật MÁY cho trục-1 cơ học của canon 3-trục.
 *
 * Đây là tầng ENFORCEMENT (xem `.claude/fe/methodology/enforcement.md`): mỗi rule ở đây
 * "giết" 1 dòng trong `.claude/fe/enforcement/lint-candidates.md` — pattern lệch mà audit-LLM
 * từng phải soi tay, giờ máy bắt tại lúc-gõ / pre-commit / CI. "Audit tìm 1 lần, lint giữ mãi."
 *
 * v1 nhắm các luật CHÍNH XÁC (ít false-positive). Mở rộng dần khi codebase xanh.
 */

/** Lấy chuỗi className tĩnh từ 1 JSXAttribute (string literal hoặc template quasi thuần). */
function classNameText(node) {
  if (!node || !node.value) return null
  const v = node.value
  if (v.type === "Literal" && typeof v.value === "string") return v.value
  if (v.type === "JSXExpressionContainer") {
    const e = v.expression
    if (e.type === "Literal" && typeof e.value === "string") return e.value
    if (e.type === "TemplateLiteral") return e.quasis.map((q) => q.value.cooked).join(" ")
  }
  return null
}

function isClassAttr(node) {
  return node.type === "JSXAttribute" && node.name && (node.name.name === "className" || node.name.name === "class")
}

/** Tên component của 1 JSXElement (Chip, Chip.Label, ModalShell…). */
function elementName(opening) {
  const n = opening && opening.name
  if (!n) return null
  if (n.type === "JSXIdentifier") return n.name
  if (n.type === "JSXMemberExpression") {
    const obj = n.object && n.object.name
    const prop = n.property && n.property.name
    return obj && prop ? `${obj}.${prop}` : obj || null
  }
  return null
}

// L4 — off-scale spacing: fractional Tailwind (gap-1.5, p-2.5, space-y-1.5…). Thang StarCi = 0·2·3·6·8(+4);
// fractional KHÔNG BAO GIỜ đúng thang → bắt chắc, 0 false-positive.
const FRACTIONAL = /\b(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|space-x|space-y|inset|top|bottom|left|right)-\d+\.5\b/g

const noFractionalSpacing = {
  meta: {
    type: "problem",
    docs: { description: "Cấm spacing lẻ (fractional, vd gap-1.5) — thang StarCi = 0·2·3·6·8. [[enforcement L4]]" },
    schema: [],
    messages: { frac: "Spacing lẻ '{{cls}}' ngoài thang 0·2·3·6·8 — dùng nấc gần nhất (vd gap-1.5 → gap-2)." },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!isClassAttr(node)) return
        const text = classNameText(node)
        if (!text) return
        const m = text.match(FRACTIONAL)
        if (m) for (const cls of new Set(m)) context.report({ node, messageId: "frac", data: { cls } })
      },
    }
  },
}

// L3 — chip-cạnh-chip: ≥2 <Chip> sibling trực tiếp trong 1 cụm = vi phạm (1 cụm meta tối đa 1 chip).
const noAdjacentChip = {
  meta: {
    type: "problem",
    docs: { description: "Cấm ≥2 <Chip> kề nhau trong 1 cụm — 1 cụm meta tối đa 1 chip. [[enforcement L3]]" },
    schema: [],
    messages: { adj: "≥2 <Chip> kề nhau — giữ 1 chip (trục phân loại chính), phần còn lại để text + icon inline." },
  },
  create(context) {
    return {
      JSXElement(node) {
        const chips = node.children.filter(
          (c) => c.type === "JSXElement" && elementName(c.openingElement) === "Chip"
        )
        if (chips.length >= 2) context.report({ node: chips[1], messageId: "adj" })
      },
    }
  },
}

// L2 — header anatomy: cấm escape-hatch `titleClassName` (nâng header modal thành hero/H-scale).
const noModalTitleClassname = {
  meta: {
    type: "problem",
    docs: { description: "Cấm prop titleClassName trên Modal/Shell — header = Typography body semibold default. [[enforcement L2]]" },
    schema: [],
    messages: { tc: "Bỏ `titleClassName` — để ModalShell render header default (body semibold); đừng nâng thành hero/H-scale." },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name && node.name.name === "titleClassName") context.report({ node, messageId: "tc" })
      },
    }
  },
}

// L2b — hero heading class: text-{xl,2xl,3xl} + font-bold trên 1 element = heading hand-roll → Typography.
const HERO = /\btext-(?:xl|2xl|3xl|4xl)\b/
const noHeroHeadingClass = {
  meta: {
    type: "suggestion",
    docs: { description: "text-xl+/font-bold hand-roll = heading → dùng <Typography type>. [[enforcement L2/L6]]" },
    schema: [],
    messages: { hero: "Heading hand-roll (text-xl+ + font-bold) — dùng <Typography type=\"h3|h4\"> thay className thô." },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!isClassAttr(node)) return
        const text = classNameText(node)
        if (text && HERO.test(text) && /\bfont-bold\b/.test(text)) context.report({ node, messageId: "hero" })
      },
    }
  },
}

// L4b/token — arbitrary Tailwind value = thoát token-system. Tailwind v4 sinh spacing bằng calc
// (không prune-enum được), nên chặn "cửa hậu": `gap-[7px]` (ngoài scale) + `text-[#hex]` (ngoài semantic color).
// 'warn' — có ca hợp lệ (vd % / px canh chỉnh, brand hex) → dùng eslint-disable + lý do.
const ARBITRARY_SPACING = /\b(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|space-x|space-y)-\[[^\]]+\]/
const HEX_COLOR = /\b(?:text|bg|border|ring|from|to|via|fill|stroke|shadow)-\[#[0-9a-fA-F]/
const noArbitraryToken = {
  meta: {
    type: "suggestion",
    docs: { description: "Cấm arbitrary spacing/hex-color (thoát token-system). [[enforcement token]]" },
    schema: [],
    messages: {
      space: "Arbitrary spacing '{{cls}}' — dùng nấc scale (0·2·3·6·8); ngoại lệ thật → eslint-disable + lý do.",
      hex: "Màu hex arbitrary '{{cls}}' — dùng token semantic (text-accent…); brand-color thật → eslint-disable + lý do.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!isClassAttr(node)) return
        const text = classNameText(node)
        if (!text) return
        const sp = text.match(ARBITRARY_SPACING)
        if (sp) context.report({ node, messageId: "space", data: { cls: sp[0] } })
        const hx = text.match(HEX_COLOR)
        if (hx) context.report({ node, messageId: "hex", data: { cls: hx[0] } })
      },
    }
  },
}

// ── authoring convention rules (trục viết-code, 2026-08) — mỗi rule = 1 luật `enforce/authoring/*` ──

// structure-and-naming §5 + "tên hàm phải là arrow": mọi hàm module-level là `const X = () => {}`,
// KHÔNG `function` declaration / `export default function`. Bắt FunctionDeclaration ở top-level.
const preferArrowExport = {
  meta: {
    type: "suggestion",
    docs: { description: "Hàm module-level dùng arrow const, không `function` declaration. [[structure-and-naming §5]]" },
    schema: [],
    messages: { fn: "Dùng arrow const `const {{name}} = (…) => {…}` — không `function` ở module-level (structure-and-naming §5)." },
  },
  create(context) {
    return {
      FunctionDeclaration(node) {
        const p = node.parent && node.parent.type
        if (p === "Program" || p === "ExportNamedDeclaration" || p === "ExportDefaultDeclaration") {
          context.report({ node: node.id || node, messageId: "fn", data: { name: (node.id && node.id.name) || "default" } })
        }
      },
    }
  },
}

// comments.md §3: mọi thứ EXPORT (component/hook/helper/const/interface) mở đầu bằng 1 JSDoc `/** */`.
const requireExportJsdoc = {
  meta: {
    type: "suggestion",
    docs: { description: "Khai báo export mở đầu bằng JSDoc `/** */`. [[comments §3]]" },
    schema: [],
    messages: { jsdoc: "Thêm JSDoc `/** … */` cho export `{{name}}` — role/what-it-does (comments §3)." },
  },
  create(context) {
    const sc = context.sourceCode || context.getSourceCode()
    const hasJsdoc = (node) =>
      sc.getCommentsBefore(node).some((c) => c.type === "Block" && c.value.startsWith("*"))
    const check = (node) => {
      const d = node.declaration
      if (!d) return // re-export `export { X }` — skip
      const kinds = ["VariableDeclaration", "TSInterfaceDeclaration", "FunctionDeclaration", "TSTypeAliasDeclaration"]
      if (!kinds.includes(d.type)) return
      if (hasJsdoc(node)) return
      const id = d.id || (d.declarations && d.declarations[0] && d.declarations[0].id)
      context.report({ node: id || d, messageId: "jsdoc", data: { name: (id && id.name) || "?" } })
    }
    return { ExportNamedDeclaration: check, ExportDefaultDeclaration: check }
  },
}

// react-idioms §7: handler đặt tên `onXxx`, KHÔNG `handleXxx` (biến cục bộ lẫn prop).
const handlerOnPrefix = {
  meta: {
    type: "suggestion",
    docs: { description: "Handler đặt tên `onXxx`, không `handleXxx`. [[react-idioms §7]]" },
    schema: [],
    messages: { handle: "`{{name}}` → đặt `on{{rest}}` (handler là `onXxx`, không `handleXxx` — react-idioms §7)." },
  },
  create(context) {
    const flag = (node, name) => {
      if (name && /^handle[A-Z]/.test(name)) {
        context.report({ node, messageId: "handle", data: { name, rest: name.slice("handle".length) } })
      }
    }
    return {
      VariableDeclarator(node) { if (node.id && node.id.type === "Identifier") flag(node.id, node.id.name) },
      JSXAttribute(node) { if (node.name) flag(node.name, node.name.name) },
    }
  },
}

// structure-and-naming §1/§5: 1 folder PascalCase = 1 `index.tsx`, có 1 named-export TRÙNG tên folder.
const exportMatchesFolder = {
  meta: {
    type: "suggestion",
    docs: { description: "index.tsx trong folder PascalCase phải export tên trùng folder. [[structure-and-naming §1/§5]]" },
    schema: [],
    messages: { mismatch: "index.tsx của folder `{{folder}}` không export `{{folder}}` (đang export: {{names}}) — named export phải trùng tên folder (structure-and-naming §5)." },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    const m = file.match(/\/([A-Z][A-Za-z0-9]*)\/index\.tsx?$/)
    if (!m) return {}
    const folder = m[1]
    const names = new Set()
    return {
      ExportNamedDeclaration(node) {
        const d = node.declaration
        if (d && d.type === "VariableDeclaration") d.declarations.forEach((dec) => dec.id && dec.id.name && names.add(dec.id.name))
        if (d && d.type === "FunctionDeclaration" && d.id) names.add(d.id.name)
        if (node.specifiers) node.specifiers.forEach((s) => s.exported && s.exported.name && names.add(s.exported.name))
      },
      "Program:exit"(node) {
        if (names.size > 0 && !names.has(folder)) {
          context.report({ node, messageId: "mismatch", data: { folder, names: [...names].join(", ") } })
        }
      },
    }
  },
}

export default {
  meta: { name: "eslint-plugin-starci-fe", version: "0.3.0" },
  rules: {
    "no-fractional-spacing": noFractionalSpacing,
    "no-adjacent-chip": noAdjacentChip,
    "no-modal-title-classname": noModalTitleClassname,
    "no-hero-heading-class": noHeroHeadingClass,
    "no-arbitrary-token": noArbitraryToken,
    "prefer-arrow-export": preferArrowExport,
    "require-export-jsdoc": requireExportJsdoc,
    "handler-on-prefix": handlerOnPrefix,
    "export-matches-folder": exportMatchesFolder,
  },
}
