#!/usr/bin/env node
/**
 * Finish remaining holes via own-attr frame matching (CRLF-safe).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FRAMES = [
    "StackH",
    "StackV",
    "Cluster",
    "Grid",
    "Split",
    "ResponsiveRow",
    "ResponsiveCluster",
    "RailShell",
    "SplitWorkspace",
    "Reel",
]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/

/** file → list of { name, gap, principle, retuneGap?, requireDecision?: true, pred?: (own)=>bool } */
const MAP = {
    ".storybook/components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/blocks/dashboard/KpiRow/KpiRow.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/pages/AgentOsConsole/AgentOsConsole.tsx": [
        { name: "Grid", gap: "4", principle: "content-row", pred: (o) => /\bcolumns\s*=/.test(o) && !/\bprinciple\s*=/.test(o) },
    ],
    ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview.tsx": [
        { name: "Grid", gap: "4", principle: "content-row" },
    ],
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager.tsx": [
        {
            name: "StackH",
            gap: "3",
            principle: "flex-action",
            pred: (o) => /justify\s*=\s*["']end["']/.test(o) && !/\bprinciple\s*=/.test(o),
        },
    ],
    ".storybook/components/nivo/blocks/wallet/WalletOverview/WalletOverview.tsx": [
        {
            name: "StackH",
            gap: "2",
            retuneGap: 3,
            principle: "flex-action",
            pred: (o) => /\bat\s*=/.test(o) && !/\bprinciple\s*=/.test(o),
        },
    ],
    ".storybook/components/nivoexpert/overlays/modals/BanMemberModal/BanMemberModal.tsx": [
        {
            name: "StackH",
            gap: "2",
            retuneGap: 3,
            principle: "flex-action",
            pred: (o) => /justify\s*=/.test(o) && !/\bprinciple\s*=/.test(o),
        },
    ],
    ".storybook/components/nivoexpert/blocks/classroom/CourseView/CourseView.tsx": [
        {
            name: "StackH",
            gap: "2",
            retuneGap: 3,
            principle: "chip-row",
            pred: (o) => /align\s*=/.test(o) && !/\bprinciple\s*=/.test(o),
        },
    ],
}

function stripPayloads(tag) {
    let out = tag
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g")
        let m
        while ((m = re.exec(out))) {
            let i = m.index + m[0].length - 1
            let d = 0
            for (; i < out.length; i++) {
                if (out[i] === "{") d++
                else if (out[i] === "}" && --d === 0) {
                    out = out.slice(0, m.index) + out.slice(i + 1)
                    re.lastIndex = m.index
                    break
                }
            }
        }
    }
    return out
}

function* frameTags(src) {
    const re = new RegExp(`<(${FRAMES.join("|")})(\\s)`, "g")
    let m
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length - 1
        let depth = 0
        for (; i < src.length; i++) {
            const c = src[i]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) break
        }
        yield {
            name: m[1],
            tag: src.slice(m.index, i + 1),
            line: src.slice(0, m.index).split("\n").length,
            index: m.index,
            end: i + 1,
        }
    }
}

function ownGap(own) {
    return (own.match(/\bgap\s*=\s*\{?\s*(\d+)/) || [])[1] || ""
}

function ownLen(tag) {
    const m = tag.match(/\b(items|body|children|content|skeleton|footer|header)\s*=\s*\{/)
    return m ? m.index : tag.length
}

const results = { applied: [], missed: [], skipped: [] }

for (const [rel, rules] of Object.entries(MAP)) {
    const full = path.join(ROOT, rel)
    if (!fs.existsSync(full)) {
        results.missed.push({ rel, error: "missing" })
        continue
    }
    let src = fs.readFileSync(full, "utf8")
    let changed = false

    for (const rule of rules) {
        // Re-scan each rule; apply one match at a time bottom-up within rule
        for (;;) {
            const frames = [...frameTags(src)]
            const hits = frames.filter((f) => {
                if (f.name !== rule.name) return false
                const own = stripPayloads(f.tag)
                if (/\bprinciple\s*=/.test(own)) return false
                if (ownGap(own) !== rule.gap) return false
                if (rule.pred && !rule.pred(own)) return false
                // For grids, require decision (columns)
                if (f.name === "Grid" && !DECISION.test(own)) return false
                return true
            })
            if (!hits.length) break
            // Apply last hit first
            const hit = hits[hits.length - 1]
            const len = ownLen(hit.tag)
            let head = hit.tag.slice(0, len)
            const tail = hit.tag.slice(len)
            if (rule.retuneGap != null) {
                head = head.replace(/\bgap\s*=\s*\{?\s*\d+\}?/, `gap={${rule.retuneGap}}`)
            }
            if (/\bgap\s*=\s*\{?\s*\d+\}?/.test(head)) {
                head = head.replace(
                    /(\bgap\s*=\s*\{?\s*\d+\}?)/,
                    `$1\n                    principle="${rule.principle}"`,
                )
            } else {
                head = head.replace(`<${hit.name}`, `<${hit.name}\n                    principle="${rule.principle}"`)
            }
            src = src.slice(0, hit.index) + head + tail + src.slice(hit.end)
            changed = true
            results.applied.push({
                rel,
                line: hit.line,
                principle: rule.principle,
                retuneGap: rule.retuneGap ?? null,
            })
            // Only one Grid/StackH per rule typically; loop continues if more unnamed matches
            if (hits.length === 1) break
        }
    }

    if (changed) fs.writeFileSync(full, src)
    else {
        // Check if already done
        const still = [...frameTags(src)].filter((f) => {
            const own = stripPayloads(f.tag)
            return rules.some(
                (r) =>
                    f.name === r.name &&
                    ownGap(own) === r.gap &&
                    !/\bprinciple\s*=/.test(own) &&
                    (!r.pred || r.pred(own)),
            )
        })
        if (still.length) {
            results.missed.push({
                rel,
                error: "unmatched remaining",
                lines: still.map((s) => s.line),
            })
        } else {
            results.skipped.push({ rel, reason: "already clean for rules" })
        }
    }
}

console.log(JSON.stringify(results, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_finish-nivo-holes-result2.json",
    JSON.stringify(results, null, 2),
)
