import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    DomainsView,
    type DomainsViewLabels,
} from "@sb-components/nivo/pages/DomainsView/DomainsView"
import type { DomainRow } from "@sb-components/nivo/blocks/domains/DomainList/DomainList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DomainsView` — the PAGE at `/domains`: a list of functions, not a shape of
 * its own. A page's story is one complete STATE per story — `loading`,
 * `content`, `empty` — not a leaf-per-prop map. Grounded in the real
 * `DomainEntity`.
 */
const meta: Meta<typeof DomainsView> = {
    title: "Nivo/Pages/DomainsView/DomainsView",
    component: DomainsView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DomainsView>

const NOOP = () => {}

const LABELS: DomainsViewLabels = {
    domainList: {
        title: "Domains",
        addLabel: "Add domain",
        statusOptions: { active: "Active", expiring: "Expiring", expired: "Expired" },
        expiresPrefix: "Expires",
        emptyTitle: "No domains yet",
        emptyDescription: "Register a domain so your expert site has an address of its own.",
    },
}

const DOMAINS: Array<DomainRow> = [
    { id: "dom-1", name: "anduc-studio.vn", status: "active", expiresAtLabel: "02/07/2027" },
    { id: "dom-2", name: "anhducstudio.vn", status: "expiring", expiresAtLabel: "16/08/2026" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    DomainList: {
        tier: "block",
        role: "the domains list — title, add-domain trigger, and one pressable row per domain",
        storyId: "nivo-blocks-domains-domainlist-domainlist--default",
    },
}

/** STATE — the page is still loading; the skeleton mirror holds the loaded shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DomainsView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. `isSkeleton` threads straight into `DomainList`, so the same titled card shimmers a fixed count of domain-shaped rows rather than swapping in a different layout."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The domains list's own first fetch hasn't resolved yet, so it draws its resting shimmer shape.",
                        code: "<DomainsView {...props} isSkeleton />",
                        render: (
                            <DomainsView
                                domains={DOMAINS}
                                onAddDomain={NOOP}
                                onOpenDomain={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved page: one active domain and one entering its renewal window. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DomainsView"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The everyday view: an active domain sitting beside one about to expire. The page composes `DomainList` directly rather than rebuilding its title, add-button, or row shape inline — a page reaching for that shape itself would be a block that's missing. Each row opens `DomainDetailModal` through `onOpenDomain`; the add trigger opens `RegisterDomainModal` through `onAddDomain` — neither overlay is mounted by this page itself."
                states={[
                    {
                        name: "domains = [active, expiring]",
                        why: "The domain-list block reads both statuses side by side — the healthy one plain, the expiring one toned as a warning — with the add trigger still available in the card header.",
                        code: `<DomainsView
    domains={domains}
    onAddDomain={openRegisterModal}
    onOpenDomain={openDetailModal}
    labels={labels}
/>`,
                        render: (
                            <DomainsView
                                domains={DOMAINS}
                                onAddDomain={NOOP}
                                onOpenDomain={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account: no domains registered yet. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DomainsView"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="A brand-new account: `DomainList` falls to its own empty branch rather than a blank panel — the page doesn't special-case emptiness itself. The add-domain trigger stays in the card header, so the way onward (registering the first domain) is always present, the critical property of this state."
                states={[
                    {
                        name: "domains = []",
                        why: "No domains registered yet. The empty state names what a domain is for and keeps the add trigger reachable, rather than leaving a blank card with no path forward.",
                        code: "<DomainsView domains={[]} onAddDomain={openRegisterModal} onOpenDomain={openDetailModal} … />",
                        render: (
                            <DomainsView
                                domains={[]}
                                onAddDomain={NOOP}
                                onOpenDomain={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
