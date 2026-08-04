import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    WalletView,
    type WalletViewLabels,
} from "@sb-components/nivo/pages/WalletView/WalletView"
import type { WalletLedgerRow } from "@sb-components/nivo/blocks/wallet/WalletOverview/WalletOverview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `WalletView` — the PAGE at `/wallet`: a list of functions, not a shape of
 * its own. A page's story is one complete STATE per story — `loading`,
 * `content`, `empty` — not a leaf-per-prop map. Grounded in the real
 * `WalletEntity` + `WalletTransactionEntity`.
 */
const meta: Meta<typeof WalletView> = {
    title: "Nivo/Pages/WalletView/WalletView",
    component: WalletView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof WalletView>

const NOOP = () => {}

const LABELS: WalletViewLabels = {
    wallet: {
        balanceLabel: "Available balance",
        depositLabel: "Add funds",
        ledgerTitle: "Transaction history",
        emptyTitle: "No transactions yet",
        emptyDescription: "Top up your wallet for the first time and it will show up here.",
    },
}

const PRESETS = [50000, 100000, 200000, 500000]

const TRANSACTIONS: Array<WalletLedgerRow> = [
    { id: "txn-1", type: "deposit", amountVnd: 500000, note: "Top-up via SePay", dateLabel: "03/08/2026" },
    { id: "txn-2", type: "spend", amountVnd: 990000, note: "Invoice #INV-1042", dateLabel: "02/08/2026" },
    { id: "txn-3", type: "deposit", amountVnd: 1000000, note: "Top-up via PayOS", dateLabel: "28/07/2026" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    WalletOverview: {
        tier: "block",
        role: "the balance hero, the deposit presets, and the transaction ledger",
        storyId: "nivo-blocks-wallet-walletoverview-walletoverview--default",
    },
}

/** STATE — the page is still loading; the skeleton mirror holds the loaded shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WalletView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. `isSkeleton` threads straight into `WalletOverview`, so the balance figure, the deposit presets, and the ledger card all mirror their loaded shape while shimmering."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The wallet's own first fetch hasn't resolved yet, so it draws its resting shimmer shape.",
                        code: "<WalletView {...props} isSkeleton />",
                        render: (
                            <WalletView
                                balanceVnd={0}
                                depositPresets={PRESETS}
                                transactions={[]}
                                onDeposit={NOOP}
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

/** STATE — the resolved page: a funded wallet with mixed deposits and a spend. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WalletView"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The everyday view: the balance up top, four preset top-up amounts ready, and a ledger mixing deposits and one spend. The page composes `WalletOverview` directly rather than rebuilding the balance/preset/ledger shape inline — a page reaching for that shape itself would be a block that's missing."
                states={[
                    {
                        name: "balanceVnd = 210000, transactions populated",
                        why: "A wallet that has been topped up twice and spent once, on an invoice — the everyday shape of the page.",
                        code: `<WalletView
    balanceVnd={210000}
    depositPresets={presets}
    transactions={transactions}
    onDeposit={deposit}
    labels={labels}
/>`,
                        render: (
                            <WalletView
                                balanceVnd={210000}
                                depositPresets={PRESETS}
                                transactions={TRANSACTIONS}
                                onDeposit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account: zero balance, nothing in the ledger yet. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WalletView"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="A brand-new account: the balance reads zero and `WalletOverview` falls to its own empty-ledger branch rather than a blank panel — the page doesn't special-case emptiness itself. The deposit presets stay fully available above the empty ledger, so the way onward (the first top-up) is always present."
                states={[
                    {
                        name: "balanceVnd = 0, transactions = []",
                        why: "Right after the wallet is auto-provisioned. Nothing has happened yet, but the four preset amounts are ready the moment the owner wants to fund it.",
                        code: "<WalletView balanceVnd={0} transactions={[]} … />",
                        render: (
                            <WalletView
                                balanceVnd={0}
                                depositPresets={PRESETS}
                                transactions={[]}
                                onDeposit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
