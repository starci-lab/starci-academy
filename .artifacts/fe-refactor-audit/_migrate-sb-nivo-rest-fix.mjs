#!/usr/bin/env node
/**
 * Re-apply missed migrations: insert principle into OWN attrs only (strip items/body payloads).
 */
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const ROOT = process.cwd()
const prev = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_migrate-sb-nivo-rest-result.json", "utf8"))
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]

// Reload MAP from the migrate script by re-declaring the missed targets from prev.missed + held principles we want.
// Read original MAP by evaluating the migrate file's MAP via dynamic import is hard; rebuild from result + scan.
const scan = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_scan-sb-nivo-rest-own.json", "utf8"))

// Principles intended for missed lines — from the migrate script notes (hardcode the missed set).
const MISSED_PRINCIPLES = {
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor.tsx": {
        208: "sibling-stack",
        232: "sibling-stack",
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteGenerate/ExpertSiteGenerate.tsx": {
        171: "sibling-stack",
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline.tsx": {
        133: "title-subtitle",
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager.tsx": {
        136: "sibling-stack",
    },
    ".storybook/components/nivo/blocks/expert-site/LeadDetail/LeadDetail.tsx": {
        138: "block-boundary",
    },
    ".storybook/components/nivo/blocks/expert-site/LeadsInboxCard/LeadsInboxCard.tsx": {
        92: "sibling-stack",
    },
    ".storybook/components/nivo/blocks/agent-os/AgentCard/AgentCard.tsx": {
        78: "label-field",
    },
    ".storybook/components/nivo/blocks/agent-os/AgentDetailDrawer/AgentDetailDrawer.tsx": {
        129: "block-boundary",
    },
    ".storybook/components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard.tsx": {
        79: "group-boundary",
    },
    ".storybook/components/nivo/blocks/agent-os/ChannelInbox/ChannelInbox.tsx": {
        105: "identity",
        112: "name-handle",
    },
    ".storybook/components/nivo/blocks/catalog/BuyConfirmModal/BuyConfirmModal.tsx": {
        120: "label-field",
    },
    ".storybook/components/nivo/blocks/catalog/UpgradeTierConfirmModal/UpgradeTierConfirmModal.tsx": {
        138: "label-field",
    },
    ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx": {
        187: "label-field",
        233: "label-field",
    },
    ".storybook/components/nivo/pages/ExpertSiteView/ExpertSiteView.tsx": {
        196: "sibling-stack",
    },
    ".storybook/components/nivo/blocks/wallet/WalletOverview/WalletOverview.tsx": {
        149: "label-field",
        158: "sibling-stack",
        181: "title-subtitle",
    },
    ".storybook/components/nivo/blocks/account/AccountProfile/AccountProfile.tsx": {
        66: "label-field",
    },
    ".storybook/components/nivo/blocks/account/AccountSecurity/AccountSecurity.tsx": {
        181: "sibling-stack",
    },
    ".storybook/components/nivo/pages/Dashboard/Dashboard.tsx": {
        75: "block-boundary",
    },
    ".storybook/components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview.tsx": {
        106: "block-boundary",
    },
    ".storybook/components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview.tsx": {
        242: "block-boundary",
    },
}

function stripPayloads(tag) {
    let out = tag
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g")
        let m
        while ((m = re.exec(out))) {
            let i = m.index + m[0].length - 1,
                depth = 0
            for (; i < out.length; i++) {
                if (out[i] === "{") depth++
                else if (out[i] === "}" && --depth === 0) {
                    out = out.slice(0, m.index) + `«${prop}»` + out.slice(i + 1)
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
        let i = m.index + m[0].length - 1,
            depth = 0
        for (; i < src.length; i++) {
            const c = src[i]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) break
        }
        yield { name: m[1], tag: src.slice(m.index, i + 1), line: src.slice(0, m.index).split("\n").length, index: m.index, end: i + 1 }
    }
}

function insertPrincipleOwn(tag, principle) {
    const own = stripPayloads(tag)
    if (/\bprinciple\s*=/.test(own) || /\bdata-principle\s*=/.test(own)) return null

    // Find insertion point in the REAL tag: after first own gap= or after frame name
    // Work on the prefix before first items=/body=
    let cut = tag.length
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const idx = tag.search(new RegExp(`\\b${prop}\\s*=\\s*\\{`))
        if (idx >= 0 && idx < cut) cut = idx
    }
    const head = tag.slice(0, cut)
    const tail = tag.slice(cut)

    let newHead
    if (/\bgap\s*=\s*\{?\s*\d+\}?/.test(head)) {
        newHead = head.replace(/(\bgap\s*=\s*\{?\s*\d+\}?)/, `$1\n            principle="${principle}"`)
    } else {
        newHead = head.replace(/^(<[A-Za-z0-9]+)/, `$1\n            principle="${principle}"`)
    }
    return newHead + tail
}

const applied = []
const missed = []

for (const [rel, lines] of Object.entries(MISSED_PRINCIPLES)) {
    const full = path.join(ROOT, rel)
    let src = fs.readFileSync(full, "utf8")
    let changed = false
    const entries = Object.entries(lines)
        .map(([l, p]) => [Number(l), p])
        .sort((a, b) => b[0] - a[0])

    for (const [line, principle] of entries) {
        // Line numbers may have shifted from prior inserts — match by scanning current holes near original.
        const frames = [...frameTags(src)]
        // Prefer exact line; else find nearest frame of same name without own principle within ±15 lines
        let hit = frames.find((f) => f.line === line)
        if (!hit || /\bprinciple\s*=/.test(stripPayloads(hit.tag))) {
            // find from scan: original name at line
            const orig = scan.find((s) => s.rel === rel && s.line === line)
            if (orig) {
                hit = frames.find(
                    (f) =>
                        f.name === orig.name &&
                        Math.abs(f.line - line) <= 20 &&
                        !/\bprinciple\s*=/.test(stripPayloads(f.tag)),
                )
            }
        }
        if (!hit) {
            missed.push({ rel, line, error: "not found" })
            continue
        }
        if (/\bprinciple\s*=/.test(stripPayloads(hit.tag))) {
            missed.push({ rel, line, at: hit.line, error: "already principled" })
            continue
        }
        const next = insertPrincipleOwn(hit.tag, principle)
        if (!next) {
            missed.push({ rel, line, at: hit.line, error: "insert failed" })
            continue
        }
        src = src.slice(0, hit.index) + next + src.slice(hit.end)
        changed = true
        applied.push({ rel, line, at: hit.line, principle })
    }
    if (changed) fs.writeFileSync(full, src)
}

console.log(`applied ${applied.length}`)
console.log(`missed ${missed.length}`)
if (missed.length) console.log(JSON.stringify(missed, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_migrate-sb-nivo-rest-result2.json",
    JSON.stringify({ applied, missed }, null, 2),
)
