/**
 * eslint-plugin-starci-fe — luật MÁY cho trục-1 cơ học của canon 3-trục.
 *
 * Đây là tầng ENFORCEMENT (xem `.claude/fe/methodology/enforcement.md`): mỗi rule ở đây
 * "giết" 1 dòng trong `.claude/fe/enforcement/lint-candidates.md` — pattern lệch mà audit-LLM
 * từng phải soi tay, giờ máy bắt tại lúc-gõ / pre-commit / CI. "Audit tìm 1 lần, lint giữ mãi."
 *
 * v1 nhắm các luật CHÍNH XÁC (ít false-positive). Mở rộng dần khi codebase xanh.
 */
import { existsSync } from "node:fs"
import { join } from "node:path"

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

/** Lấy string literal tĩnh từ 1 JSXAttribute (Literal hoặc JSXExpressionContainer bọc Literal). */
function attrStringLiteral(node) {
  const v = node && node.value
  if (!v) return null
  if (v.type === "Literal" && typeof v.value === "string") return v.value
  if (v.type === "JSXExpressionContainer" && v.expression && v.expression.type === "Literal" && typeof v.expression.value === "string") {
    return v.expression.value
  }
  return null
}

// ── tier map dùng chung — suy tier từ ĐƯỜNG DẪN FILE, không phải nội dung ──
// vocabulary: atoms/frames/composites (bọc vendor + ghép leaf, không quyết layout/data).
// sentence: blocks/pages/layouts/overlays (ghép câu, không tự vẽ hình/gọi data).
// Không còn nhà tạm: `features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes` đã rỗng và
// bị xoá, nên bốn tên dưới đây là TOÀN BỘ tầng câu — thêm một thư mục mới cạnh chúng là lách cổng.
// Bất cứ gì NGOÀI `src/components/**` (route app/, hook, module) KHÔNG PHẢI 1 component tier —
// mỗi rule dùng helper này tự nói rõ trong comment nó bỏ qua phạm vi đó hay không.
const VOCAB_TIER_DIRS = new Set(["atoms", "frames", "composites"])
const SENTENCE_TIER_DIRS = new Set(["blocks", "pages", "layouts", "overlays"])

/** "vocabulary" | "sentence" | null (null = ngoài src/components/** hoặc thư mục tier không xác định). */
function componentTier(filename) {
  const file = (filename || "").replace(/\\/g, "/")
  const m = file.match(/\/src\/components\/([^/]+)\//)
  if (!m) return null
  const dir = m[1]
  if (VOCAB_TIER_DIRS.has(dir)) return "vocabulary"
  if (SENTENCE_TIER_DIRS.has(dir)) return "sentence"
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

// ── tier rules (refactor tuần này, 2026-08) — mỗi rule = 1 lớp vi phạm cụ thể vừa bắt được ──

// atom layer = bọc vendor 1 LẦN (atom-layer-heroui-wrappers). Import @heroui/react thẳng ở sentence
// tier = 1 block tự quyết lại appearance mà atom đã chốt — bỏ qua atom, chồng nguồn sự thật hình dạng.
// CHỈ áp cho file dưới `src/components/**` (sentence tier); ngoài src/components/ (route, hook, module)
// KHÔNG bị rule này soi — false-positive-risk: 1 hook/route import @heroui/react thẳng lọt lưới.
const noHerouiOutsideVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "Import '@heroui/react' chỉ hợp lệ ở tier vocabulary (atom bọc vendor 1 lần). [[canon atom-layer-heroui-wrappers]]" },
    schema: [],
    messages: {
      heroui: "Import '@heroui/react' ngoài tier vocabulary — dùng atom tương ứng (đã bọc vendor); nếu atom chưa có, thêm atom mới thay vì import thẳng.",
    },
  },
  create(context) {
    const tier = componentTier(context.filename || context.getFilename())
    if (tier !== "sentence") return {}
    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === "@heroui/react") {
          context.report({ node, messageId: "heroui" })
        }
      },
    }
  },
}

// BLOCK-4: "Accepting className hands the caller an escape hatch: the difference then lives at the
// call site, invisible to every other screen that will need the same thing." Ở sentence tier, prop
// className/classNames (hoặc kế thừa WithClassNames<…>) mở lại cửa hậu đó — đóng bằng cách đẩy khác
// biệt xuống 1 tier, nơi nó có TÊN (1 composite/variant mới). CHỈ áp sentence tier.
const noClassnameAtSentenceTier = {
  meta: {
    type: "problem",
    docs: { description: "Sentence tier không nhận prop className/classNames — cửa hậu che khác biệt gọi nơi khác. [[canon BLOCK-4]]" },
    schema: [],
    messages: {
      member: "Prop `{{name}}` ở sentence tier là cửa hậu (BLOCK-4) — đặt tên khác biệt thật (1 variant/composite mới) thay vì nhận className.",
      withClassNames: "`WithClassNames<…>` ở sentence tier mở cửa hậu className (BLOCK-4) — đẩy khác biệt xuống 1 tier, đặt tên cho nó.",
    },
  },
  create(context) {
    const tier = componentTier(context.filename || context.getFilename())
    if (tier !== "sentence") return {}
    return {
      TSPropertySignature(node) {
        const key = node.key
        if (!key) return
        const name = key.type === "Identifier" ? key.name : key.type === "Literal" ? key.value : null
        if (name === "className" || name === "classNames") {
          context.report({ node, messageId: "member", data: { name } })
        }
      },
      TSInterfaceDeclaration(node) {
        for (const h of node.extends || []) {
          const name = h.expression && h.expression.type === "Identifier" ? h.expression.name : null
          if (name === "WithClassNames") context.report({ node: h, messageId: "withClassNames" })
        }
      },
      TSTypeReference(node) {
        if (node.typeName && node.typeName.type === "Identifier" && node.typeName.name === "WithClassNames") {
          context.report({ node, messageId: "withClassNames" })
        }
      },
    }
  },
}

// BLOCK-5: composing a class string ("cn(") là quyết hình dạng — việc của tier dưới (composite/atom).
// `cn(` xuất hiện ngoài vocabulary tier đọc là "thiếu 1 composite, hoặc composite có sẵn thiếu variant".
// CHỈ áp sentence tier (ngoài src/components/ — hook/lib định nghĩa `cn` chính nó — KHÔNG bị soi;
// false-positive-risk: `cn(` trong 1 hook/util ngoài components lọt lưới, chấp nhận để giữ precision).
const noCnAboveVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "Gọi cn(...) chỉ hợp lệ ở tier vocabulary — tier trên compose bằng composite có sẵn. [[canon BLOCK-5]]" },
    schema: [],
    messages: {
      cn: "`cn(...)` ngoài tier vocabulary (BLOCK-5) — đọc như thiếu 1 composite hoặc composite có sẵn thiếu variant, đừng tự ghép class ở đây.",
    },
  },
  create(context) {
    const tier = componentTier(context.filename || context.getFilename())
    if (tier !== "sentence") return {}
    return {
      CallExpression(node) {
        if (node.callee && node.callee.type === "Identifier" && node.callee.name === "cn") {
          context.report({ node, messageId: "cn" })
        }
      },
    }
  },
}

// fe-asynccontent-4branch-retired: AsyncContent (bare, 4-nhánh) + EmptyContent/ErrorContent = bộ
// wrapper đã NGHỈ HƯU — thay bằng isSkeleton thread xuống từng leaf + AsyncContentEmpty/AsyncContentError.
// Global — áp cho MỌI file (kể cả ngoài src/components/), vì import retired có thể lọt ở bất cứ đâu.
const RETIRED_ASYNC_CONTENT_SRC = /blocks\/async\/AsyncContent/
const RETIRED_ASYNC_DIR_SRC = /blocks\/async\//
const noRetiredAsyncContent = {
  meta: {
    type: "problem",
    docs: { description: "Cấm AsyncContent (bare) + EmptyContent/ErrorContent — bộ 4-nhánh đã retired. [[canon fe-asynccontent-4branch-retired]]" },
    schema: [],
    messages: {
      retired: "`{{name}}` đã retired — dùng isSkeleton thread xuống từng leaf, cộng AsyncContentEmpty/AsyncContentError từ '@/components/composites/async/AsyncContent'.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const src = node.source && node.source.value
        if (!src) return
        for (const s of node.specifiers) {
          if (s.type !== "ImportSpecifier" || !s.imported) continue
          const name = s.imported.name
          if (name === "AsyncContent" && RETIRED_ASYNC_CONTENT_SRC.test(src)) {
            context.report({ node: s, messageId: "retired", data: { name } })
          } else if ((name === "EmptyContent" || name === "ErrorContent") && RETIRED_ASYNC_DIR_SRC.test(src)) {
            context.report({ node: s, messageId: "retired", data: { name } })
          }
        }
      },
    }
  },
}

// atom-tightening-migration-and-pos-ruling: overlay dev-tool showAnatomy/anatPart/data-anat-* đã
// NGHỈ HƯU — identity giờ là data-tier + data-component. Global — soi cả prop declaration, prop pass,
// destructure, và JSX attr data-anat*, vì overlay có thể rơi rớt ở bất cứ file nào (blueprint cũ).
const noAnatomyOverlay = {
  meta: {
    type: "problem",
    docs: { description: "Cấm showAnatomy/anatPart/data-anat-* — overlay blueprint đã retired, identity = data-tier + data-component. [[canon atom-tightening-migration-and-pos-ruling]]" },
    schema: [],
    messages: {
      ident: "`{{name}}` là overlay dev-tool đã retired — bỏ hẳn; identity của component là cặp attr data-tier + data-component.",
      attr: "`{{name}}` là overlay dev-tool đã retired — bỏ hẳn; identity của component là cặp attr data-tier + data-component.",
    },
  },
  create(context) {
    return {
      "Identifier, JSXIdentifier"(node) {
        if (node.name === "showAnatomy" || node.name === "anatPart") {
          context.report({ node, messageId: "ident", data: { name: node.name } })
        }
      },
      JSXAttribute(node) {
        if (node.name && node.name.type === "JSXIdentifier" && /^data-anat/.test(node.name.name)) {
          context.report({ node, messageId: "attr", data: { name: node.name.name } })
        }
      },
    }
  },
}

// split.md — component.tsx (nửa PRESENTATIONAL của cặp index.tsx/component.tsx) chỉ nhận props đã
// resolve sẵn: không tự fetch, không tự đọc store, không tự resolve i18n — nếu không thì không còn
// render được từ story. Danh sách allow/deny mirror `check-presentational-purity.mjs` (gate BE dùng
// cho cùng invariant). Chỉ soi file tên đúng `component.tsx` — không giới hạn tier vì quy ước đặt tên
// đã tự khoanh phạm vi (component.tsx chỉ tồn tại trong src/components/**).
const PRESENTATIONAL_FORBIDDEN_CALL = /^(?:useSWR|useSWRMutation|use[A-Za-z0-9]*Swr|useAppSelector|useDispatch|use[A-Za-z0-9]*Store|useTranslations|useLocale|query[A-Z][A-Za-z0-9]*)$/
const presentationalPurity = {
  meta: {
    type: "problem",
    docs: { description: "component.tsx chỉ nhận props resolve sẵn — không fetch/store/i18n tự gọi. [[canon split.md]]" },
    schema: [],
    messages: {
      call: "`{{name}}(...)` trong component.tsx — component.tsx là nửa presentational, phải nhận qua props; đặt call này ở index.tsx (nửa connected) rồi truyền xuống.",
    },
  },
  create(context) {
    const filename = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!/(^|\/)component\.tsx$/.test(filename)) return {}
    return {
      CallExpression(node) {
        if (node.callee && node.callee.type === "Identifier" && PRESENTATIONAL_FORBIDDEN_CALL.test(node.callee.name)) {
          context.report({ node, messageId: "call", data: { name: node.callee.name } })
        }
      },
    }
  },
}

// components/frames/_identity.ts (teacher's ruling 2026-08-05) — identity của 1 sentence-tier
// component.tsx (hoặc index.tsx khi KHÔNG có component.tsx sibling) KHÔNG còn tự vẽ `data-tier` lên
// 1 div bọc riêng (đó chính là shape BLOCK-2 cấm) — nó truyền prop `identity={{ tier, component }}`
// cho root frame/composite nó compose, ROOT đó mang cặp data-tier/data-component thay nó. Rule này
// bắt trường hợp cũ (mảng `require-identity-root` từng đòi `data-tier` trực tiếp trên file) — giờ đòi
// prop `identity`. Report 1 lần/file, trên export default/named. Conservative: bỏ file không có JSX,
// *.stories.tsx, map.ts, types (quy ước tên component.tsx | index.tsx đã tự loại các file đó khỏi
// phạm vi soi), và bỏ file mà MỌI return chỉ là fragment trần (`<>…</>`) hoặc null — không có root
// element thật để mang identity.
const requireIdentityRoot = {
  meta: {
    type: "problem",
    docs: { description: "component.tsx/index.tsx sentence tier có JSX phải truyền prop identity={{ tier, component }} cho root frame/composite — ROOT mang identity, không tự vẽ div bọc. [[canon components/frames/_identity.ts]]" },
    schema: [],
    messages: {
      identity: "File có JSX nhưng không truyền prop `identity` cho root — thêm `identity={{ tier: \"…\", component: \"…\" }}` ở frame/composite làm root (xem components/frames/_identity.ts); đừng tự vẽ div data-tier bọc ngoài.",
    },
  },
  create(context) {
    const filename = (context.filename || context.getFilename()).replace(/\\/g, "/")
    const tier = componentTier(filename)
    if (tier !== "sentence") return {}
    const base = filename.slice(filename.lastIndexOf("/") + 1)
    if (base === "component.tsx") {
      // ok — soi file này
    } else if (base === "index.tsx") {
      const dir = filename.slice(0, filename.length - base.length)
      if (existsSync(join(dir, "component.tsx"))) return {} // sibling component.tsx là identity root thật
    } else {
      return {} // không phải component.tsx / index.tsx — ngoài phạm vi rule (bao gồm *.stories.tsx, map.ts, types)
    }
    let hasJsx = false
    let hasIdentityProp = false
    let exportNode = null
    let sawReturn = false
    let sawNonBareReturn = false
    const isBareReturnArg = (arg) => {
      if (!arg) return true // `return;` — không render gì
      if (arg.type === "Literal" && arg.value === null) return true
      if (arg.type === "Identifier" && arg.name === "undefined") return true
      if (arg.type === "JSXFragment") return true // fragment trần — không có element để mang identity
      return false
    }
    return {
      JSXElement() { hasJsx = true },
      JSXFragment() { hasJsx = true },
      JSXAttribute(node) {
        if (node.name && node.name.type === "JSXIdentifier" && node.name.name === "identity") hasIdentityProp = true
      },
      ReturnStatement(node) {
        sawReturn = true
        if (!isBareReturnArg(node.argument)) sawNonBareReturn = true
      },
      ExportDefaultDeclaration(node) { if (!exportNode) exportNode = node },
      ExportNamedDeclaration(node) { if (!exportNode) exportNode = node },
      "Program:exit"(node) {
        if (!hasJsx) return
        if (sawReturn && !sawNonBareReturn) return // mọi return chỉ là fragment trần / null — bỏ qua
        if (!hasIdentityProp) context.report({ node: exportNode || node, messageId: "identity" })
      },
    }
  },
}

// components/frames/_identity.ts — mặt trái của rule trên: wrapper div tay-vẽ
// `data-tier="block|layout|overlay|page"` để "mang identity" là chính pattern đã bị RETIRE (bug, không
// phải cách reconcile) — identity của sentence-tier giờ đứng trên CHÍNH root frame/composite nó
// compose qua prop `identity`, không phải 1 div bọc thêm. CHỈ 4 giá trị sentence-tier (block/layout/
// overlay/page) bị cấm ở đây; "atom"/"frame"/"composite" là vocabulary tier tự vẽ + tự badge element
// của chính nó — hợp lệ, không soi. Global — wrapper có thể rơi rớt ở bất cứ file nào.
const RETIRED_IDENTITY_TIER_VALUES = new Set(["block", "layout", "overlay", "page"])
const noIdentityWrapperDiv = {
  meta: {
    type: "problem",
    docs: { description: "Cấm div/span/… tay-vẽ data-tier=\"block|layout|overlay|page\" — wrapper identity đã retired, truyền prop identity cho root frame/composite thay vào đó. [[canon components/frames/_identity.ts]]" },
    schema: [],
    messages: {
      wrapper: "`<{{tag}} data-tier=\"{{value}}\">` là wrapper identity đã retired — truyền `identity={{ tier: \"{{value}}\", component: \"…\" }}` cho root frame/composite thay vì tự vẽ div này (xem components/frames/_identity.ts).",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!node.name || node.name.type !== "JSXIdentifier" || node.name.name !== "data-tier") return
        const value = attrStringLiteral(node)
        if (!value || !RETIRED_IDENTITY_TIER_VALUES.has(value)) return
        const opening = node.parent
        const tag = opening && opening.type === "JSXOpeningElement" ? elementName(opening) : null
        if (!tag || !/^[a-z]/.test(tag)) return // chỉ soi host element (div/span/…) — component PascalCase không tính
        context.report({ node, messageId: "wrapper", data: { tag, value } })
      },
    }
  },
}

// sentence tier ghép câu bằng cách compose frame/composite có sẵn — nó không tự vẽ hình. Class LAYOUT
// (flex/grid/gap-/items-/justify-/space-x-/space-y-/absolute/relative/sticky/overflow-) trên 1 host
// element (div/span/section/…) ở sentence tier = tự vẽ hình thay vì compose. Bỏ qua: token `sr-only`,
// className CHỈ gồm token `size-*` (icon sizing), và variant-prefix (`md:flex`) được strip trước khi so.
const HOST_ELEMENTS = new Set(["div", "span", "section", "ul", "ol", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6", "main", "nav", "header", "footer", "aside"])
function isLayoutToken(tok) {
  if (tok === "flex" || tok === "grid" || tok === "absolute" || tok === "relative" || tok === "sticky") return true
  return /^(?:gap-|items-|justify-|space-x-|space-y-|overflow-)/.test(tok)
}
const noRawShapeAtSentenceTier = {
  meta: {
    type: "problem",
    docs: { description: "Sentence tier không tự vẽ layout (flex/grid/gap-/absolute/…) trên host element — compose frame/composite có sẵn. [[canon sentence-tier-composes-not-draws]]" },
    schema: [],
    messages: {
      shape: "`{{cls}}` trên <{{tag}}> ở sentence tier — tier này compose frame/composite, không tự vẽ layout; đưa class này xuống 1 frame/composite.",
    },
  },
  create(context) {
    const tier = componentTier(context.filename || context.getFilename())
    if (tier !== "sentence") return {}
    return {
      JSXAttribute(node) {
        if (!isClassAttr(node)) return
        const opening = node.parent
        const tag = opening && opening.type === "JSXOpeningElement" && opening.name && opening.name.type === "JSXIdentifier" ? opening.name.name : null
        if (!tag || !HOST_ELEMENTS.has(tag)) return
        const text = classNameText(node)
        if (!text) return
        const tokens = text.trim().split(/\s+/).filter(Boolean)
        if (tokens.length === 0) return
        if (tokens.includes("sr-only")) return
        if (tokens.every((t) => /^size-/.test(t))) return
        const hit = tokens.find((t) => isLayoutToken(t.includes(":") ? t.slice(t.lastIndexOf(":") + 1) : t))
        if (hit) context.report({ node, messageId: "shape", data: { cls: hit, tag } })
      },
    }
  },
}

// skeleton co-located: cây skeleton tay-giữ ("import FooSkeleton from './FooSkeleton'" hoặc prop
// `skeleton={<...>}`) là bản sao chép tay dễ trôi khỏi bản thật — thread `isSkeleton` xuống từng leaf
// để shimmer luôn mirror đúng hình đã load, không thể lệch. Global — cả 2 dạng đều là "cây song song"
// dù ở tier nào. KHÔNG bắt import `Skeleton` (bare, tên đúng "Skeleton") — đó là primitive dùng co-located.
const noParallelSkeleton = {
  meta: {
    type: "problem",
    docs: { description: "Cấm cây skeleton tay-giữ (prop skeleton={JSX} hoặc import *Skeleton relative) — thread isSkeleton xuống leaf. [[canon v2-src-twins-and-gates]]" },
    schema: [],
    messages: {
      prop: "Prop `skeleton={<…>}` là cây skeleton tay-giữ, dễ trôi khỏi bản thật — thread `isSkeleton` xuống từng leaf để shimmer tự mirror hình đã load.",
      import: "Import `{{name}}` (relative) là skeleton tay-giữ, dễ trôi khỏi bản thật — thread `isSkeleton` xuống từng leaf thay vì giữ cây skeleton song song.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!node.name || node.name.name !== "skeleton") return
        const v = node.value
        if (v && v.type === "JSXExpressionContainer" && v.expression && (v.expression.type === "JSXElement" || v.expression.type === "JSXFragment")) {
          context.report({ node, messageId: "prop" })
        }
      },
      ImportDeclaration(node) {
        const src = node.source && node.source.value
        if (!src || !/^\.\.?\//.test(src)) return
        for (const s of node.specifiers) {
          const local = s.local && s.local.name
          if (!local || local === "Skeleton" || !local.endsWith("Skeleton")) continue
          context.report({ node: s, messageId: "import", data: { name: local } })
        }
      },
    }
  },
}

// atom phải nhận text đã resolve qua prop — không tự embed câu locale (i18n là data, thuộc file
// connected). Regression thật: Input.Password hardcode "Show password", user VN mất "Hiện mật khẩu".
// Heuristic: string literal có khoảng trắng + mở đầu chữ hoa = câu văn thật, không phải token. CHỈ
// áp vocabulary tier — sentence tier nhận text qua props nên không thuộc phạm vi rule này.
const TEXT_ATTRS = new Set(["aria-label", "placeholder", "title", "alt"])
const noHardcodedUserTextInVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "Atom (vocabulary tier) không hardcode câu văn ở aria-label/placeholder/title/alt — nhận qua prop đã resolve i18n. [[canon fe-no-custom-from-design-up]]" },
    schema: [],
    messages: {
      hardcoded: "`{{attr}}=\"{{text}}\"` hardcode câu văn ở atom — i18n là data của file connected; đổi thành prop nhận string đã resolve sẵn.",
    },
  },
  create(context) {
    const tier = componentTier(context.filename || context.getFilename())
    if (tier !== "vocabulary") return {}
    return {
      JSXAttribute(node) {
        if (!node.name || !TEXT_ATTRS.has(node.name.name)) return
        const text = attrStringLiteral(node)
        if (!text) return
        if (/\s/.test(text) && /^[A-Z]/.test(text)) {
          context.report({ node, messageId: "hardcoded", data: { attr: node.name.name, text } })
        }
      },
    }
  },
}

// Token families whose members are NEAR NEIGHBOURS — picking between them is a real
// judgement, and that judgement is the only thing worth writing down. An `explain` on a
// token from one of these families must name the sibling it rejected, because the reader
// who needs this later is deciding between exactly these.
const PRINCIPLE_FAMILIES = [
  ["cell-pad", "card-padding", "row-pad", "control-pad", "page-pad", "pill-pad"],
  ["sibling-stack", "group-boundary", "block-boundary", "layout-split", "marketing-beat"],
  ["title-subtitle", "label-field", "name-handle", "icon-text"],
]

/** Static string of an `explain` attribute, or null when it is built at runtime. */
function explainText(node) {
  const v = node && node.value
  if (!v) return null
  if (v.type === "Literal" && typeof v.value === "string") return v.value
  if (v.type === "JSXExpressionContainer") {
    const e = v.expression
    if (e.type === "Literal" && typeof e.value === "string") return e.value
    if (e.type === "TemplateLiteral" && e.expressions.length === 0) return e.quasis.map((q) => q.value.cooked).join("")
  }
  return null
}

/** Principle token declared on the same element via `principle="token"` (never an array). */
function principleTokens(opening) {
  const attr = opening.attributes.find((a) => a.name && a.name.name === "principle")
  if (!attr || !attr.value) return []
  const v = attr.value
  if (v.type === "Literal" && typeof v.value === "string") return [v.value]
  if (v.type === "JSXExpressionContainer") {
    const e = v.expression
    if (e.type === "Literal" && typeof e.value === "string") return [e.value]
    if (e.type === "TemplateLiteral" && e.expressions.length === 0) {
      return [e.quasis.map((q) => q.value.cooked).join("")]
    }
  }
  return []
}

const explainJustifiesTokenChoice = {
  meta: {
    type: "problem",
    docs: {
      description: "`explain` justifies the TOKEN choice, not the node. [[fe-contract]]",
    },
    schema: [],
    messages: {
      restates: "`explain` here only says the token again in prose. `principle` is already the claim; repeating it adds a sentence and no knowledge. Say why THIS token and not the one beside it.",
      noAlternative: "`{{token}}` sits in a family of near neighbours ({{siblings}}) and this `explain` names none of them. Choosing between them is the only real judgement on this node, so it is the one thing worth recording — write what made this token right and the neighbour wrong. Read across the codebase, those sentences are how the token set's boundaries are actually learned; a sentence that describes the node teaches nobody anything.",
      tooShort: "`explain` is too short to carry a reason. One clause naming what breaks, wraps or overflows — not a label.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!file.includes("/src/components/")) return {}
    return {
      JSXAttribute(node) {
        if (!node.name || node.name.name !== "explain") return
        const text = explainText(node)
        // built at runtime — nothing static to read, and a reason should not need computing
        if (text == null) return
        const words = text.trim().split(/\s+/).filter(Boolean)
        if (words.length < 6) {
          context.report({ node, messageId: "tooShort" })
          return
        }
        const opening = node.parent
        const tokens = opening && opening.attributes ? principleTokens(opening) : []
        const normalized = text.toLowerCase()
        // a sentence built only from the token's own words says nothing the token did not
        const tokenWords = new Set(tokens.flatMap((t) => t.split("-")))
        const carriesOwnWords = words.every((w) => tokenWords.has(w.toLowerCase().replace(/[^a-z]/g, "")))
        if (tokens.length > 0 && carriesOwnWords) {
          context.report({ node, messageId: "restates" })
          return
        }
        // The one token on the node must be accounted for. A node claims exactly one seam;
        // an explanation that ignores the neighbour it rejected teaches nobody the boundary.
        for (const token of tokens) {
          const family = PRINCIPLE_FAMILIES.find((f) => f.includes(token))
          if (!family) continue
          const siblings = family.filter((t) => t !== token)
          if (siblings.some((s) => normalized.includes(s))) continue
          context.report({ node, messageId: "noAlternative", data: { token, siblings: siblings.join(", ") } })
        }
      },
    }
  },
}

const noPerPartClassNameProp = {
  meta: {
    type: "problem",
    docs: {
      description: "No `<part>ClassName` prop — a caller never restyles a node it does not own. [[BLOCK-4]]",
    },
    schema: [],
    messages: {
      perPart: "`{{prop}}` lets a caller reach INSIDE this component and restyle a node it does not own — the one escape hatch that makes a component impossible to change, because every internal element becomes public surface. Whatever the caller is trying to say, say it as a NAMED prop instead: `nameClassName={isMe ? \"text-accent\" : undefined}` was really `isOwnRow`, and the component decides what own-row looks like.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!file.includes("/src/components/")) return {}
    return {
      // the declaration is what creates the hatch; the call site only walks through it
      TSPropertySignature(node) {
        const name = node.key && node.key.name
        if (!name || !/^[a-z][A-Za-z0-9]*ClassName$/.test(name) || name === "className") return
        context.report({ node, messageId: "perPart", data: { prop: name } })
      },
    }
  },
}

// ── mỗi lớp phải TỰ KHAI nó là gì và VÌ SAO nó tồn tại ──────────────────────────
// `principle` = lớp này tuyên bố nó là seam gì (một token, tập đóng, khớp `patterns.mjs`,
// test đi theo `[data-principle]`). `explain` = vì sao có lớp này — thứ không ai dựng lại
// được từ markup về sau, và là thứ quyết định lớp kế tiếp nằm CẠNH hay nằm TRONG lớp này.
// Atom miễn: nó bọc vendor, nó không dựng layer nào của riêng mình.

/** Frame nào cũng dựng ra một node thật, nên node đó phải tự khai. */
const FRAME_ELEMENTS = new Set([
  "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
  "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
  "Stage", "StackV", "StackH",
])

/** Tên element JSX, kể cả dạng `Foo.Bar`. */
function jsxElementName(node) {
  const n = node.name
  if (!n) return null
  if (n.type === "JSXIdentifier") return n.name
  if (n.type === "JSXMemberExpression") return n.object?.name ? `${n.object.name}.${n.property?.name}` : null
  return null
}

/** Element có prop tên này không (kể cả `{...spread}` — spread thì coi như CÓ, đừng báo oan). */
function hasJsxProp(node, name) {
  return node.attributes.some((attr) =>
    attr.type === "JSXSpreadAttribute" || (attr.name && attr.name.name === name))
}

const requireFrameSelfDeclare = {
  meta: {
    type: "problem",
    docs: {
      description: "Every frame instance above the atom tier declares `principle` + `explain`. [[fe-contract]]",
    },
    schema: [],
    messages: {
      missing: "`<{{name}}>` declares neither `principle` nor `explain` — a layer that says nothing about itself is a layer nobody can test, and nobody can safely delete either. State the seam it is (`principle`) and the reason it exists (`explain`).",
      noPrinciple: "`<{{name}}>` has `explain` but no `principle` — the reason is there, the claim is not. Tests walk `[data-principle=\"…\"]`; an unlabelled layer is invisible to every one of them.",
      noExplain: "`<{{name}}>` declares `principle` but no `explain` — the token says WHAT this layer claims to be, which is a label. Say WHY it exists, in one sentence: what breaks, wraps or overflows if this node is removed. That is the part nobody can reconstruct from the markup later.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!file.includes("/src/components/")) return {}
    // atoms wrap vendor components; they build no layer of their own
    if (file.includes("/src/components/atoms/")) return {}
    // the frames themselves DECLARE the props — they do not pass them to their own root
    if (file.includes("/src/components/frames/")) return {}
    return {
      JSXOpeningElement(node) {
        const name = jsxElementName(node)
        if (!name || !FRAME_ELEMENTS.has(name)) return
        const principle = hasJsxProp(node, "principle")
        const explain = hasJsxProp(node, "explain")
        if (principle && explain) return
        const messageId = !principle && !explain ? "missing" : (principle ? "noExplain" : "noPrinciple")
        context.report({ node, messageId, data: { name } })
      },
    }
  },
}

const noInlineSkeletonBranch = {
  meta: {
    type: "problem",
    docs: {
      description: "A caller never picks between a resting shape and a real one. [[loading-and-skeleton.md]]",
    },
    schema: [],
    messages: {
      branch: "`{{flag}} ? … : …` picks between two DIFFERENT elements — that is a resting shape written by hand at the call site, and it drifts from the real one the first time the real one changes. Give the component below an `isSkeleton` prop and pass the flag down; let it rest as ITSELF. A ternary is fine when both arms are the same component.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!file.includes("/src/components/")) return {}
    if (file.includes("/src/components/atoms/")) return {}
    /** Root JSX element name of an arm, or null when the arm is not an element. */
    const armName = (expr) => {
      if (!expr) return null
      if (expr.type === "JSXElement") return jsxElementName(expr.openingElement)
      if (expr.type === "JSXFragment") return "<>"
      return null
    }
    return {
      ConditionalExpression(node) {
        const test = node.test
        // `isSkeleton ? … : …` / `isX && isSkeleton ? … : …` — read the flag off the test
        const source = context.sourceCode || context.getSourceCode()
        const testText = source.getText(test)
        if (!/\bis(Skeleton|Loading|Pending)\b/.test(testText)) return
        const left = armName(node.consequent)
        const right = armName(node.alternate)
        // both arms must be real elements, and they must differ — same component on both
        // sides is the honest shape (one description, two states)
        if (!left || !right || left === right) return
        context.report({ node, messageId: "branch", data: { flag: testText.trim().slice(0, 40) } })
      },
    }
  },
}

// ── một component = MỘT thư mục, và thư mục đó chỉ chứa hai nửa của chính nó ──
// Ba luật dưới đây khoá cùng một thói quen: nhét cả một cụm vào trong thư mục của
// một màn hình. Nó luôn bắt đầu vô hại ("con này chỉ trang này dùng") rồi kết thúc
// bằng một trang 674 dòng gồm 4 component, 1 folder constants, 1 folder utils và 3
// bản skeleton chép tay — đúng thứ `pages/AiSubscriptionPage` từng là.

/** Đường dẫn có nằm trong thư mục của MỘT component ở tầng câu không, và tên thư mục đó là gì. */
function sentenceComponentFolder(filename) {
  const file = (filename || "").replace(/\\/g, "/")
  // pages/<Name>/… · layouts/<Name>/… · overlays/<kind>/<Name>/…
  const m = file.match(/\/src\/components\/(pages|layouts)\/([^/]+)\/(.+)$/)
    || file.match(/\/src\/components\/(overlays)\/[^/]+\/([^/]+)\/(.+)$/)
  if (!m) return null
  return { tier: m[1], name: m[2], rest: m[3] }
}

const pageFolderTwoFilesOnly = {
  meta: {
    type: "problem",
    docs: {
      description: "A page/layout/overlay folder holds `component.tsx` + `index.tsx` and nothing else. [[tiers/split.md]]",
    },
    schema: [],
    messages: {
      extra: "`{{tier}}/{{name}}/` contains `{{rest}}` — a screen folder holds its two halves ONLY (`component.tsx` = the shape, `index.tsx` = the wiring). Whatever this is, it has a real home: a component of its own goes to `blocks/<category>/`, a fetch goes to `hooks/`, a pure helper to `modules/utils/`, a shape to `modules/types/`, copy or a config map to `resources/`. \"Only this screen uses it\" is how a folder becomes a second codebase.",
    },
  },
  create(context) {
    const folder = sentenceComponentFolder(context.filename || context.getFilename())
    if (!folder) return {}
    if (folder.rest === "component.tsx" || folder.rest === "index.tsx") return {}
    return {
      Program(node) {
        context.report({ node, messageId: "extra", data: folder })
      },
    }
  },
}

const noSkeletonTwinComponent = {
  meta: {
    type: "problem",
    docs: {
      description: "No component whose whole job is to mirror another one's shape. [[loading-and-skeleton.md]]",
    },
    schema: [],
    messages: {
      twin: "`{{name}}` is a hand-mirrored twin: a second description of a shape that already has one. Give the component it mirrors an `isSkeleton` prop and let it rest as ITSELF — the twin cannot be kept in step, it can only be noticed after it has already drifted. (The `Skeleton.*` primitives under `blocks/skeleton/` are the pieces you rest WITH, and are exempt.)",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    if (!file.includes("/src/components/")) return {}
    // the primitives themselves, and the atoms' own `isSkeleton` plumbing, are the exception
    if (file.includes("/blocks/skeleton/") || file.includes("/atoms/")) return {}
    const m = file.match(/\/([A-Za-z0-9]*Skeleton)\/index\.tsx$/) || file.match(/\/([A-Za-z0-9]*Skeleton)\.tsx$/)
    if (!m) return {}
    return {
      Program(node) {
        context.report({ node, messageId: "twin", data: { name: m[1] } })
      },
    }
  },
}

const noHelperFolderInComponents = {
  meta: {
    type: "problem",
    docs: {
      description: "`constants/` `utils/` `types/` `hooks/` are not component folders. [[sourcetree.md]]",
    },
    schema: [],
    messages: {
      helper: "`{{kind}}/` under `src/components/**` — this is not component code, so it does not live in the component tree. A fetch is a `hooks/`, a pure function is a `modules/utils/`, a shape is a `modules/types/`, a copy or config map is a `resources/`. Left here it stays invisible to everyone who would have reused it, which is how the same difficulty map got written three times.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    const m = file.match(/\/src\/components\/.*\/(constants|utils|types|hooks)\//)
    if (!m) return {}
    return {
      Program(node) {
        context.report({ node, messageId: "helper", data: { kind: m[1] } })
      },
    }
  },
}

/**
 * Public layout frames under the strict principle-only contract must not take
 * CSS-shaped layout props when `principle` owns the seam.
 * - StackH/StackV: AcademySettingsForm pilot (always forbid listed props).
 * - Grid / Form: forbid listed props when `principle` is present on the element.
 * Diagnostics refer to singular `principle` / `data-principle` (never plural).
 * Box remains the documented foreign-mount escape hatch. Flex is internal.
 */
const PUBLIC_FRAMES = new Set(["StackH", "StackV", "Grid", "Form", "FormActions", "SurfaceCardPressableGroup"])
const FORBIDDEN_FRAME_CSS_PROPS = new Set([
  "gap",
  "padding",
  "align",
  "justify",
  "className",
  "classNames",
  "style",
  "inline",
  "nested",
])

const noPublicFrameCssProps = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Public frames take one semantic principle; CSS layout props are not public frame decisions when principle owns the seam.",
    },
    schema: [],
    messages: {
      cssProp:
        "Use one semantic `principle` (emitted as `data-principle`). CSS layout props are not public frame decisions (forbid `{{prop}}` on {{frame}}).",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    // Frame / Form / SurfaceCard implementations may still name the props in their own files.
    if (/\/frames\/(Stack|Flex|Grid)\//.test(file)) return {}
    if (/\/composites\/form\/Form\//.test(file)) return {}
    if (/\/composites\/cards\/SurfaceCard\//.test(file)) return {}
    if (/\/composites\/buttons\/ButtonGroup\//.test(file)) return {}
    const stackPilot = /\/AcademySettingsForm\//.test(file)
    return {
      JSXOpeningElement(node) {
        const name = elementName(node)
        if (!name || !PUBLIC_FRAMES.has(name)) return
        const hasPrinciple = hasJsxProp(node, "principle")
        // Stack pilot: always strict in AcademySettingsForm.
        // Grid/Form: strict when principle is declared.
        // FormActions / SurfaceCardPressableGroup: always strict (principle owns layout).
        if (name === "StackH" || name === "StackV") {
          if (!stackPilot) return
        } else if (name === "Grid" || name === "Form") {
          if (!hasPrinciple) return
        }
        for (const attr of node.attributes || []) {
          if (attr.type !== "JSXAttribute" || !attr.name || attr.name.type !== "JSXIdentifier") continue
          const prop = attr.name.name
          if (!FORBIDDEN_FRAME_CSS_PROPS.has(prop)) continue
          context.report({ node: attr, messageId: "cssProp", data: { prop, frame: name } })
        }
      },
    }
  },
}

export default {
  meta: { name: "eslint-plugin-starci-fe", version: "0.5.0" },
  rules: {
    "explain-justifies-token-choice": explainJustifiesTokenChoice,
    "no-per-part-classname-prop": noPerPartClassNameProp,
    "require-frame-self-declare": requireFrameSelfDeclare,
    "no-inline-skeleton-branch": noInlineSkeletonBranch,
    "page-folder-two-files-only": pageFolderTwoFilesOnly,
    "no-skeleton-twin-component": noSkeletonTwinComponent,
    "no-helper-folder-in-components": noHelperFolderInComponents,
    "no-fractional-spacing": noFractionalSpacing,
    "no-adjacent-chip": noAdjacentChip,
    "no-modal-title-classname": noModalTitleClassname,
    "no-hero-heading-class": noHeroHeadingClass,
    "no-arbitrary-token": noArbitraryToken,
    "prefer-arrow-export": preferArrowExport,
    "require-export-jsdoc": requireExportJsdoc,
    "handler-on-prefix": handlerOnPrefix,
    "export-matches-folder": exportMatchesFolder,
    "no-heroui-outside-vocabulary": noHerouiOutsideVocabulary,
    "no-classname-at-sentence-tier": noClassnameAtSentenceTier,
    "no-cn-above-vocabulary": noCnAboveVocabulary,
    "no-retired-async-content": noRetiredAsyncContent,
    "no-anatomy-overlay": noAnatomyOverlay,
    "presentational-purity": presentationalPurity,
    "require-identity-root": requireIdentityRoot,
    "no-identity-wrapper-div": noIdentityWrapperDiv,
    "no-raw-shape-at-sentence-tier": noRawShapeAtSentenceTier,
    "no-parallel-skeleton": noParallelSkeleton,
    "no-hardcoded-user-text-in-vocabulary": noHardcodedUserTextInVocabulary,
    "no-public-frame-css-props": noPublicFrameCssProps,
  },
}
