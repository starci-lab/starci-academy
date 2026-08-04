import type { Meta, StoryObj } from "@storybook/nextjs"
import { ReceiptIcon } from "@phosphor-icons/react"
import { SidebarNavItem } from "@sb-components/nivo/blocks/navigation/SidebarNavItem/SidebarNavItem"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SidebarNavItem` — one destination row inside a `SidebarNavGroup`: a leading
 * icon + truncating label. The ONLY filled state is `isActive` (tonal
 * `bg-accent/10` + accent text — never a hard fill); hover is a faint tint,
 * focus is a ring, never a second fill. Collapsed drops the label and centers
 * the icon alone, moving the destination's name into a `Tooltip` so it stays
 * reachable on hover/focus. Ported from starci-academy's
 * `blocks/navigation/SidebarNavItem`.
 */
const meta: Meta<typeof SidebarNavItem> = {
    title: "Nivo/Blocks/Navigation/SidebarNavItem/SidebarNavItem",
    component: SidebarNavItem,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SidebarNavItem>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": { tier: "atom", role: "the row's label — accent-toned and medium weight only while `isActive`", storyId: "atoms-text-typography-typography--truncate" },
    "Tooltip": { tier: "atom", role: "collapsed only — carries the row's label on hover/focus once the visible text is gone", storyId: "atoms-overlay-tooltip-tooltip--default" },
}

/** LEAF — one row shape; `isActive` / `isCollapsed` / `endContent` / `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="SidebarNavItem"
                tier="block"
                leaf="Nav row"
                annotate={ANNOTATE}
                renderClassName="w-64 overflow-hidden rounded-2xl border border-default p-2"
                reason="Blocks take no `className`: the row owns its tonal-active treatment, so a caller never restyles it — the same tint/hover/focus contract everywhere it's placed inside a `SidebarNavGroup`. `isActive` is the ONLY filled state (tonal `bg-accent/10`, never a hard fill); hover is a faint tint and focus is a ring, never a second fill."
                states={[
                    {
                        name: "idle",
                        why: "The resting row: muted icon + label, no tint. What every non-current destination looks like in the rail.",
                        code: `<SidebarNavItem icon={ReceiptIcon} label="Invoices" onPress={onPress} />`,
                        render: (
                            <SidebarNavItem icon={ReceiptIcon} label="Invoices" onPress={() => {}} />
                        ),
                    },
                    {
                        name: "isActive = true",
                        why: "This row matches the current route: a tonal `bg-accent/10` fill, accent icon and label — never a hard fill, matching `SidebarNavGroup`'s sibling rows exactly.",
                        code: `<SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive onPress={onPress} />`,
                        render: (
                            <SidebarNavItem icon={ReceiptIcon} label="Invoices" isActive onPress={() => {}} />
                        ),
                    },
                    {
                        name: "endContent set",
                        why: "A trailing badge pinned to the row's right edge — e.g. an unpaid-invoice count. Hidden entirely once the rail collapses (there is no room, and the destination is already reduced to its icon).",
                        code: `<SidebarNavItem icon={ReceiptIcon} label="Invoices" endContent={<Badge />} onPress={onPress} />`,
                        render: (
                            <SidebarNavItem
                                icon={ReceiptIcon}
                                label="Invoices"
                                endContent={
                                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">1</span>
                                }
                                onPress={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isCollapsed = true",
                        why: "The rail folds to an icon-only strip: the label disappears, the row centres on its icon alone, and a `Tooltip` (placed toward the trailing edge) carries the destination's name on hover or keyboard focus so it stays reachable.",
                        code: `<SidebarNavItem icon={ReceiptIcon} label="Invoices" isCollapsed onPress={onPress} />`,
                        render: (
                            <SidebarNavItem icon={ReceiptIcon} label="Invoices" isCollapsed onPress={() => {}} />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The group's data has not resolved yet: an icon-sized square plus a label bar, mirroring the loaded row so nothing shifts when the real destination arrives.",
                        code: `<SidebarNavItem icon={ReceiptIcon} label="Invoices" isSkeleton onPress={onPress} />`,
                        render: (
                            <SidebarNavItem icon={ReceiptIcon} label="Invoices" isSkeleton onPress={() => {}} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
