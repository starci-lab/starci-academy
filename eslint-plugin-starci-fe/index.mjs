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

export default {
  meta: { name: "eslint-plugin-starci-fe", version: "0.2.0" },
  rules: {
    "no-fractional-spacing": noFractionalSpacing,
    "no-adjacent-chip": noAdjacentChip,
    "no-modal-title-classname": noModalTitleClassname,
    "no-hero-heading-class": noHeroHeadingClass,
    "no-arbitrary-token": noArbitraryToken,
  },
}
