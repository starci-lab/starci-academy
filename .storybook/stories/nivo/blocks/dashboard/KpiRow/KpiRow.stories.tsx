import type { Meta, StoryObj } from "@storybook/nextjs"
import { CurrencyDollarIcon, GlobeIcon, ReceiptIcon, WalletIcon } from "@phosphor-icons/react"
import { KpiRow, type KpiRowItem } from "@sb-components/nivo/blocks/dashboard/KpiRow/KpiRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `KpiRow` — the account-health stat row: one `KpiTile` per figure, laid out
 * on the shared `Grid` frame. `items`: the four-figure default plus a shorter
 * set prove the row reflows from data instead of assuming a fixed four-cell
 * shape.
 */
const meta: Meta<typeof KpiRow> = {
    title: "Nivo/Blocks/Dashboard/KpiRow/KpiRow",
    component: KpiRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KpiRow>

const NOOP = () => {}

// The real four-figure account summary: revenue, orders, live sites, wallet balance.
const POPULATED: Array<Omit<KpiRowItem, "isSkeleton">> = [
    {
        key: "revenue",
        icon: CurrencyDollarIcon,
        label: "Monthly revenue",
        value: 12450000,
        format: "vnd",
        footer: { kind: "note", text: "Up 18% from last month", tone: "positive" },
    },
    {
        key: "orders",
        icon: ReceiptIcon,
        label: "Orders",
        value: 8,
        format: "count",
        footer: { kind: "note", text: "1 invoice unpaid" },
    },
    {
        key: "sites",
        icon: GlobeIcon,
        label: "Live sites",
        value: 2,
        format: "count",
        footer: { kind: "note", text: "Expert site · AI Agent" },
    },
    {
        key: "wallet",
        icon: WalletIcon,
        label: "Wallet balance",
        value: 3200000,
        format: "vnd",
        footer: { kind: "cta", label: "Add funds", onPress: NOOP },
    },
]

// A brand-new account: every figure is zero, and the tiles that can't show a
// trend point somewhere real instead (the catalog, the wallet's first top-up).
const NEW_ACCOUNT: Array<Omit<KpiRowItem, "isSkeleton">> = [
    { key: "revenue", icon: CurrencyDollarIcon, label: "Monthly revenue", value: 0, format: "vnd", footer: { kind: "note", text: "No revenue yet" } },
    { key: "orders", icon: ReceiptIcon, label: "Orders", value: 0, format: "count", footer: { kind: "note", text: "No orders yet" } },
    { key: "sites", icon: GlobeIcon, label: "Live sites", value: 0, format: "count", footer: { kind: "cta", label: "See the catalog", onPress: NOOP } },
    { key: "wallet", icon: WalletIcon, label: "Wallet balance", value: 0, format: "vnd", footer: { kind: "cta", label: "Add funds for the first time", onPress: NOOP } },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the responsive column track, one cell per tile" },
    KpiTile: {
        tier: "block",
        role: "one stat's label, value, and footer",
        storyId: "nivo-blocks-dashboard-kpitile-kpitile--default",
    },
}

/** LEAF — `items`: the four-figure default; a brand-new account proves the same row reads as zero without a fixed layout. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KpiRow"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The tile count comes from `items.length`, not a fixed four-cell shape — a brand-new account still fits the same grid, every figure at zero. Each cell composes the real `KpiTile` block rather than the row rebuilding a stat shape inline."
                states={[
                    {
                        name: "populated account",
                        why: "The real four-figure summary: revenue trending up, one unpaid invoice, two live products, and a funded wallet.",
                        code: `<KpiRow items={[
    { key: "revenue", icon: CurrencyDollarIcon, label: "Monthly revenue", value: 12450000, format: "vnd", footer: { kind: "note", text: "Up 18% from last month", tone: "positive" } },
    { key: "orders", icon: ReceiptIcon, label: "Orders", value: 8, format: "count", footer: { kind: "note", text: "1 invoice unpaid" } },
    // …
]} />`,
                        render: <KpiRow items={POPULATED} />,
                    },
                    {
                        name: "brand-new account",
                        why: "Every figure is zero, but the two tiles with nothing to trend point at the catalog and the wallet's first top-up instead of sitting dead.",
                        code: `<KpiRow items={[
    { key: "sites", icon: GlobeIcon, label: "Live sites", value: 0, format: "count", footer: { kind: "cta", label: "See the catalog", onPress: openCatalog } },
    // …
]} />`,
                        render: <KpiRow items={NEW_ACCOUNT} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The row's own first fetch hasn't resolved yet — every tile shimmers in place, matching the loaded four-cell shape.",
                        code: "<KpiRow items={items} isSkeleton />",
                        render: <KpiRow items={POPULATED} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
