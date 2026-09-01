/**
 * Rewrite Vietnamese diagnostics in plugins/eslint/index.mjs to English
 * and wire the three new authoring rules.
 */
import { readFileSync, writeFileSync } from "node:fs"

const path = "plugins/eslint/index.mjs"
let src = readFileSync(path, "utf8")

const byKey = {
    frac: "Fractional spacing '{{cls}}' is off the 0·2·3·6·8 scale — use the nearest step (e.g. gap-1.5 → gap-2).",
    adj: "≥2 adjacent <Chip> siblings — keep one chip (primary classification); put the rest in inline text + icon.",
    tc: "Drop `titleClassName` — let ModalShell render the default header (body semibold); do not promote it to hero/H-scale.",
    hero: "Hand-rolled heading (text-xl+ + font-bold) — use <Typography type=\\\"h3|h4\\\"> instead of raw className.",
    space: "Arbitrary spacing '{{cls}}' — use the 0·2·3·6·8 scale; a real exception needs eslint-disable + reason.",
    hex: "Arbitrary hex color '{{cls}}' — use a semantic token (text-accent…); a real brand color needs eslint-disable + reason.",
    fn: "Use an arrow const `const {{name}} = (…) => {…}` — no module-level `function` (structure-and-naming §5).",
    jsdoc: "Add JSDoc `/** … */` for export `{{name}}` — role / what it does (comments §3).",
    handle: "`{{name}}` → rename to `on{{rest}}` (handlers are `onXxx`, not `handleXxx` — react-idioms §7).",
    mismatch:
    "`index.tsx` in folder `{{folder}}` does not export `{{folder}}` (exports: {{names}}) — the named export must match the folder (structure-and-naming §5).",
    heroui:
    "Import '@heroui/react' outside the vocabulary tier — use the matching atom (vendor wrapped once); if missing, add an atom instead of importing vendor directly.",
    member:
    "Prop `{{name}}` at sentence tier is a className backdoor (BLOCK-4) — name a real difference (new variant/composite) instead of accepting className.",
    withClassNames:
    "`WithClassNames<…>` at sentence tier opens a className backdoor (BLOCK-4) — push the difference down one tier and name it.",
    cn: "`cn(...)` outside the vocabulary tier (BLOCK-5) — treat this as a missing composite or missing variant; do not assemble classes here.",
    retired:
    "`{{name}}` is retired — thread `isSkeleton` to each leaf, and use AsyncContentEmpty/AsyncContentError from '@/components/composites/async/AsyncContent'.",
    ident:
    "`{{name}}` is a retired anatomy overlay — remove it; component identity is the data-tier + data-component attr pair.",
    attr:
    "`{{name}}` is a retired anatomy overlay — remove it; component identity is the data-tier + data-component attr pair.",
    call: "`{{name}}(...)` in component.tsx — that file is the presentational half and must receive data via props; put this call in index.tsx (connected half) and pass it down.",
    identity:
    "JSX file without an `identity` prop on the root — add `identity={{ tier: \\\"…\\\", component: \\\"…\\\" }}` on the root frame/composite (see components/frames/_identity.ts); do not wrap with a hand-rolled data-tier div.",
    wrapper:
    "`<{{tag}} data-tier=\\\"{{value}}\\\">` is a retired identity wrapper — pass `identity={{ tier: \\\"{{value}}\\\", component: \\\"…\\\" }}` to the root frame/composite instead (see components/frames/_identity.ts).",
    shape:
    "`{{cls}}` on <{{tag}}> at sentence tier — this tier composes frames/composites and does not draw layout; push the class down into a frame/composite.",
    prop: "Prop `skeleton={<…>}` is a hand-kept parallel skeleton tree that drifts from the real shape — thread `isSkeleton` to each leaf so shimmer mirrors the loaded tree.",
    import:
    "Import `{{name}}` (relative) is a hand-kept parallel skeleton — thread `isSkeleton` to each leaf instead of keeping a second tree.",
    hardcoded:
    "`{{attr}}=\\\"{{text}}\\\"` hardcodes copy in an atom — i18n belongs to the connected file; take a resolved string prop instead.",
}

let replaced = 0
for (const [key, english] of Object.entries(byKey)) {
    const re = new RegExp(`(${key}:\\s*")((?:\\\\.|[^"\\\\])*)(")`, "g")
    const next = src.replace(re, (full, a, old, c) => {
        if (old === english) return full
        // Only rewrite when the old string still has Vietnamese letters
        if (!/[À-ỹ]/.test(old) && old === english) return full
        if (!/[À-ỹĂăĐđĨĩŨũƠơƯư]/.test(old)) return full
        replaced++
        return a + english + c
    })
    src = next
}

const docPairs = [
    [
        "Cấm spacing lẻ (fractional, vd gap-1.5) — thang StarCi = 0·2·3·6·8. [[enforcement L4]]",
        "Ban fractional spacing (e.g. gap-1.5) — StarCi scale is 0·2·3·6·8. [[enforcement L4]]",
    ],
    [
        "Hàm module-level dùng arrow const, không `function` declaration. [[structure-and-naming §5]]",
        "Module-level functions use arrow const, not `function` declarations. [[structure-and-naming §5]]",
    ],
    [
        "Khai báo export mở đầu bằng JSDoc `/** */`. [[comments §3]]",
        "Exported declarations open with JSDoc `/** */`. [[comments §3]]",
    ],
    [
        "Handler đặt tên `onXxx`, không `handleXxx`. [[react-idioms §7]]",
        "Handlers are named `onXxx`, not `handleXxx`. [[react-idioms §7]]",
    ],
    [
        "index.tsx trong folder PascalCase phải export tên trùng folder. [[structure-and-naming §1/§5]]",
        "PascalCase folder `index.tsx` must export a name matching the folder. [[structure-and-naming §1/§5]]",
    ],
    [
        "Import '@heroui/react' chỉ hợp lệ ở tier vocabulary (atom bọc vendor 1 lần). [[canon atom-layer-heroui-wrappers]]",
        "Import '@heroui/react' is only valid at the vocabulary tier (atom wraps vendor once). [[canon atom-layer-heroui-wrappers]]",
    ],
]

for (const [from, to] of docPairs) {
    if (src.includes(from)) {
        src = src.split(from).join(to)
        replaced++
    }
}

const header = `/**
 * eslint-plugin-starci-fe — machine rules for the mechanical half of the FE canon.
 *
 * This is the ENFORCEMENT layer: each rule kills one pattern that audit formerly
 * had to spot by hand. "Audit finds it once; lint keeps it gone."
 *
 * v1 targets exact rules (low false-positive). Expand as the codebase goes green.
 * Authoring helpers live in ./authoring.mjs (inline-param types, emoji, Vietnamese).
 */`

src = src.replace(/^\/\*\*[\s\S]*?\*\/\r?\n/, header + "\n")

if (!src.includes("from \"./authoring.mjs\"")) {
    src = src.replace(
        /import \{ existsSync \} from "node:fs"\r?\nimport \{ join \} from "node:path"\r?\n/,
        `import { existsSync } from "node:fs"
import { join } from "node:path"
import {
  noEmojiInSource,
  noInlineParameterType,
  noVietnameseInSourceAuthoring,
} from "./authoring.mjs"
`,
    )
}

if (!src.includes("\"no-inline-parameter-type\"")) {
    src = src.replace(
        `"no-public-frame-css-props": noPublicFrameCssProps,
  },
}`,
        `"no-public-frame-css-props": noPublicFrameCssProps,
    "no-inline-parameter-type": noInlineParameterType,
    "no-emoji-in-source": noEmojiInSource,
    "no-vietnamese-in-source-authoring": noVietnameseInSourceAuthoring,
  },
}`,
    )
}

writeFileSync(path, src)

const still = [...src.matchAll(/messages:\s*\{([\s\S]*?)\n\s*\}/g)]
    .flatMap((m) => [...m[1].matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g)])
    .filter((m) => /[À-ỹĂăĐđ]/.test(m[2]))
console.log({ replaced, stillViMessages: still.map((m) => m[1]), wired: src.includes("\"no-inline-parameter-type\"") })
