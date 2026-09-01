#!/usr/bin/env node
/**
 * Apply curated principle migrations for sb-nivo-rest.
 * Actions: { principle } | { hold, reason } | { hoist } (clear nested false positive)
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]

/** @type {Record<string, Record<number, { principle?: string, hold?: string, note?: string }>>} */
const MAP = {
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor.tsx": {
        135: { principle: "flex-action", note: "address + publish controls" },
        208: { principle: "sibling-stack", note: "peer editor cards" },
        232: { principle: "sibling-stack", note: "peer form fields" },
        261: { principle: "flex-action", note: "save button row justify-end" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteGenerate/ExpertSiteGenerate.tsx": {
        108: { principle: "title-subtitle", note: "draft heading over body lines at 4px" },
        112: { hold: "draft-heading-chip-gap2", note: "heading + optional chip justify-between at gap 2 — not icon-text/title-subtitle/separator-dot" },
        171: { principle: "sibling-stack", note: "title / description / field / draft / submit peers" },
        204: { principle: "flex-action", note: "generate button row" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteHeader/ExpertSiteHeader.tsx": {
        96: { principle: "content-row", note: "header identity | actions" },
        187: { principle: "content-row", note: "header identity | actions" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads.tsx": {
        111: { principle: "sibling-stack", note: "lead row body stack" },
        116: { hold: "lead-row-meta-gap3", note: "name+chip | timestamp at gap 3 — content-row is step 4; no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline.tsx": {
        133: { principle: "title-subtitle", note: "column title over count" },
        138: { hold: "pipeline-column-header-gap2", note: "title | count at gap 2 justify-between — no honest step-2 token" },
        179: { principle: "icon-text", note: "at=sm icon/text compact" },
        325: { principle: "content-row", note: "pipeline column grid segments at step 4" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager.tsx": {
        80: { principle: "sibling-stack", note: "manager body peers" },
        96: { hold: "manager-row-meta-gap3", note: "site row meta at gap 3 justify-between — no step-3 row-segment token" },
        136: { principle: "sibling-stack", note: "empty/action peers" },
        153: { principle: "flex-action", note: "CTA justify-end" },
    },
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteOfferingsEditor/ExpertSiteOfferingsEditor.tsx": {
        91: { principle: "flex-action", note: "offering row actions" },
    },
    ".storybook/components/nivo/blocks/expert-site/LeadDetail/LeadDetail.tsx": {
        138: { principle: "block-boundary", note: "detail blocks" },
        142: { principle: "flex-action", note: "header actions at sm" },
    },
    ".storybook/components/nivo/blocks/expert-site/LeadsInboxCard/LeadsInboxCard.tsx": {
        92: { principle: "sibling-stack", note: "inbox card body" },
        97: { hold: "inbox-row-meta-gap3", note: "name | meta at gap 3 — no step-3 row-segment token" },
        137: { principle: "icon-text", note: "compact meta at=sm" },
    },
    ".storybook/components/nivo/blocks/agent-os/AgentCard/AgentCard.tsx": {
        78: { principle: "label-field", note: "card sections at gap 4" },
        83: { principle: "identity", note: "avatar/icon + name align" },
    },
    ".storybook/components/nivo/blocks/agent-os/AgentDetailDrawer/AgentDetailDrawer.tsx": {
        129: { principle: "block-boundary", note: "drawer blocks" },
        143: { principle: "flex-action", note: "header actions" },
    },
    ".storybook/components/nivo/blocks/agent-os/AgentOsHeader/AgentOsHeader.tsx": {
        95: { principle: "content-row", note: "header identity | actions" },
        189: { principle: "content-row", note: "header identity | actions" },
    },
    ".storybook/components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard.tsx": {
        79: { principle: "group-boundary", note: "provision groups" },
        87: { principle: "content-row", note: "stat/field grid" },
    },
    ".storybook/components/nivo/blocks/agent-os/ChannelInbox/ChannelInbox.tsx": {
        105: { principle: "identity", note: "avatar + name block" },
        112: { principle: "name-handle", note: "name over handle gap 1" },
        118: { principle: "icon-text", note: "meta icon/text align" },
    },
    ".storybook/components/nivo/blocks/agent-os/ChannelList/ChannelList.tsx": {
        120: { hold: "channel-row-meta-gap3", note: "channel row justify-between at gap 3 — no step-3 row-segment token" },
        127: { principle: "identity", note: "channel identity align" },
    },
    ".storybook/components/nivo/blocks/agent-os/HealthCard/HealthCard.tsx": {
        61: { principle: "content-row", note: "health metric row segments (gap-only false nested; seam is real)" },
    },
    ".storybook/components/nivo/blocks/agent-os/KnowledgeSection/KnowledgeSection.tsx": {
        98: { hold: "knowledge-row-meta-gap3", note: "knowledge row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/agent-os/ModelsSection/ModelsSection.tsx": {
        84: { hold: "models-row-meta-gap3", note: "model row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/agent-os/PlaygroundPanel/PlaygroundPanel.tsx": {
        97: { principle: "flex-action", note: "bubble align row (user end / agent start)" },
    },
    ".storybook/components/nivo/blocks/agent-os/ProvisioningState/ProvisioningState.tsx": {
        150: { principle: "group-boundary", note: "provision state groups" },
    },
    ".storybook/components/nivo/blocks/agent-os/ThreadDrawer/ThreadDrawer.tsx": {
        107: { principle: "flex-action", note: "message align row" },
    },
    ".storybook/components/nivo/blocks/agent-os/ToolsSection/ToolsSection.tsx": {
        91: { hold: "tools-row-meta-gap3", note: "tool row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/catalog/BuyConfirmModal/BuyConfirmModal.tsx": {
        120: { principle: "label-field", note: "confirm body sections" },
        144: { principle: "flex-action", note: "confirm/cancel actions" },
    },
    ".storybook/components/nivo/blocks/catalog/MyOrdersList/MyOrdersList.tsx": {
        106: { hold: "order-row-meta-gap3", note: "order row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/catalog/UpgradeTierConfirmModal/UpgradeTierConfirmModal.tsx": {
        138: { principle: "label-field", note: "confirm sections" },
        143: { hold: "upgrade-summary-row-gap3", note: "summary row justify-between gap 3 — no step-3 row-segment token" },
        172: { principle: "flex-action", note: "confirm actions" },
    },
    ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx": {
        182: { hold: "catalog-view-gap8-non-landing", note: "gap 8 page stack — marketing-beat is landing-only; CatalogView is app catalog" },
        187: { principle: "label-field", note: "section title over grid" },
        200: { principle: "content-row", note: "product card grid" },
        228: { hold: "catalog-view-gap8-non-landing-b", note: "second gap 8 band — same as above" },
        233: { principle: "label-field", note: "section title over grid" },
        257: { principle: "content-row", note: "product card grid" },
    },
    ".storybook/components/nivo/pages/ExpertSiteView/ExpertSiteView.tsx": {
        123: { hold: "expert-site-view-gap8-non-landing", note: "gap 8 page stack — marketing-beat landing-only" },
        127: { principle: "sibling-stack", note: "hero identity stack align" },
        139: { principle: "sibling-stack", note: "stat grid peers at gap 3" },
        173: { principle: "sibling-stack", note: "section stack align" },
        196: { principle: "sibling-stack", note: "offerings section peers" },
        202: { principle: "sibling-stack", note: "offerings card grid gap 3" },
    },
    ".storybook/components/nivo/blocks/wallet/WalletOverview/WalletOverview.tsx": {
        100: { principle: "flex-action", note: "wallet header actions" },
        149: { principle: "label-field", note: "balance sections" },
        158: { principle: "sibling-stack", note: "balance peers" },
        181: { principle: "title-subtitle", note: "tx title over meta" },
        187: { principle: "icon-text", note: "tx meta at=sm" },
    },
    ".storybook/components/nivo/blocks/account/AccountProfile/AccountProfile.tsx": {
        66: { principle: "label-field", note: "profile field groups" },
        109: { principle: "sibling-stack", note: "profile field peers (heuristic single-slot miss)" },
    },
    ".storybook/components/nivo/blocks/account/AccountSecurity/AccountSecurity.tsx": {
        181: { principle: "sibling-stack", note: "security sections" },
        186: { principle: "identity", note: "security row align" },
    },
    ".storybook/components/nivo/blocks/dashboard/KpiRow/KpiRow.tsx": {
        37: { principle: "content-row", note: "kpi tile grid segments" },
    },
    ".storybook/components/nivo/blocks/dashboard/KpiTile/KpiTile.tsx": {
        91: { principle: "sibling-stack", note: "label/value/footer peers" },
        96: { hold: "kpi-tile-label-icon-gap3", note: "label | icon justify-between gap 3 — not flex-action/identity/value-row" },
    },
    ".storybook/components/nivo/blocks/dashboard/ProductQuickSelector/ProductQuickSelector.tsx": {
        43: { principle: "title-subtitle", note: "product label over hint" },
    },
    ".storybook/components/nivo/blocks/support/SupportTicketList/SupportTicketList.tsx": {
        105: { hold: "ticket-row-meta-gap3", note: "ticket row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/support/TicketThread/TicketThread.tsx": {
        110: { principle: "flex-action", note: "bubble align row" },
        172: { principle: "label-field", note: "thread header over messages" },
        177: { hold: "ticket-thread-header-gap3", note: "subject | status justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/billing/InvoiceDetailModal/InvoiceDetailModal.tsx": {
        89: { hold: "invoice-detail-row-gap3", note: "line row justify-between gap 3 — no step-3 row-segment token" },
    },
    ".storybook/components/nivo/blocks/billing/InvoiceList/InvoiceList.tsx": {
        165: { hold: "invoice-list-row-gap3", note: "invoice row justify-between gap 3 — no step-3 row-segment token" },
        183: { principle: "flex-action", note: "invoice actions" },
    },
    ".storybook/components/nivo/pages/Dashboard/Dashboard.tsx": {
        75: { principle: "block-boundary", note: "dashboard blocks (nested pad false positive)" },
        101: { principle: "title-subtitle", note: "section title over body" },
        110: { hold: "dashboard-section-header-gap3", note: "title | action justify-between gap 3 — trailing may be control but gap keeps content-row off-step" },
    },
    ".storybook/components/nivo/pages/AgentOsConsole/AgentOsConsole.tsx": {
        410: { principle: "content-row", note: "console panel grid" },
        611: { principle: "content-row", note: "console header segments" },
    },
    ".storybook/components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview.tsx": {
        106: { principle: "block-boundary", note: "overview blocks" },
        138: { principle: "content-row", note: "overview card grid" },
    },
    ".storybook/components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview.tsx": {
        242: { principle: "block-boundary", note: "overview blocks" },
        262: { principle: "content-row", note: "overview card grid" },
    },
    ".storybook/components/nivo/blocks/domains/DomainList/DomainList.tsx": {
        104: { hold: "domain-row-meta-gap3", note: "domain row justify-between gap 3 — no step-3 row-segment token" },
    },
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
        const tag = src.slice(m.index, i + 1)
        const line = src.slice(0, m.index).split("\n").length
        yield { name: m[1], tag, line, index: m.index, end: i + 1 }
    }
}

function insertPrinciple(tag, principle) {
    if (/\bprinciple\s*=/.test(tag) || /\bdata-principle\s*=/.test(tag)) return null
    // Insert after the frame name / first newline attrs block start
    const m = tag.match(/^<([A-Za-z0-9]+)/)
    if (!m) return null
    const name = m[1]
    // Prefer after gap={N} if present, else after opening name
    if (/\bgap\s*=\s*\{?\s*\d+\}?/.test(tag)) {
        return tag.replace(/(\bgap\s*=\s*\{?\s*\d+\}?)/, `$1\n            principle="${principle}"`)
    }
    return tag.replace(`<${name}`, `<${name}\n            principle="${principle}"`)
}

const applied = []
const held = []
const missed = []

for (const [rel, lines] of Object.entries(MAP)) {
    const full = path.join(ROOT, rel)
    if (!fs.existsSync(full)) {
        missed.push({ rel, error: "missing file" })
        continue
    }
    let src = fs.readFileSync(full, "utf8")
    let changed = false
    // Process bottom-up so line numbers stay valid for index-based edits... 
    // Actually we use frameTags by line each time after edit; re-scan each principle apply.
    const entries = Object.entries(lines)
        .map(([l, a]) => [Number(l), a])
        .sort((a, b) => b[0] - a[0]) // bottom-up by line

    for (const [line, action] of entries) {
        if (action.hold) {
            held.push({ rel, line, id: action.hold, note: action.note })
            continue
        }
        if (!action.principle) continue
        const frames = [...frameTags(src)]
        const hit = frames.find((f) => f.line === line)
        if (!hit) {
            missed.push({ rel, line, error: "frame not at line" })
            continue
        }
        const next = insertPrinciple(hit.tag, action.principle)
        if (!next) {
            missed.push({ rel, line, error: "already has principle or insert failed" })
            continue
        }
        src = src.slice(0, hit.index) + next + src.slice(hit.end)
        changed = true
        applied.push({ rel, line, principle: action.principle, note: action.note })
    }
    if (changed) fs.writeFileSync(full, src)
}

console.log(`applied ${applied.length}`)
console.log(`held ${held.length}`)
console.log(`missed ${missed.length}`)
if (missed.length) console.log(JSON.stringify(missed, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_migrate-sb-nivo-rest-result.json",
    JSON.stringify({ applied, held, missed }, null, 2),
)
