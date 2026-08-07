/**
 * eslint-plugin-starci-fe — machine rules for the mechanical half of the FE canon.
 *
 * This is the ENFORCEMENT layer: each rule kills one pattern that audit formerly
 * had to spot by hand. "Audit finds it once; lint keeps it gone."
 *
 * v1 targets exact rules (low false-positive). Expand as the codebase goes green.
 * Authoring helpers live in ./authoring.mjs (inline-param types, emoji, Vietnamese).
 */
import { existsSync } from "node:fs"
import { join } from "node:path"
import {
  noEmojiInSource,
  noInlineParameterType,
  noVietnameseInSourceAuthoring,
} from "./authoring.mjs"
import { noContentPageBoxClassName } from "./contentpage.mjs"
import { noRuntimeNamespace } from "./namespaces.mjs"
import { noPublicClassNameProp } from "./public-contracts.mjs"

/** Static className string from one JSXAttribute (literal or pure template quasi). */
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

/** Component name of one JSXElement (Chip, Chip.Label, ModalShell…). */
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

/** Static string literal from one JSXAttribute (Literal or JSXExpressionContainer wrapping Literal). */
function attrStringLiteral(node) {
  const v = node && node.value
  if (!v) return null
  if (v.type === "Literal" && typeof v.value === "string") return v.value
  if (v.type === "JSXExpressionContainer" && v.expression && v.expression.type === "Literal" && typeof v.expression.value === "string") {
    return v.expression.value
  }
  return null
}

// ── shared tier map — derive tier from FILE PATH, not contents ──
// vocabulary: atoms/frames/composites (wrap vendor + compose leaves; no layout/data decisions).
// sentence: blocks/pages/layouts/overlays (compose sentences; do not draw shapes or fetch).
// Temporary homes (`features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes`) are empty and
// deleted, so the four names below are the FULL sentence tier — a new sibling directory bypasses the gate.
// Anything OUTSIDE `src/components/**` (app routes, hooks, modules) is NOT a component tier —
// each rule using this helper says in its comment whether it skips that scope.
const VOCAB_TIER_DIRS = new Set(["atoms", "frames", "composites"])
const SENTENCE_TIER_DIRS = new Set(["blocks", "pages", "layouts", "overlays"])

/** "vocabulary" | "sentence" | null (null = outside src/components/** or unknown tier dir). */
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
// fractional is NEVER on-scale → exact match, zero false-positives.
const FRACTIONAL = /\b(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|space-x|space-y|inset|top|bottom|left|right)-\d+\.5\b/g

const noFractionalSpacing = {
  meta: {
    type: "problem",
    docs: { description: "Ban fractional spacing (e.g. gap-1.5) — StarCi scale is 0·2·3·6·8. [[enforcement L4]]" },
    schema: [],
    messages: { frac: "Fractional spacing '{{cls}}' is off the 0·2·3·6·8 scale — use the nearest step (e.g. gap-1.5 → gap-2)." },
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

// L3 — adjacent chips: ≥2 direct <Chip> siblings in one cluster = violation (one meta cluster → one chip).
const noAdjacentChip = {
  meta: {
    type: "problem",
    docs: { description: "Ban ≥2 adjacent <Chip> siblings in one cluster — one meta cluster max one chip. [[enforcement L3]]" },
    schema: [],
    messages: { adj: "≥2 adjacent <Chip> siblings — keep one chip (primary classification); put the rest in inline text + icon." },
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

// L2 — header anatomy: ban the `titleClassName` escape hatch (promotes modal header to hero/H-scale).
const noModalTitleClassname = {
  meta: {
    type: "problem",
    docs: { description: "Ban titleClassName on Modal/Shell — header stays Typography body semibold default. [[enforcement L2]]" },
    schema: [],
    messages: { tc: "Drop `titleClassName` — let ModalShell render the default header (body semibold); do not promote it to hero/H-scale." },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name && node.name.name === "titleClassName") context.report({ node, messageId: "tc" })
      },
    }
  },
}

// L2b — hero heading class: text-{xl,2xl,3xl} + font-bold on one element = hand-rolled heading → Typography.
const HERO = /\btext-(?:xl|2xl|3xl|4xl)\b/
const noHeroHeadingClass = {
  meta: {
    type: "suggestion",
    docs: { description: "text-xl+/font-bold hand-roll = heading → use <Typography type>. [[enforcement L2/L6]]" },
    schema: [],
    messages: { hero: "Hand-rolled heading (text-xl+ + font-bold) — use <Typography type=\"h3|h4\"> instead of raw className." },
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

// L4b/token — arbitrary Tailwind value escapes the token system. Tailwind v4 emits spacing via calc
// (cannot prune-enum), so block the backdoor: `gap-[7px]` (off-scale) + `text-[#hex]` (off semantic color).
// 'warn' — some cases are valid (e.g. % / px alignment, brand hex) → eslint-disable + reason.
const ARBITRARY_SPACING = /\b(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|space-x|space-y)-\[[^\]]+\]/
const HEX_COLOR = /\b(?:text|bg|border|ring|from|to|via|fill|stroke|shadow)-\[#[0-9a-fA-F]/
const noArbitraryToken = {
  meta: {
    type: "suggestion",
    docs: { description: "Ban arbitrary spacing/hex-color (token-system escape). [[enforcement token]]" },
    schema: [],
    messages: {
      space: "Arbitrary spacing '{{cls}}' — use the 0·2·3·6·8 scale; a real exception needs eslint-disable + reason.",
      hex: "Arbitrary hex color '{{cls}}' — use a semantic token (text-accent…); a real brand color needs eslint-disable + reason.",
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

// ── authoring convention rules (2026-08) — each rule = one `enforce/authoring/*` law ──

// structure-and-naming §5 + "functions are arrows": every module-level function is `const X = () => {}`,
// NOT a `function` declaration / `export default function`. Flag top-level FunctionDeclaration.
const preferArrowExport = {
  meta: {
    type: "suggestion",
    docs: { description: "Module-level functions use arrow const, not `function` declarations. [[structure-and-naming §5]]" },
    schema: [],
    messages: { fn: "Use an arrow const `const {{name}} = (…) => {…}` — no module-level `function` (structure-and-naming §5)." },
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

// comments.md §3: every EXPORT (component/hook/helper/const/interface) opens with JSDoc `/** */`.
const requireExportJsdoc = {
  meta: {
    type: "suggestion",
    docs: { description: "Exported declarations open with JSDoc `/** */`. [[comments §3]]" },
    schema: [],
    messages: { jsdoc: "Add JSDoc `/** … */` for export `{{name}}` — role / what it does (comments §3)." },
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

// react-idioms §7: handlers are named `onXxx`, NOT `handleXxx` (locals and props).
const handlerOnPrefix = {
  meta: {
    type: "suggestion",
    docs: { description: "Handlers are named `onXxx`, not `handleXxx`. [[react-idioms §7]]" },
    schema: [],
    messages: { handle: "`{{name}}` → rename to `on{{rest}}` (handlers are `onXxx`, not `handleXxx` — react-idioms §7)." },
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

// structure-and-naming §1/§5: PascalCase folder groups a direct named-export family.
// Exact `export const Folder` OR members like `FolderRoot` / `PageHeader` count —
// a runtime object named after the folder is forbidden (`no-runtime-namespace`).
const exportMatchesFolder = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "PascalCase folder must export a direct named-export family matching the folder. [[structure-and-naming §1/§5]]",
    },
    schema: [],
    messages: {
      mismatch:
        "`index.tsx` in folder `{{folder}}` has no direct named export matching the folder family (exports: {{names}}) — export `{{folder}}` or `{{folder}}*` members (e.g. `{{folder}}Root`), not a runtime namespace object.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    const m = file.match(/\/([A-Z][A-Za-z0-9]*)\/index\.tsx?$/)
    if (!m) return {}
    const folder = m[1]
    const names = new Set()
    const matchesFamily = (name) =>
      name === folder || (name.startsWith(folder) && name.length > folder.length && /^[A-Z]/.test(name.slice(folder.length)))
    return {
      ExportNamedDeclaration(node) {
        const d = node.declaration
        if (d && d.type === "VariableDeclaration") d.declarations.forEach((dec) => dec.id && dec.id.name && names.add(dec.id.name))
        if (d && d.type === "FunctionDeclaration" && d.id) names.add(d.id.name)
        if (node.specifiers) node.specifiers.forEach((s) => s.exported && s.exported.name && names.add(s.exported.name))
      },
      "Program:exit"(node) {
        if (names.size > 0 && ![...names].some(matchesFamily)) {
          context.report({ node, messageId: "mismatch", data: { folder, names: [...names].join(", ") } })
        }
      },
    }
  },
}

// ── tier rules (2026-08 refactor) — each rule = one concrete violation class ──

// atom layer = wrap vendor ONCE (atom-layer-heroui-wrappers). Direct @heroui/react import at sentence
// tier = a block re-deciding appearance the atom already fixed — bypasses the atom, splits shape truth.
// ONLY applies under `src/components/**` (sentence tier); outside src/components/ (route, hook, module)
// is out of scope — otherwise a hook/route direct @heroui/react import would be a false positive.
const noHerouiOutsideVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "Import '@heroui/react' is only valid at the vocabulary tier (atom wraps vendor once). [[canon atom-layer-heroui-wrappers]]" },
    schema: [],
    messages: {
      heroui: "Import '@heroui/react' outside the vocabulary tier — use the matching atom (vendor wrapped once); if missing, add an atom instead of importing vendor directly.",
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
// call site, invisible to every other screen that will need the same thing." At sentence tier, a
// className/classNames prop (or WithClassNames<…>) reopens that backdoor — close it by pushing the
// difference down one tier where it has a NAME (new composite/variant). Sentence tier only.
const noClassnameAtSentenceTier = {
  meta: {
    type: "problem",
    docs: { description: "Sentence tier must not take className/classNames — that backdoor hides a difference that belongs elsewhere. [[canon BLOCK-4]]" },
    schema: [],
    messages: {
      member: "Prop `{{name}}` at sentence tier is a className backdoor (BLOCK-4) — name a real difference (new variant/composite) instead of accepting className.",
      withClassNames: "`WithClassNames<…>` at sentence tier opens a className backdoor (BLOCK-4) — push the difference down one tier and name it.",
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

// BLOCK-5: composing a class string ("cn(") is a shape decision — the lower tier's job (composite/atom).
// `cn(` outside vocabulary tier reads as "missing a composite, or an existing composite missing a variant".
// Sentence tier only (outside src/components/ — hooks/libs that define `cn` itself — not scanned;
// false-positive risk: `cn(` in a hook/util outside components; accepted to keep precision).
const noCnAboveVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "cn(...) is only valid at the vocabulary tier — upper tiers compose via existing composites. [[canon BLOCK-5]]" },
    schema: [],
    messages: {
      cn: "`cn(...)` outside the vocabulary tier (BLOCK-5) — treat this as a missing composite or missing variant; do not assemble classes here.",
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

// fe-asynccontent-4branch-retired: AsyncContent (bare, 4-branch) + EmptyContent/ErrorContent = the
// retired wrapper set — replace with isSkeleton threaded to each leaf + AsyncContentEmpty/AsyncContentError.
// Global — applies to EVERY file (including outside src/components/), because retired imports can land anywhere.
const RETIRED_ASYNC_CONTENT_SRC = /blocks\/async\/AsyncContent/
const RETIRED_ASYNC_DIR_SRC = /blocks\/async\//
const noRetiredAsyncContent = {
  meta: {
    type: "problem",
    docs: { description: "Ban AsyncContent (bare) + EmptyContent/ErrorContent — the 4-branch set is retired. [[canon fe-asynccontent-4branch-retired]]" },
    schema: [],
    messages: {
      retired: "`{{name}}` is retired — thread `isSkeleton` to each leaf, and use AsyncContentEmpty/AsyncContentError from '@/components/composites/async/AsyncContent'.",
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

// atom-tightening-migration-and-pos-ruling: showAnatomy/anatPart/data-anat-* overlay tooling is
// RETIRED — identity is now data-tier + data-component. Global — scan prop declarations, prop pass,
// destructure, and JSX attr data-anat*, because leftover overlay can appear in any file (old blueprint).
const noAnatomyOverlay = {
  meta: {
    type: "problem",
    docs: { description: "Ban showAnatomy/anatPart/data-anat-* — overlay blueprint retired; identity = data-tier + data-component. [[canon atom-tightening-migration-and-pos-ruling]]" },
    schema: [],
    messages: {
      ident: "`{{name}}` is a retired anatomy overlay — remove it; component identity is the data-tier + data-component attr pair.",
      attr: "`{{name}}` is a retired anatomy overlay — remove it; component identity is the data-tier + data-component attr pair.",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    // Stories that document the retired overlay itself must keep `data-anat*` fixtures.
    // ledger: anatomy-overlay-stories-allowlist-2026-08-07
    if (file.includes("/AnatomyOverlay/") && (file.includes("/stories/") || file.includes(".stories."))) return {}
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

// split.md — component.tsx (PRESENTATIONAL half of the index.tsx/component.tsx pair) only takes already-
// resolved props: no self-fetch, no store reads, no self i18n — otherwise it cannot be
// rendered from a story. Allow/deny lists mirror `check-presentational-purity.mjs` (BE gate for
// the same invariant). Only files named `component.tsx` — no tier filter because the naming
// convention already scopes it (component.tsx only exists under src/components/**).
const PRESENTATIONAL_FORBIDDEN_CALL = /^(?:useSWR|useSWRMutation|use[A-Za-z0-9]*Swr|useAppSelector|useDispatch|use[A-Za-z0-9]*Store|useTranslations|useLocale|query[A-Z][A-Za-z0-9]*)$/
const presentationalPurity = {
  meta: {
    type: "problem",
    docs: { description: "component.tsx only takes resolved props — no self fetch/store/i18n. [[canon split.md]]" },
    schema: [],
    messages: {
      call: "`{{name}}(...)` in component.tsx — that file is the presentational half and must receive data via props; put this call in index.tsx (connected half) and pass it down.",
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

// components/frames/_identity.ts (teacher's ruling 2026-08-05) — identity of a sentence-tier
// component.tsx (or index.tsx when there is NO component.tsx sibling) no longer hand-paints `data-tier` on
// a wrapping div (that is the banned BLOCK-2 shape) — it passes `identity={{ tier, component }}`
// to the root frame/composite it composes; that ROOT carries data-tier/data-component. This rule
// catches the old case (when `require-identity-root` demanded `data-tier` on the file) — now it demands
// the `identity` prop. Report once per file on default/named export. Conservative: skip files without JSX,
// *.stories.tsx, map.ts, types (the component.tsx | index.tsx naming already excludes those from
// scope), and skip files whose EVERY return is a bare fragment (`<>…</>`) or null — no real root
// element to carry identity.
const requireIdentityRoot = {
  meta: {
    type: "problem",
    docs: { description: "sentence-tier component.tsx/index.tsx with JSX must pass identity={{ tier, component }} to the root frame/composite — the ROOT carries identity; no hand-rolled wrapper div. [[canon components/frames/_identity.ts]]" },
    schema: [],
    messages: {
      identity: "JSX file without an `identity` prop on the root — add `identity={{ tier: \"…\", component: \"…\" }}` on the root frame/composite (see components/frames/_identity.ts); do not wrap with a hand-rolled data-tier div.",
    },
  },
  create(context) {
    const filename = (context.filename || context.getFilename()).replace(/\\/g, "/")
    const tier = componentTier(filename)
    if (tier !== "sentence") return {}
    const base = filename.slice(filename.lastIndexOf("/") + 1)
    if (base === "component.tsx") {
      // ok — scan this file
    } else if (base === "index.tsx") {
      const dir = filename.slice(0, filename.length - base.length)
      if (existsSync(join(dir, "component.tsx"))) return {} // sibling component.tsx is the real identity root
    } else {
      return {} // not component.tsx / index.tsx — out of rule scope (includes *.stories.tsx, map.ts, types)
    }
    let hasJsx = false
    let hasIdentityProp = false
    let exportNode = null
    let sawReturn = false
    let sawNonBareReturn = false
    const isBareReturnArg = (arg) => {
      if (!arg) return true // `return;` — renders nothing
      if (arg.type === "Literal" && arg.value === null) return true
      if (arg.type === "Identifier" && arg.name === "undefined") return true
      if (arg.type === "JSXFragment") return true // bare fragment — no element to carry identity
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
        if (sawReturn && !sawNonBareReturn) return // every return is bare fragment / null — skip
        if (!hasIdentityProp) context.report({ node: exportNode || node, messageId: "identity" })
      },
    }
  },
}

// components/frames/_identity.ts — flip side of the rule above: a hand-rolled wrapper div
// `data-tier="block|layout|overlay|page"` to "carry identity" is the RETIRED pattern (a bug, not
// a reconciliation path) — sentence-tier identity now lives on the ROOT frame/composite it
// composes via the `identity` prop, not an extra wrapping div. ONLY the four sentence-tier values (block/layout/
// overlay/page) are banned here; "atom"/"frame"/"composite" are vocabulary-tier self-draw + self-badge
// on their own elements — valid, not scanned. Global — leftover wrappers can appear in any file.
const RETIRED_IDENTITY_TIER_VALUES = new Set(["block", "layout", "overlay", "page"])
const noIdentityWrapperDiv = {
  meta: {
    type: "problem",
    docs: { description: "Ban hand-rolled div/span/… with data-tier=\"block|layout|overlay|page\" — identity wrapper retired; pass identity to the root frame/composite instead. [[canon components/frames/_identity.ts]]" },
    schema: [],
    messages: {
      wrapper: "`<{{tag}} data-tier=\"{{value}}\">` is a retired identity wrapper — pass `identity={{ tier: \"{{value}}\", component: \"…\" }}` to the root frame/composite instead (see components/frames/_identity.ts).",
    },
  },
  create(context) {
    const file = (context.filename || context.getFilename()).replace(/\\/g, "/")
    // nivo / nivoexpert are plain-CSS tenant trees, not Academy frame identity.
    // ledger: nivoexpert-identity-wrapper-exempt-2026-08-07
    if (file.includes("/.storybook/components/nivoexpert/") || file.includes("/.storybook/components/nivo/")) return {}
    return {
      JSXAttribute(node) {
        if (!node.name || node.name.type !== "JSXIdentifier" || node.name.name !== "data-tier") return
        const value = attrStringLiteral(node)
        if (!value || !RETIRED_IDENTITY_TIER_VALUES.has(value)) return
        const opening = node.parent
        const tag = opening && opening.type === "JSXOpeningElement" ? elementName(opening) : null
        if (!tag || !/^[a-z]/.test(tag)) return // host elements only (div/span/…) — PascalCase components excluded
        context.report({ node, messageId: "wrapper", data: { tag, value } })
      },
    }
  },
}

// sentence tier composes sentences via existing frames/composites — it does not draw shapes. LAYOUT classes
// (flex/grid/gap-/items-/justify-/space-x-/space-y-/absolute/relative/sticky/overflow-) on a host
// element (div/span/section/…) at sentence tier = drawing instead of composing. Skip: `sr-only`,
// className that is ONLY `size-*` (icon sizing), and strip variant prefixes (`md:flex`) before matching.
const HOST_ELEMENTS = new Set(["div", "span", "section", "ul", "ol", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6", "main", "nav", "header", "footer", "aside"])
function isLayoutToken(tok) {
  if (tok === "flex" || tok === "grid" || tok === "absolute" || tok === "relative" || tok === "sticky") return true
  return /^(?:gap-|items-|justify-|space-x-|space-y-|overflow-)/.test(tok)
}
const noRawShapeAtSentenceTier = {
  meta: {
    type: "problem",
    docs: { description: "Sentence tier must not draw layout (flex/grid/gap-/absolute/…) on host elements — compose existing frames/composites. [[canon sentence-tier-composes-not-draws]]" },
    schema: [],
    messages: {
      shape: "`{{cls}}` on <{{tag}}> at sentence tier — this tier composes frames/composites and does not draw layout; push the class down into a frame/composite.",
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

// co-located skeleton: a hand-kept skeleton tree ("import FooSkeleton from './FooSkeleton'" or prop
// `skeleton={<...>}`) is a hand copy that drifts from the real shape — thread `isSkeleton` to each leaf
// so shimmer always mirrors the loaded tree. Global — both forms are a "parallel tree"
// at any tier. Do NOT flag bare `Skeleton` imports (exact name "Skeleton") — that is the co-located primitive.
const noParallelSkeleton = {
  meta: {
    type: "problem",
    docs: { description: "Ban hand-kept skeleton trees (skeleton={JSX} prop or relative *Skeleton import) — thread isSkeleton to leaves. [[canon v2-src-twins-and-gates]]" },
    schema: [],
    messages: {
      prop: "Prop `skeleton={<…>}` is a hand-kept parallel skeleton tree that drifts from the real shape — thread `isSkeleton` to each leaf so shimmer mirrors the loaded tree.",
      import: "Import `{{name}}` (relative) is a hand-kept parallel skeleton — thread `isSkeleton` to each leaf instead of keeping a second tree.",
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

// atoms must take already-resolved text via props — do not embed locale sentences (i18n is data, owned by the
// connected file). Real regression: Input.Password hardcoded "Show password"; VI users lost "Hiện mật khẩu". // vn-ok: documents the retired VI string
// Heuristic: string literal with a space + leading capital = real prose, not a token. ONLY
// vocabulary tier — sentence tier receives text via props so it is out of this rule's scope.
const TEXT_ATTRS = new Set(["aria-label", "placeholder", "title", "alt"])
const noHardcodedUserTextInVocabulary = {
  meta: {
    type: "problem",
    docs: { description: "Atoms (vocabulary tier) must not hardcode prose in aria-label/placeholder/title/alt — take an i18n-resolved prop. [[canon fe-no-custom-from-design-up]]" },
    schema: [],
    messages: {
      hardcoded: "`{{attr}}=\"{{text}}\"` hardcodes copy in an atom — i18n belongs to the connected file; take a resolved string prop instead.",
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

// ── every layer must SELF-DECLARE what it is and WHY it exists ──────────────────
// `principle` = this layer declares which seam it is (one token, closed set, matches `patterns.mjs`,
// tests follow `[data-principle]`). `explain` = why this layer exists — something nobody can rebuild
// from markup later, and what decides whether the next layer sits BESIDE or INSIDE this one.
// Atoms are exempt: they wrap vendor and do not build a layer of their own.

/** Every frame builds a real node, so that node must self-declare. */
const FRAME_ELEMENTS = new Set([
  "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
  "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
  "Stage", "StackV", "StackH",
])

/** JSX element name, including `Foo.Bar`. */
function jsxElementName(node) {
  const n = node.name
  if (!n) return null
  if (n.type === "JSXIdentifier") return n.name
  if (n.type === "JSXMemberExpression") return n.object?.name ? `${n.object.name}.${n.property?.name}` : null
  return null
}

/** Whether the element has this prop name (including `{...spread}` — treat spread as present, no false positive). */
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

// ── one component = ONE folder, and that folder holds only its two halves ──
// The three rules below lock the same habit: stuffing a whole cluster into the folder of
// one screen. It always starts harmlessly ("only this page uses it") and ends
// as a 674-line page with 4 components, a constants folder, a utils folder, and 3
// hand-copied skeletons — exactly what `pages/AiSubscriptionPage` used to be.

/** Whether the path sits in ONE sentence-tier component folder, and what that folder is named. */
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
    "no-inline-parameter-type": noInlineParameterType,
    "no-emoji-in-source": noEmojiInSource,
    "no-vietnamese-in-source-authoring": noVietnameseInSourceAuthoring,
    "no-contentpage-box-classname": noContentPageBoxClassName,
    "no-runtime-namespace": noRuntimeNamespace,
    "no-public-classname-prop": noPublicClassNameProp,
  },
}
