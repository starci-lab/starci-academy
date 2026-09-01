#!/usr/bin/env node
/**
 * Finish remaining nivo / nivoexpert / InputTags pattern holes:
 * - gap-4 Grid+columns → content-row
 * - real flex-action / chip-row seams at gap 2 → retune gap={3} + principle
 * - ExpertSiteManager skeleton CTA → flex-action
 * Holds stay for seams already ledgered where no token fits.
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

/** Exact own-attr tag prefixes to patch (first match per file+name+gap combo via line). */
const PATCHES = [
    // gap-4 peer grids → content-row
    {
        file: ".storybook/components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard.tsx",
        find: "<Grid\n                                columns={{ base: 1, md: 3 }}\n                                gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/blocks/dashboard/KpiRow/KpiRow.tsx",
        find: "<Grid\n            columns={{ base: 1, sm: 2, lg: 4 }}\n            gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline.tsx",
        find: "<Grid\n                    columns={PIPELINE_COLUMNS}\n                    gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/blocks/landing/DashboardProof/DashboardProof.tsx",
        find: null, // resolve dynamically
        name: "Grid",
        gap: "4",
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/blocks/landing/SolutionByIndustry/SolutionByIndustry.tsx",
        name: "Grid",
        gap: "4",
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/blocks/landing/SystemFlow/SystemFlow.tsx",
        name: "Grid",
        gap: "4",
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/pages/AgentOsConsole/AgentOsConsole.tsx",
        find: "<Grid\n                        columns={{ base: 1, sm: 2, lg: 4 }}\n                        gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx",
        find: "<Grid\n                                        columns={{ base: 1, sm: 2, lg: 3 }}\n                                        gap={4}\n                                        isSkeleton",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx",
        find: "<Grid\n                                        columns={{ base: 1, sm: 2, lg: 3 }}\n                                        gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview.tsx",
        find: "<Grid\n                            columns={{ base: 1, lg: 2 }}\n                            gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    {
        file: ".storybook/components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview.tsx",
        find: "<Grid\n                        columns={{ base: 1, sm: 2, lg: 4 }}\n                        gap={4}",
        insertAfterGap: true,
        principle: "content-row",
    },
    // ExpertSiteManager skeleton CTA
    {
        file: ".storybook/components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager.tsx",
        find: "<StackH\n                                        gap={3}\n                                        justify=\"end\"\n                                        isSkeleton",
        insertAfterGap: true,
        principle: "flex-action",
    },
    // Retune gap-2 control rows → flex-action gap 3
    {
        file: ".storybook/components/nivo/blocks/wallet/WalletOverview/WalletOverview.tsx",
        find: "<StackH\n                                                            gap={2}\n                                                            at=\"sm\"",
        replace: "<StackH\n                                                            gap={3}\n                                                            principle=\"flex-action\"\n                                                            at=\"sm\"",
    },
    {
        file: ".storybook/components/nivoexpert/overlays/modals/BanMemberModal/BanMemberModal.tsx",
        find: "<StackH\n                        gap={2}\n                        justify=\"end\"",
        replace: "<StackH\n                        gap={3}\n                        principle=\"flex-action\"\n                        justify=\"end\"",
    },
    {
        file: ".storybook/components/nivoexpert/overlays/modals/SetMemberRoleModal/SetMemberRoleModal.tsx",
        find: null,
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "flex-action",
    },
    {
        file: ".storybook/components/nivoexpert/overlays/drawers/MemberDetailDrawer/MemberDetailDrawer.tsx",
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "flex-action",
    },
    {
        file: ".storybook/components/nivoexpert/layouts/TenantLandingShell/TenantLandingShell.tsx",
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "flex-action",
    },
    {
        file: ".storybook/components/nivoexpert/blocks/automation/AgentTaskConsole/AgentTaskConsole.tsx",
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "flex-action",
    },
    // Retune gap-2 chip rows → chip-row gap 3
    {
        file: ".storybook/components/nivoexpert/blocks/classroom/CourseView/CourseView.tsx",
        find: "<StackH\n                        gap={2}\n                        align=\"center\"",
        replace: "<StackH\n                        gap={3}\n                        principle=\"chip-row\"\n                        align=\"center\"",
    },
    {
        file: ".storybook/components/nivoexpert/blocks/studio/LessonEditorPanel/LessonEditorPanel.tsx",
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "chip-row",
    },
    {
        file: ".storybook/components/nivoexpert/overlays/drawers/PostModerationDrawer/PostModerationDrawer.tsx",
        name: "StackH",
        gap: "2",
        retuneGap: 3,
        principle: "chip-row",
    },
]

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

function hasOwnPrinciple(tag) {
    return /\bprinciple\s*=/.test(stripPayloads(tag))
}

function ownGap(tag) {
    return (stripPayloads(tag).match(/\bgap\s*=\s*\{?\s*(\d+)/) || [])[1] || ""
}

const results = { applied: [], missed: [], skipped: [] }

for (const patch of PATCHES) {
    const full = path.join(ROOT, patch.file)
    if (!fs.existsSync(full)) {
        results.missed.push({ file: patch.file, error: "missing" })
        continue
    }
    let src = fs.readFileSync(full, "utf8")

    if (patch.replace && patch.find) {
        if (!src.includes(patch.find)) {
            results.missed.push({ file: patch.file, error: "find not found", find: patch.find.slice(0, 80) })
            continue
        }
        if (src.includes(patch.replace)) {
            results.skipped.push({ file: patch.file, reason: "already replaced" })
            continue
        }
        src = src.replace(patch.find, patch.replace)
        fs.writeFileSync(full, src)
        results.applied.push({ file: patch.file, via: "replace", principle: patch.principle })
        continue
    }

    if (patch.find && patch.insertAfterGap) {
        if (!src.includes(patch.find)) {
            results.missed.push({ file: patch.file, error: "find not found", find: patch.find.slice(0, 80) })
            continue
        }
        // Find the frame that starts with this prefix
        const idx = src.indexOf(patch.find)
        const frames = [...frameTags(src)]
        const hit = frames.find((f) => f.index === idx || (f.index <= idx && f.end > idx))
        if (!hit) {
            results.missed.push({ file: patch.file, error: "frame not resolved for find" })
            continue
        }
        if (hasOwnPrinciple(hit.tag)) {
            results.skipped.push({ file: patch.file, line: hit.line, reason: "already has principle" })
            continue
        }
        const own = stripPayloads(hit.tag)
        if (!/\bgap\s*=\s*\{?\s*\d+\}?/.test(own)) {
            results.missed.push({ file: patch.file, line: hit.line, error: "no gap on own attrs" })
            continue
        }
        // Insert principle into OWN attrs only — replace in the full tag's first gap match that is in the own prefix
        const ownLen = (() => {
            // reconstruct: find where payloads start
            const m = hit.tag.match(/\b(items|body|children|content|skeleton|footer|header)\s*=\s*\{/)
            return m ? m.index : hit.tag.length
        })()
        const head = hit.tag.slice(0, ownLen)
        const tail = hit.tag.slice(ownLen)
        if (/\bprinciple\s*=/.test(head)) {
            results.skipped.push({ file: patch.file, line: hit.line, reason: "head has principle" })
            continue
        }
        const nextHead = head.replace(/(\bgap\s*=\s*\{?\s*\d+\}?)/, `$1\n                    principle="${patch.principle}"`)
        if (nextHead === head) {
            results.missed.push({ file: patch.file, line: hit.line, error: "gap replace failed" })
            continue
        }
        src = src.slice(0, hit.index) + nextHead + tail + src.slice(hit.end)
        fs.writeFileSync(full, src)
        results.applied.push({ file: patch.file, line: hit.line, principle: patch.principle, via: "insert" })
        continue
    }

    // Dynamic by name+gap
    if (patch.name && patch.gap) {
        const frames = [...frameTags(src)].filter(
            (f) => f.name === patch.name && ownGap(f.tag) === patch.gap && !hasOwnPrinciple(f.tag),
        )
        if (!frames.length) {
            results.skipped.push({ file: patch.file, reason: "no matching unnamed frame", name: patch.name, gap: patch.gap })
            continue
        }
        // Apply bottom-up
        for (const hit of frames.reverse()) {
            const ownLen = (() => {
                const m = hit.tag.match(/\b(items|body|children|content|skeleton|footer|header)\s*=\s*\{/)
                return m ? m.index : hit.tag.length
            })()
            let head = hit.tag.slice(0, ownLen)
            const tail = hit.tag.slice(ownLen)
            if (patch.retuneGap != null) {
                head = head.replace(/\bgap\s*=\s*\{?\s*\d+\}?/, `gap={${patch.retuneGap}}`)
            }
            if (!/\bprinciple\s*=/.test(head)) {
                if (/\bgap\s*=\s*\{?\s*\d+\}?/.test(head)) {
                    head = head.replace(/(\bgap\s*=\s*\{?\s*\d+\}?)/, `$1\n                        principle="${patch.principle}"`)
                } else {
                    head = head.replace(`<${hit.name}`, `<${hit.name}\n                        principle="${patch.principle}"`)
                }
            }
            src = src.slice(0, hit.index) + head + tail + src.slice(hit.end)
            results.applied.push({
                file: patch.file,
                line: hit.line,
                principle: patch.principle,
                retuneGap: patch.retuneGap,
                via: "dynamic",
            })
        }
        fs.writeFileSync(full, src)
        continue
    }

    results.missed.push({ file: patch.file, error: "unhandled patch shape" })
}

console.log(JSON.stringify(results, null, 2))
fs.writeFileSync(".artifacts/fe-refactor-audit/_finish-nivo-holes-result.json", JSON.stringify(results, null, 2))
