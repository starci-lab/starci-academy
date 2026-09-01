/**
 * One-shot safe-authoring burn for blocks-layout partition (worker).
 * Only touches files listed below (subset of the manifest).
 */
import fs from "node:fs"
import path from "node:path"
import { hasEmoji, VN_LETTER } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()
const changed = []
const skipped = []

const scrubEmojiText = (text) => {
    let out = text
    const map = [
        [/↔/g, "<->"],
        [/↕/g, "<->"],
        [/→/g, "->"],
        [/←/g, "<-"],
        [/⇒/g, "=>"],
        [/©/g, "(c)"],
        [/⚠️/g, "WARNING:"],
        [/⚠/g, "WARNING"],
        [/⋮/g, "..."],
        [/🗑/g, "delete"],
        [/⭐/g, "*"],
        [/✨/g, "*"],
        [/✅/g, "[ok]"],
        [/❌/g, "[x]"],
        [/✓/g, "[ok]"],
        [/✔/g, "[ok]"],
        [/▶/g, ">"],
        [/·/g, "-"],
    ]
    for (const [re, rep] of map) out = out.replace(re, rep)
    out = out.replace(/\p{Extended_Pictographic}/gu, "")
    out = out.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    out = out.replace(/[^\S\n]{2,}/g, " ")
    return out
}

const write = (rel, next, reason) => {
    const abs = path.join(ROOT, rel)
    const prev = fs.readFileSync(abs, "utf8")
    if (prev === next) {
        skipped.push({ path: rel, rules: [], reason: "no-op-after-transform" })
        return false
    }
    fs.writeFileSync(abs, next)
    changed.push({ path: rel, rules: [], reason })
    return true
}

const scrubFileEmoji = (rel, rules) => {
    const abs = path.join(ROOT, rel)
    const prev = fs.readFileSync(abs, "utf8")
    const next = scrubEmojiText(prev)
    if (prev === next) {
        skipped.push({ path: rel, rules, reason: "emoji-already-clean-or-product" })
        return
    }
    // Only scrub if emoji remain in authoring (comments/docs) — still write scrubbed
    fs.writeFileSync(abs, next)
    changed.push({ path: rel, rules, reason: "scrubbed-emoji-from-authoring" })
}

// --- Storybook Footer + src Footer twin: (c) + ASCII author name ---
for (const rel of [
    ".storybook/components/starci/blocks/navigation/Footer/Footer.tsx",
    "src/components/blocks/navigation/Footer/index.tsx",
]) {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    src = src.replace(
        /`© \$\{year\} StarCi Academy · Built by Nguyễn Văn Tự Cường`/,
        "`(c) ${year} StarCi Academy - Built by Nguyen Van Tu Cuong`",
    )
    // drop obsolete vn-ok comment if present on that line
    src = src.replace(
        /(`\(c\) \$\{year\} StarCi Academy - Built by Nguyen Van Tu Cuong`)\s*\/\/ vn-ok:[^\n]*/,
        "$1",
    )
    write(rel, src, "footer-credit-ascii-no-emoji")
}

// --- LearnShellLayout: English-only comments + JSDoc ---
{
    const rel = "src/components/layouts/LearnShellLayout/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    const replacements = [
        [/Trial viewers \("Học thử"\)/g, "Trial viewers (\"Try for free\")"],
        [/for the whole Ôn tập surface/g, "for the whole Flashcards/Review surface"],
        [/\/\/ the "Hỏi nhanh" quiz/g, "// the \"Quick quiz\" surface"],
        [/\/\/ "Học thẻ"\/"Ôn thẻ đến hạn" review/g, "// \"Study cards\"/\"Due review\" live session"],
        [/2026-07-11 đính chính: "ôn thẻ\r?\n\s*\/\/ giao diện y chang"/g,
            "2026-07-11 correction: \"card review UI matches study\""],
        [/\(thầy: "bỏ padding-6 ở đây này"/g, "(teacher: \"drop padding-6 here\""],
        [/\(Đề bài \/ Nộp bài\)/g, "(Brief / Submit)"],
        [/for "ôn tag yếu"/g, "for \"review weak tags\""],
    ]
    for (const [re, rep] of replacements) src = src.replace(re, rep)
    // remaining Vietnamese letters in comments — brute scan
    if (VN_LETTER.test(src)) {
        // line-by-line: only touch comment / JSDoc lines
        src = src.split(/\n/).map((line) => {
            if (!VN_LETTER.test(line)) return line
            // known leftovers
            return line
                .replace(/Học thử/g, "Try for free")
                .replace(/Ôn tập/g, "Flashcards")
                .replace(/Hỏi nhanh/g, "Quick quiz")
                .replace(/Học thẻ/g, "Study cards")
                .replace(/Ôn thẻ đến hạn/g, "Due review")
                .replace(/đính chính/g, "correction")
                .replace(/ôn thẻ giao diện y chang/g, "card review UI matches study")
                .replace(/thầy/g, "teacher")
                .replace(/bỏ padding-6 ở đây này/g, "drop padding-6 here")
                .replace(/Đề bài/g, "Brief")
                .replace(/Nộp bài/g, "Submit")
                .replace(/ôn tag yếu/g, "review weak tags")
        }).join("\n")
    }
    if (!/\/\*\*[\s\S]*?\*\/\s*\nexport const LearnShellLayout/.test(src)) {
        src = src.replace(
            /export const LearnShellLayout = /,
            `/** Learn course shell: left/right rails, enroll gate, and full-bleed work surfaces. */\nexport const LearnShellLayout = `,
        )
    }
    write(rel, src, "english-comments-plus-export-jsdoc")
}

// --- FlexWrapButtonRadio: scrub emoji + rename handlePress ---
{
    const rel = "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    src = scrubEmojiText(src)
    src = src.replace(/\bhandlePress\b/g, "onPressCandidate")
    // prefer onPress per rule — but avoid colliding with Button onPress JSX attr naming confusion;
    // rule wants onXxx not handleXxx. Use onPressCandidate then rename to onItemPress for clarity.
    src = src.replace(/\bonPressCandidate\b/g, "onItemPress")
    write(rel, src, "emoji-scrub-and-handler-on-prefix")
}

// --- PageHeader / ConnectSheet / TabsCard / RadioGroup / Follow / Livestream / Payment emoji ---
for (const [rel, rules] of [
    ["src/components/blocks/layout/PageHeader/index.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/blocks/layout/ConnectSheet/index.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/blocks/navigation/TabsCard/index.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/blocks/skeleton/Skeleton/RadioGroup/index.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/overlays/modals/FollowListModal/component.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/overlays/modals/LivestreamCalendarModal/component.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/overlays/modals/PaymentModal/component.tsx", ["starci-fe/no-emoji-in-source"]],
    ["src/components/overlays/modals/PaymentModal/index.tsx", ["starci-fe/no-emoji-in-source"]],
]) {
    scrubFileEmoji(rel, rules)
}

// --- CvReviewLevelDetailsModal handler ---
{
    const rel = "src/components/overlays/modals/CvReviewLevelDetailsModal/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    src = src.replace(/\bhandleSelectReviewLevel\b/g, "onSelectReviewLevel")
    write(rel, src, "handler-on-prefix")
}

// --- DrawerContainer / ModalContainer JSDoc ---
{
    const rel = "src/components/overlays/drawers/DrawerContainer.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("/**") || !/\/\*\*[\s\S]*?\*\/\s*\nexport const DrawerContainer/.test(src)) {
        src = src.replace(
            /export const DrawerContainer = /,
            `/** Mounts the app-wide drawer overlays (attempts, E2E, AI chat, mini-cart). */\nexport const DrawerContainer = `,
        )
    }
    write(rel, src, "require-export-jsdoc")
}
{
    const rel = "src/components/overlays/modals/ModalContainer.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!/\/\*\*[\s\S]*?\*\/\s*\nexport const ModalContainer/.test(src)) {
        src = src.replace(
            /export const ModalContainer = /,
            `/** Mounts the app-wide modal overlays (auth, payment, search, consent, etc.). */\nexport const ModalContainer = `,
        )
    }
    write(rel, src, "require-export-jsdoc")
}

// --- Inline param types: AmbientBackground effects ---
const effectFixes = [
    ["src/components/blocks/layout/AmbientBackground/effects/BubblesEffect.tsx",
        "BubblesEffect",
        /export const BubblesEffect = \(\{ count = 30 \}: \{ count\?: number \}\) =>/,
        `/** Props for {@link BubblesEffect}. */\ninterface BubblesEffectProps {\n    /** Particle count. */\n    count?: number\n}\n\nexport const BubblesEffect = ({ count = 30 }: BubblesEffectProps) =>`],
    ["src/components/blocks/layout/AmbientBackground/effects/EmberEffect.tsx",
        "EmberEffect", null, null],
    ["src/components/blocks/layout/AmbientBackground/effects/FirefliesEffect.tsx",
        "FirefliesEffect", null, null],
    ["src/components/blocks/layout/AmbientBackground/effects/RainEffect.tsx",
        "RainEffect", null, null],
    ["src/components/blocks/layout/AmbientBackground/effects/SnowEffect.tsx",
        "SnowEffect", null, null],
    ["src/components/blocks/layout/AmbientBackground/effects/StarsEffect.tsx",
        "StarsEffect", null, null],
]

for (const [rel, name, re, rep] of effectFixes) {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    if (re && rep) {
        if (!src.includes(`${name}Props`)) src = src.replace(re, rep)
        write(rel, src, "named-inline-param-type")
        continue
    }
    // generic: `({ count = N }: { count?: number })`
    const m = src.match(new RegExp(`export const ${name} = \\(\\{ count = (\\d+) \\}: \\{ count\\?: number \\}\\) =>`))
    if (m && !src.includes(`${name}Props`)) {
        src = src.replace(
            m[0],
            `/** Props for {@link ${name}}. */\ninterface ${name}Props {\n    /** Particle count. */\n    count?: number\n}\n\nexport const ${name} = ({ count = ${m[1]} }: ${name}Props) =>`,
        )
        write(rel, src, "named-inline-param-type")
    } else {
        skipped.push({ path: rel, rules: ["starci-fe/no-inline-parameter-type"], reason: "pattern-miss" })
    }
}

// AuroraRibbon + WaveLayer
{
    const rel = "src/components/blocks/layout/AmbientBackground/effects/AuroraEffect.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("AuroraRibbonProps")) {
        src = src.replace(
            /const AuroraRibbon = \(\{\n    top,\n    duration,\n    delay,\n\}: \{ top: number, duration: number, delay: number \}\) =>/,
            `/** Props for {@link AuroraRibbon}. */\ninterface AuroraRibbonProps {\n    top: number\n    duration: number\n    delay: number\n}\n\nconst AuroraRibbon = ({\n    top,\n    duration,\n    delay,\n}: AuroraRibbonProps) =>`,
        )
        write(rel, src, "named-inline-param-type")
    }
}
{
    const rel = "src/components/blocks/layout/AmbientBackground/effects/WaveEffect.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("WaveLayerProps")) {
        src = src.replace(
            /const WaveLayer = \(\{\n    duration,\n    opacity,\n    bottom,\n    amplitude,\n\}: \{ duration: number, opacity: number, bottom: number, amplitude: number \}\) =>/,
            `/** Props for {@link WaveLayer}. */\ninterface WaveLayerProps {\n    duration: number\n    opacity: number\n    bottom: number\n    amplitude: number\n}\n\nconst WaveLayer = ({\n    duration,\n    opacity,\n    bottom,\n    amplitude,\n}: WaveLayerProps) =>`,
        )
        write(rel, src, "named-inline-param-type")
    }
}

// TabsBlock named types
{
    const rel = "src/components/blocks/rendering/MarkdownContent/TabsBlock/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("TabPaneProps")) {
        src = src.replace(
            /export const TabPane = \(\n    \{ children \}: \{ kind: "code" \| "preview", children\?: React\.ReactNode \},\n\) =>/,
            `/** Props for {@link TabPane}. */\ninterface TabPaneProps {\n    kind: "code" | "preview"\n    children?: React.ReactNode\n}\n\nexport const TabPane = (\n    { children }: TabPaneProps,\n) =>`,
        )
    }
    if (!src.includes("TabsBlockProps")) {
        src = src.replace(
            /export const TabsBlock = \(\{ children \}: \{ children\?: React\.ReactNode \}\) =>/,
            `/** Props for {@link TabsBlock}. */\ninterface TabsBlockProps {\n    children?: React.ReactNode\n}\n\nexport const TabsBlock = ({ children }: TabsBlockProps) =>`,
        )
    }
    write(rel, src, "named-inline-param-type")
}

// Navbar ShortcutHint
{
    const rel = "src/components/blocks/navigation/Navbar/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("ShortcutHintProps")) {
        src = src.replace(
            /const ShortcutHint = \(\{ shortcutLabel \}: \{ shortcutLabel: string \}\) =>/,
            `/** Props for {@link ShortcutHint}. */\ninterface ShortcutHintProps {\n    shortcutLabel: string\n}\n\nconst ShortcutHint = ({ shortcutLabel }: ShortcutHintProps) =>`,
        )
        write(rel, src, "named-inline-param-type")
    }
}

// SurfaceListCard RowLink
{
    const rel = "src/components/blocks/cards/SurfaceListCard/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("RowLinkProps")) {
        src = src.replace(
            /\}: \{\n    href: string\n    onClick\?: \(\) => void\n    className\?: string\n    dataComponent: string\n    children: React\.ReactNode\n\}\) =>/,
            `}: RowLinkProps) =>`,
        )
        // insert interface before the component — find `const RowLink`
        if (src.includes("}: RowLinkProps) =>") && !src.includes("interface RowLinkProps")) {
            src = src.replace(
                /const RowLink = \(/,
                `/** Props for {@link RowLink}. */\ninterface RowLinkProps {\n    href: string\n    onClick?: () => void\n    className?: string\n    dataComponent: string\n    children: React.ReactNode\n}\n\nconst RowLink = (`,
            )
        }
        write(rel, src, "named-inline-param-type")
    }
}

// PublicProfileLayout
{
    const rel = "src/components/layouts/PublicProfileLayout/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    if (!src.includes("PublicProfileLayoutProps")) {
        src = src.replace(
            /export const PublicProfileLayout = \(\{\n    children,\n\}: \{\n    children: ReactNode\n\}\) =>/,
            `/** Props for {@link PublicProfileLayout}. */\ninterface PublicProfileLayoutProps {\n    children: ReactNode\n}\n\nexport const PublicProfileLayout = ({\n    children,\n}: PublicProfileLayoutProps) =>`,
        )
        write(rel, src, "named-inline-param-type")
    }
}

// PersonalProjectWorkspaceLayout TaskView + similar
{
    const rel = "src/components/layouts/PersonalProjectWorkspaceLayout/index.tsx"
    let src = fs.readFileSync(path.join(ROOT, rel), "utf8")
    // find both inline param hits via regex
    const inlineRe = /\(\{\s*([a-zA-Z0-9_,\s]+)\s*\}: \{[^}]+\}\)/g
    // Only fix the two known: TaskView and whatever is at 543
    if (!src.includes("TaskViewProps")) {
        src = src.replace(
            /const TaskView = \(\{ taskId \}: \{ taskId: string \}\) =>/,
            `/** Props for {@link TaskView}. */\ninterface TaskViewProps {\n    taskId: string\n}\n\nconst TaskView = ({ taskId }: TaskViewProps) =>`,
        )
    }
    // second hit around 543 — inspect after first write
    const m2 = src.match(/const (\w+) = \(\{ (\w+) \}: \{ \2: string \}\) =>/)
    // broader: remaining inline object types on destructured params
    src = src.replace(
        /const (\w+) = \(\{ (\w+) \}: \{ \2: string \}\) =>/g,
        (full, name, prop) => {
            if (src.includes(`${name}Props`)) return full
            return `/** Props for {@link ${name}}. */\ninterface ${name}Props {\n    ${prop}: string\n}\n\nconst ${name} = ({ ${prop} }: ${name}Props) =>`
        },
    )
    write(rel, src, "named-inline-param-type")
}

console.log(JSON.stringify({ changed, skipped }, null, 2))
