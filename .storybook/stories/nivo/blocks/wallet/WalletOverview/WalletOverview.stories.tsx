import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    WalletOverview,
    type WalletLedgerRow,
    type WalletOverviewLabels,
} from "@sb-components/nivo/blocks/wallet/WalletOverview/WalletOverview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `WalletOverview` — the mock wallet: a large balance, preset top-up buttons, and
 * the movement ledger. Two DATA states of the single shape: `empty-ledger` and
 * `with-ledger` (the balance + presets are always present). Grounded in the real
 * `WalletEntity` and `WalletTransactionEntity`.
 */
const meta: Meta<typeof WalletOverview> = {
    title: "Nivo/Blocks/Wallet/WalletOverview/WalletOverview",
    component: WalletOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof WalletOverview>

const LABELS: WalletOverviewLabels = {
    balanceLabel: "Balance",
    depositLabel: "Add funds",
    ledgerTitle: "Recent activity",
    emptyTitle: "No activity yet",
    emptyDescription: "Top up your wallet and your deposits and payments will show up here.",
}

const PRESETS = [50000, 100000, 200000, 500000]

const LEDGER: Array<WalletLedgerRow> = [
    {
        id: "txn-1",
        type: "deposit",
        amountVnd: 500000,
        note: "Top-up via PayOS",
        dateLabel: "01/08/2026",
    },
    {
        id: "txn-2",
        type: "spend",
        amountVnd: 299000,
        note: "AI Academy — Professional",
        dateLabel: "01/08/2026",
    },
    {
        id: "txn-3",
        type: "deposit",
        amountVnd: 200000,
        note: null,
        dateLabel: "22/07/2026",
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the balance card, the ledger card, and one nested card per movement" },
    EmptyState: { tier: "composite", role: "the empty branch when the ledger has no movements" },
    Button: { tier: "atom", role: "one deposit-preset button per amount" },
    Typography: { tier: "atom", role: "the balance figure, movement notes, dates, and signed amounts" },
}

/** LEAF — the wallet has one shape; empty-ledger vs with-ledger are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WalletOverview"
                tier="block"
                leaf="Wallet"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the wallet balance + ledger, so an empty ledger is a state of the same shape, not a separate leaf — the balance card and deposit presets stay put either way. A deposit reads as a credit (+, success), a spend as a debit (−); the block owns both the sign and the VND grouping since `amountVnd` arrives raw and always positive."
                states={[
                    {
                        name: "transactions = []",
                        why: "A freshly-provisioned wallet: a zero balance, the deposit presets ready, and an intentional empty ledger telling the user their first top-up will land here.",
                        code: `<WalletOverview
    balanceVnd={0}
    depositPresets={presets}
    transactions={[]}
    onDeposit={deposit}
    labels={labels}
/>`,
                        render: (
                            <WalletOverview
                                balanceVnd={0}
                                depositPresets={PRESETS}
                                transactions={[]}
                                onDeposit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "transactions populated",
                        why: "A funded wallet: the balance figure large up top, four preset top-up buttons, and a ledger mixing deposits (green +) and a spend (−). One deposit has no note, so it falls back to its amount as the row title.",
                        code: "<WalletOverview balanceVnd={401000} transactions={ledger} … />",
                        render: (
                            <WalletOverview
                                balanceVnd={401000}
                                depositPresets={PRESETS}
                                transactions={LEDGER}
                                onDeposit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The wallet's own first fetch hasn't resolved yet, so the same balance card and ledger card stay put — the balance figure and deposit presets shimmer above a fixed count of movement-shaped rows — matching the loaded shape so nothing jumps when the wallet lands.",
                        code: `<WalletOverview
    balanceVnd={0}
    depositPresets={presets}
    transactions={[]}
    onDeposit={deposit}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <WalletOverview
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
