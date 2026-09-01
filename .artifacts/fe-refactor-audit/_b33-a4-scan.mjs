import fs from "node:fs"

const m = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json", "utf8"),
)
const files = m.manifests["agent-4-stack-flex-cluster"].files
const classNamesRe = /classNames=\{/
const principleRe = /principle=/
const gapRe = /\bgap=\{/
const padRe = /padding=\{/
const alignRe = /align=/
const justifyRe = /justify=/
const flexFillRe = /flex-1|min-h-0|w-full|h-full|flex-fill|min-w-0/

for (const f of files) {
    if (!fs.existsSync(f)) {
        console.log("MISSING", f)
        continue
    }
    const lines = fs.readFileSync(f, "utf8").split(/\n/)
    const hits = []
    for (let i = 0; i < lines.length; i++) {
        const open = lines[i].match(/<(StackH|StackV|Flex|Cluster|ResponsiveCluster)\b/)
        if (!open) continue
        const chunk = lines.slice(i, Math.min(lines.length, i + 25)).join("\n")
        let depth = 0
        let end = -1
        for (let j = 0; j < chunk.length; j++) {
            const c = chunk[j]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) {
                end = j
                break
            }
        }
        const attrs = end >= 0 ? chunk.slice(0, end + 1) : chunk.slice(0, 500)
        const flags = []
        if (classNamesRe.test(attrs)) flags.push("classNames")
        if (principleRe.test(attrs)) flags.push("principle")
        if (gapRe.test(attrs)) flags.push("gap")
        if (padRe.test(attrs)) flags.push("padding")
        if (alignRe.test(attrs)) flags.push("align")
        if (justifyRe.test(attrs)) flags.push("justify")
        if (flexFillRe.test(attrs)) flags.push("flexish")
        // interesting if classNames OR principle+escape OR flexish OR undeclared with gap
        const interesting =
            flags.includes("classNames") ||
            flags.includes("flexish") ||
            (flags.includes("principle") &&
                (flags.includes("gap") ||
                    flags.includes("padding") ||
                    flags.includes("align") ||
                    flags.includes("justify"))) ||
            (!flags.includes("principle") &&
                (flags.includes("gap") || flags.includes("padding")))
        if (interesting) {
            hits.push({
                line: i + 1,
                tag: open[1],
                flags,
                snippet: attrs.replace(/\s+/g, " ").slice(0, 180),
            })
        }
    }
    if (hits.length) {
        console.log("\n" + f)
        for (const h of hits) {
            console.log(
                ` L${h.line} <${h.tag}> [${h.flags.join(",")}] ${h.snippet}`,
            )
        }
    }
}
