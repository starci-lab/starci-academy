import { readFileSync, writeFileSync } from "node:fs"

const product = JSON.parse(
    readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json", "utf8"),
)

const rel = (p) => p.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")

function sample(rule, pred, n = 10) {
    const out = []
    for (const f of product) {
        const p = rel(f.filePath)
        if (!pred(p)) continue
        for (const m of f.messages || []) {
            if (m.ruleId !== rule) continue
            out.push({ file: p, line: m.line, msg: String(m.message).slice(0, 120) })
            if (out.length >= n) return out
        }
    }
    return out
}

function bucketRule(rule) {
    const frame = {}
    for (const f of product) {
        for (const m of f.messages || []) {
            if (m.ruleId !== rule) continue
            const p = rel(f.filePath)
            let bucket = "other"
            if (p.includes(".storybook/components/atoms")) bucket = "sb-atoms"
            else if (p.includes(".storybook/components/frames")) bucket = "sb-frames"
            else if (p.includes(".storybook/components/composites")) bucket = "sb-composites"
            else if (p.includes(".storybook/components/blocks")) bucket = "sb-blocks"
            else if (p.includes(".storybook/components/nivo")) bucket = "sb-nivo"
            else if (p.includes(".storybook/components/nivoexpert")) bucket = "sb-nivoexpert"
            else if (p.includes(".storybook/components/")) bucket = "sb-components-other"
            else if (p.includes(".storybook/stories")) bucket = "sb-stories"
            else if (p.includes(".storybook/utils")) bucket = "sb-utils"
            else if (p.includes("src/components/atoms")) bucket = "src-atoms"
            else if (p.includes("src/components/frames")) bucket = "src-frames"
            else if (p.includes("src/components/composites")) bucket = "src-composites"
            else if (p.includes("src/components/blocks")) bucket = "src-blocks"
            else if (p.includes("src/components/pages")) bucket = "src-pages"
            else if (p.includes("src/components/layouts")) bucket = "src-layouts"
            else if (p.includes("src/components/overlays")) bucket = "src-overlays"
            else if (p.includes("src/components/")) bucket = "src-components-other"
            else if (p.includes("src/app/")) bucket = "src-app"
            else if (p.includes("src/modules/")) bucket = "src-modules"
            else if (p.includes("src/resources/")) bucket = "src-resources"
            else if (p.includes("src/")) bucket = "src-other"
            frame[bucket] = (frame[bucket] || 0) + 1
        }
    }
    return frame
}

const report = {
    requireFrameSelfDeclare: bucketRule("starci-fe/require-frame-self-declare"),
    requireIdentityRoot: bucketRule("starci-fe/require-identity-root"),
    noRawShape: bucketRule("starci-fe/no-raw-shape-at-sentence-tier"),
    noClassname: bucketRule("starci-fe/no-classname-at-sentence-tier"),
    noHeroui: bucketRule("starci-fe/no-heroui-outside-vocabulary"),
    noCn: bucketRule("starci-fe/no-cn-above-vocabulary"),
    pageFolder: bucketRule("starci-fe/page-folder-two-files-only"),
    noVi: bucketRule("starci-fe/no-vietnamese-in-source-authoring"),
    noEmoji: bucketRule("starci-fe/no-emoji-in-source"),
    samples: {
        identityOnAtoms: sample("starci-fe/require-identity-root", (p) => p.includes("/components/atoms/")),
        frameOnAtoms: sample("starci-fe/require-frame-self-declare", (p) => p.includes("/components/atoms/")),
        identityOnStories: sample("starci-fe/require-identity-root", (p) => p.endsWith(".stories.tsx")),
        frameOnApp: sample("starci-fe/require-frame-self-declare", (p) => p.startsWith("src/app/")),
        viMainPreview: sample(
            "starci-fe/no-vietnamese-in-source-authoring",
            (p) => /main\.ts$|preview\.tsx$|test-runner/.test(p),
            20,
        ),
        identityNivoexpert: sample("starci-fe/no-identity-wrapper-div", (p) => p.includes("nivoexpert"), 15),
        anatomyOverlay: sample("starci-fe/no-anatomy-overlay", () => true, 10),
    },
}

writeFileSync(
    ".artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-buckets.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
