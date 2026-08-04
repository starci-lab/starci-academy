import type { Meta, StoryObj } from "@storybook/nextjs"
import { CurrencyDollarIcon, GlobeIcon, ReceiptIcon, WalletIcon } from "@phosphor-icons/react"
import { KpiTile } from "@sb-components/nivo/blocks/dashboard/KpiTile/KpiTile"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `KpiTile` — one account-health stat: a label + icon row, a large value, and
 * an optional footer that is either a plain note or an accent call-to-action.
 * `footer` is the one thing that changes the tile's meaning, so the story
 * renders both of its shapes plus the value formats they pair with.
 */
const meta: Meta<typeof KpiTile> = {
    title: "Nivo/Blocks/Dashboard/KpiTile/KpiTile",
    component: KpiTile,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KpiTile>

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tile's face and its skeleton mirror" },
    IconTile: { tier: "atom", role: "the tile's icon, tinted accent" },
    Typography: { tier: "atom", role: "the label, the value, and the footer line" },
}

/** LEAF — `footer`: a plain note (positive or neutral tone) versus an accent call-to-action. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="grid max-w-3xl grid-cols-1 gap-4 p-8 @app-sm:grid-cols-2">
            <BlockAnatomy
                name="KpiTile"
                tier="block"
                leaf="footer"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The footer is a discriminated union: a `note` never carries a press handler and a `cta` never carries a tone, so the two shapes cannot drift into an unreadable combination. `format` decides whether `value` renders as a VND amount or a plain count, so the same tile shape carries every KPI on the row."
                states={[
                    {
                        name: "note — positive trend",
                        why: "A KPI that moved in a good direction — the note reads success-toned, no press handler attached.",
                        code: `<KpiTile
    icon={CurrencyDollarIcon}
    label="Monthly revenue"
    value={12450000}
    format="vnd"
    footer={{ kind: "note", text: "Up 18% from last month", tone: "positive" }}
/>`,
                        render: (
                            <KpiTile
                                icon={CurrencyDollarIcon}
                                label="Monthly revenue"
                                value={12450000}
                                format="vnd"
                                footer={{ kind: "note", text: "Up 18% from last month", tone: "positive" }}
                            />
                        ),
                    },
                    {
                        name: "note — neutral",
                        why: "A KPI with a plain supporting fact, not a trend — the note stays muted.",
                        code: `<KpiTile
    icon={ReceiptIcon}
    label="Orders"
    value={8}
    format="count"
    footer={{ kind: "note", text: "1 invoice unpaid" }}
/>`,
                        render: (
                            <KpiTile
                                icon={ReceiptIcon}
                                label="Orders"
                                value={8}
                                format="count"
                                footer={{ kind: "note", text: "1 invoice unpaid" }}
                            />
                        ),
                    },
                    {
                        name: "cta — a brand-new account",
                        why: "A zero-value tile still points somewhere: an unfunded wallet's footer is an accent call-to-action, not a dead 'no data' note.",
                        code: `<KpiTile
    icon={WalletIcon}
    label="Wallet balance"
    value={0}
    format="vnd"
    footer={{ kind: "cta", label: "Add funds for the first time", onPress: openWallet }}
/>`,
                        render: (
                            <KpiTile
                                icon={WalletIcon}
                                label="Wallet balance"
                                value={0}
                                format="vnd"
                                footer={{ kind: "cta", label: "Add funds for the first time", onPress: NOOP }}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The tile's own first fetch hasn't resolved yet — the label, the value, and the footer all shimmer in place.",
                        code: `<KpiTile
    icon={GlobeIcon}
    label="Live sites"
    value={0}
    format="count"
    isSkeleton
/>`,
                        render: (
                            <KpiTile icon={GlobeIcon} label="Live sites" value={0} format="count" isSkeleton />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
