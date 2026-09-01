#!/usr/bin/env node
/**
 * Fix indentation of principle inserts and hoist gap-only false-cleared holds
 * so the gate sees honest unnamed seams (documented in ledger).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

// Fix `gap={N}\n            principle=` → same indent as sibling attrs
function fixIndent(src) {
    return src.replace(
        /^([ \t]*)gap=\{(\d+)\}\r?\n[ \t]*principle="([^"]+)"/gm,
        (_, ind, gap, prin) => `${ind}gap={${gap}}\n${ind}principle="${prin}"`,
    )
}

const dirs = [
    ".storybook/components/nivo/blocks/expert-site",
    ".storybook/components/nivo/blocks/agent-os",
    ".storybook/components/nivo/blocks/catalog",
    ".storybook/components/nivo/pages/CatalogView",
    ".storybook/components/nivo/pages/ExpertSiteView",
    ".storybook/components/nivo/blocks/wallet",
    ".storybook/components/nivo/blocks/account",
    ".storybook/components/nivo/blocks/dashboard",
    ".storybook/components/nivo/blocks/support",
    ".storybook/components/nivo/blocks/billing",
    ".storybook/components/nivo/pages/Dashboard",
    ".storybook/components/nivo/pages/AgentOsConsole",
    ".storybook/components/nivo/pages/ControlPlaneOverview",
    ".storybook/components/nivo/pages/ExpertSiteOverview",
    ".storybook/components/nivo/blocks/domains",
]

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, out)
        else if (full.endsWith(".tsx")) out.push(full)
    }
    return out
}

let n = 0
for (const d of dirs) {
    for (const file of walk(path.join(ROOT, d))) {
        const src = fs.readFileSync(file, "utf8")
        const next = fixIndent(src)
        if (next !== src) {
            fs.writeFileSync(file, next)
            n++
        }
    }
}
console.log(`fixed indent in ${n} files`)
