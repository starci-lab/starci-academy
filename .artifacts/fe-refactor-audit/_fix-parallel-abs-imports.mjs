import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const debt = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"), "utf8"),
)

const parallel = debt["starci-fe/no-parallel-skeleton"].unlocked
const imports = parallel.filter((e) => e.msg.startsWith("Import"))
const props = parallel.filter((e) => e.msg.startsWith("Prop"))

const byName = {}
for (const e of imports) {
    const m = e.msg.match(/Import `([^`]+)`/)
    const n = m ? m[1] : "?"
    byName[n] = (byName[n] || 0) + 1
}
console.log("import names", byName)
console.log("prop count", props.length)
console.log(
    "prop files",
    [...new Set(props.map((p) => p.file))].join("\n"),
)

/** Convert relative FieldSkeleton / TriggerSkeleton imports to absolute shared paths. */
const ABS = {
    FieldSkeleton: {
        sb: "@sb-components/atoms/forms/_input/FieldSkeleton",
        src: "@/components/atoms/forms/_input/FieldSkeleton",
    },
    TriggerSkeleton: {
        sb: "@sb-components/atoms/forms/_select/TriggerSkeleton",
        src: "@/components/atoms/forms/_select/TriggerSkeleton",
    },
}

const results = { rewritten: [], skipped: [], hard: [] }

for (const e of imports) {
    const m = e.msg.match(/Import `([^`]+)`/)
    const name = m?.[1]
    if (!name || !(name in ABS)) {
        results.hard.push({ file: e.file, line: e.line, name, reason: "not-abs-candidate" })
        continue
    }
    const file = e.file
    const abs = resolve(ROOT, file)
    if (!existsSync(abs)) {
        results.hard.push({ file, reason: "missing" })
        continue
    }
    let src = readFileSync(abs, "utf8")
    const isSb = file.includes(".storybook/")
    const target = ABS[name][isSb ? "sb" : "src"]
    const re = new RegExp(
        String.raw`import\s*\{\s*${name}\s*\}\s*from\s*["'](\.\.?/[^"']+)["']`,
    )
    const match = src.match(re)
    if (!match) {
        results.skipped.push({ file, name, reason: "no-relative-import-match" })
        continue
    }
    src = src.replace(re, `import { ${name} } from "${target}"`)
    writeFileSync(abs, src)
    results.rewritten.push({ file, name, from: match[1], to: target })
}

writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/_parallel-abs-import-result.json"),
    JSON.stringify(results, null, 2),
)
console.log(
    JSON.stringify(
        {
            rewritten: results.rewritten.length,
            skipped: results.skipped.length,
            hard: results.hard.length,
        },
        null,
        2,
    ),
)
console.log(
    "remaining hard import names",
    [...new Set(results.hard.map((h) => h.name))],
)
