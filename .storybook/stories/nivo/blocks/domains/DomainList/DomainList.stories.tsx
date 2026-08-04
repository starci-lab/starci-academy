import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    DomainList,
    type DomainListLabels,
    type DomainRow,
} from "@sb-components/nivo/blocks/domains/DomainList/DomainList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DomainList` — the user's registered domains, each with its status and expiry,
 * plus a header add-domain trigger. Two DATA states of the single shape: `empty`
 * and `with-rows`. Grounded in the real `DomainEntity`.
 */
const meta: Meta<typeof DomainList> = {
    title: "Nivo/Blocks/Domains/DomainList/DomainList",
    component: DomainList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DomainList>

const LABELS: DomainListLabels = {
    title: "Domains",
    addLabel: "Add domain",
    statusOptions: { active: "Active", expiring: "Expiring", expired: "Expired" },
    expiresPrefix: "Expires",
    emptyTitle: "No domains yet",
    emptyDescription: "Add a domain to point it at your nivo site.",
}

const DOMAINS: Array<DomainRow> = [
    { id: "dom-1", name: "lequang.com", status: "active", expiresAtLabel: "14/03/2027" },
    { id: "dom-2", name: "academy.lequang.vn", status: "expiring", expiresAtLabel: "22/08/2026" },
    { id: "dom-3", name: "old-portfolio.net", status: "expired", expiresAtLabel: "01/06/2026" },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card (with the add button), and one pressable nested card per domain" },
    EmptyState: { tier: "composite", role: "the empty branch when no domains are registered" },
    Chip: { tier: "atom", role: "the domain's status, toned by lifecycle (active success, expiring warning, expired danger)" },
    Button: { tier: "atom", role: "the header add-domain trigger" },
    Typography: { tier: "atom", role: "the domain name and the expiry date" },
}

/** LEAF — the list has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DomainList"
                tier="block"
                leaf="Domain list"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the domains entity, so empty vs with-rows are states of one shape. The add-domain trigger sits in the card header (present in both states) so a user with no domains can still add their first. The status chip is toned by lifecycle, not by the colour a call site would like. Each row becomes pressable the moment `onOpenDomain` is wired — opening that domain's `DomainDetailModal` (an overlay this block never mounts itself)."
                states={[
                    {
                        name: "domains = []",
                        why: "No domains registered yet. The card keeps its title and the add button, and reads as an intentional empty state pointing the user at their first domain rather than showing a blank panel.",
                        code: `<DomainList
    domains={[]}
    onAddDomain={add}
    onOpenDomain={open}
    labels={labels}
/>`,
                        render: <DomainList domains={[]} onAddDomain={NOOP} onOpenDomain={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "domains populated",
                        why: "Three domains across all three statuses — active (success), expiring (warning), expired (danger) — each with its expiry date. The header add button stays available above the rows, and each row is pressable since `onOpenDomain` is wired, opening that domain's detail overlay (an overlay this block never mounts itself).",
                        code: "<DomainList domains={domains} onAddDomain={add} onOpenDomain={open} … />",
                        render: <DomainList domains={DOMAINS} onAddDomain={NOOP} onOpenDomain={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of domain-shaped rows — name, status chip and expiry all shimmering — matching the loaded row so nothing jumps when the domains land.",
                        code: `<DomainList
    domains={[]}
    onAddDomain={add}
    onOpenDomain={open}
    labels={labels}
    isSkeleton
/>`,
                        render: <DomainList domains={[]} onAddDomain={NOOP} onOpenDomain={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
