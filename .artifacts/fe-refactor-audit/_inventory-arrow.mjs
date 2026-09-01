import fs from "node:fs"

const files = [
    ".storybook/components/composites/viewers/MarkdownContent/markdown-table.ts",
    ".storybook/components/frames/_spacing.ts",
    "src/app/[locale]/error.tsx",
    "src/app/[locale]/not-found.tsx",
    "src/components/frames/_spacing.ts",
    "src/modules/types/entities/content-body.ts",
    "src/modules/types/entities/content.ts",
    "src/modules/types/utils/challenge-section.ts",
    "src/modules/types/utils/programming-language.ts",
    "src/modules/utils/computations/pow-10.ts",
    "src/proxy.ts",
]

for (const f of files) {
    const src = fs.readFileSync(f, "utf8")
    const fns = [...src.matchAll(/^(export\s+(?:default\s+)?)?function\s+(\w+)/gm)].map((m) => ({
        exp: !!m[1],
        name: m[2],
        line: src.slice(0, m.index).split("\n").length,
    }))
    const counts = {}
    for (const x of fns) counts[x.name] = (counts[x.name] || 0) + 1
    console.log("\n" + f)
    for (const x of fns)
        console.log(" ", x.line, x.exp ? "export" : "local", x.name, counts[x.name] > 1 ? "OVERLOAD" : "")
}
