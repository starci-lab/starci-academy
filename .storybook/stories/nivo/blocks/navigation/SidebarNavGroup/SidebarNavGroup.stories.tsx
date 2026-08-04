import type { Meta, StoryObj } from "@storybook/nextjs"
import { GaugeIcon, ReceiptIcon, WalletIcon } from "@phosphor-icons/react"
import { SidebarNavGroup } from "@sb-components/nivo/blocks/navigation/SidebarNavGroup/SidebarNavGroup"
import { SidebarNavItem } from "@sb-components/nivo/blocks/navigation/SidebarNavItem/SidebarNavItem"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SidebarNavGroup` — a cluster of `SidebarNavItem` rows: an optional full-width
 * divider above the group (splits it from the previous cluster), an optional
 * muted uppercase caption, then the rows. The caption is hidden while the rail
 * is collapsed so only the divider still separates icon clusters. Ported from
 * starci-academy's `blocks/navigation/SidebarNavGroup`.
 */
const meta: Meta<typeof SidebarNavGroup> = {
    title: "Nivo/Blocks/Navigation/SidebarNavGroup/SidebarNavGroup",
    component: SidebarNavGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SidebarNavGroup>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Divider": { tier: "atom", role: "splits this group from the one before it — never rendered on the first group", storyId: "atoms-display-divider-divider--default" },
    "SidebarNavItem": { tier: "block", role: "the rows this group wraps", storyId: "nivo-blocks-navigation-sidebarnavitem-sidebarnavitem--default" },
}

const Rows = () => (
    <>
        <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive onPress={() => {}} />
        <SidebarNavItem icon={WalletIcon} label="Wallet" onPress={() => {}} />
    </>
)

/** LEAF — one group shape; `label` / `divider` / `isCollapsed` / `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="SidebarNavGroup"
                tier="block"
                leaf="Nav group"
                annotate={ANNOTATE}
                renderClassName="w-64 overflow-hidden rounded-2xl border border-default p-3"
                reason="Blocks take no `className`: the group owns the divider + caption + intra-group spacing, so a caller never hand-rolls that chrome around a set of `SidebarNavItem` rows. The caption is a caller-labelled cluster, not a free-form heading — hidden collapsed so only the divider still reads as a seam between icon clusters."
                states={[
                    {
                        name: "labelled, no divider (first group)",
                        why: "The rail's very first cluster never draws a divider — there is nothing above it to split from. A caption is still optional; this is the labelled case.",
                        code: `<SidebarNavGroup label="Billing">
    <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive onPress={onPress} />
    <SidebarNavItem icon={WalletIcon} label="Wallet" onPress={onPress} />
</SidebarNavGroup>`,
                        render: (
                            <SidebarNavGroup label="Billing">
                                <Rows />
                            </SidebarNavGroup>
                        ),
                    },
                    {
                        name: "divider = true",
                        why: "Every group AFTER the rail's first cluster sets this — the divider is the seam between two clusters, whether or not the group below it carries a caption.",
                        code: `<SidebarNavGroup label="Billing" divider>
    <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive onPress={onPress} />
    <SidebarNavItem icon={WalletIcon} label="Wallet" onPress={onPress} />
</SidebarNavGroup>`,
                        render: (
                            <SidebarNavGroup label="Billing" divider>
                                <Rows />
                            </SidebarNavGroup>
                        ),
                    },
                    {
                        name: "no label — unlabelled cluster",
                        why: "A cluster the rail groups visually (via the divider above it) but does not name — e.g. the trailing Domains / Support / Account cluster, which reads as one unit without needing a caption.",
                        code: `<SidebarNavGroup divider>
    <SidebarNavItem icon={GaugeIcon} label="Overview" onPress={onPress} />
</SidebarNavGroup>`,
                        render: (
                            <SidebarNavGroup divider>
                                <SidebarNavItem icon={GaugeIcon} label="Overview" onPress={() => {}} />
                            </SidebarNavGroup>
                        ),
                    },
                    {
                        name: "isCollapsed = true",
                        why: "The rail folds to an icon-only strip: the caption disappears entirely — only the divider still marks the seam between this cluster and the one before it — and every row centres on its icon (via its own `isCollapsed`).",
                        code: `<SidebarNavGroup label="Billing" divider isCollapsed>
    <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive isCollapsed onPress={onPress} />
    <SidebarNavItem icon={WalletIcon} label="Wallet" isCollapsed onPress={onPress} />
</SidebarNavGroup>`,
                        render: (
                            <SidebarNavGroup label="Billing" divider isCollapsed>
                                <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive isCollapsed onPress={() => {}} />
                                <SidebarNavItem icon={WalletIcon} label="Wallet" isCollapsed onPress={() => {}} />
                            </SidebarNavGroup>
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The nav data has not resolved yet: the caption becomes a shimmer bar mirroring its loaded width, sitting above whatever skeleton rows the caller passes as children.",
                        code: `<SidebarNavGroup label="Billing" divider isSkeleton>
    <SidebarNavItem icon={ReceiptIcon} label="" isSkeleton onPress={onPress} />
    <SidebarNavItem icon={WalletIcon} label="" isSkeleton onPress={onPress} />
</SidebarNavGroup>`,
                        render: (
                            <SidebarNavGroup label="Billing" divider isSkeleton>
                                <SidebarNavItem icon={ReceiptIcon} label="" isSkeleton onPress={() => {}} />
                                <SidebarNavItem icon={WalletIcon} label="" isSkeleton onPress={() => {}} />
                            </SidebarNavGroup>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
