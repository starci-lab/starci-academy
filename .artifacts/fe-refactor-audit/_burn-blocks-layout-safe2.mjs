/**
 * Safe re-apply: emoji scrub WITHOUT collapsing whitespace; FlexWrap handler;
 * PaymentModal skeleton branch.
 */
import fs from "node:fs"
import path from "node:path"
import { hasEmoji } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()

const scrubEmojiOnly = (text) => {
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
        [/·/g, "-"],
    ]
    for (const [re, rep] of map) out = out.replace(re, rep)
    out = out.replace(/\p{Extended_Pictographic}/gu, "")
    out = out.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    return out
}

const files = [
    "src/components/blocks/layout/PageHeader/index.tsx",
    "src/components/blocks/layout/ConnectSheet/index.tsx",
    "src/components/blocks/navigation/TabsCard/index.tsx",
    "src/components/blocks/skeleton/Skeleton/RadioGroup/index.tsx",
    "src/components/overlays/modals/FollowListModal/component.tsx",
    "src/components/overlays/modals/LivestreamCalendarModal/component.tsx",
    "src/components/overlays/modals/PaymentModal/component.tsx",
    "src/components/overlays/modals/PaymentModal/index.tsx",
    "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
]

const changed = []
for (const rel of files) {
    const abs = path.join(ROOT, rel)
    const prev = fs.readFileSync(abs, "utf8")
    let next = scrubEmojiOnly(prev)
    if (rel.endsWith("FlexWrapButtonRadio/index.tsx")) {
        next = next.replace(/\bhandlePress\b/g, "onItemPress")
    }
    if (prev !== next) {
        fs.writeFileSync(abs, next)
        changed.push(rel)
    }
}

{
    const rel = "src/components/overlays/modals/PaymentModal/component.tsx"
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    if (!src.includes("const GatewayTrailing")) {
        const replaced = src.replace(
            /trailing:\s*\(\)\s*=>\s*\(\s*method\.isPending\s*\?\s*<Spinner size="sm" \/>\s*:\s*<ArrowRightIcon aria-hidden focusable="false" className="size-5 text-muted" \/>\s*\),/,
            "trailing: () => <GatewayTrailing isPending={method.isPending} />,",
        )
        if (replaced === src) {
            console.log("PaymentModal trailing pattern miss")
        } else {
            src = replaced.replace(
                /(\/\*\* One gateway row[\s\S]*?\*\/\n)const gatewayRow =/,
                `/** Trailing control for a gateway row - spinner while pending, else a chevron. */
interface GatewayTrailingProps {
    isPending: boolean
}

const GatewayTrailing = ({ isPending }: GatewayTrailingProps) => {
    if (isPending) {
        return <Spinner size="sm" />
    }
    return <ArrowRightIcon aria-hidden focusable="false" className="size-5 text-muted" />
}

$1const gatewayRow =`,
            )
            fs.writeFileSync(abs, src)
            changed.push(rel + "#skeleton")
        }
    }
}

console.log(JSON.stringify({ changed }, null, 2))
for (const rel of files) {
    const s = fs.readFileSync(path.join(ROOT, rel), "utf8")
    console.log(
        rel,
        "emoji",
        hasEmoji(s),
        "indent4",
        (s.match(/\n {4}\S/g) || []).length,
        "indent1bad",
        (s.match(/\n [A-Za-z<{/]/g) || []).length,
    )
}
