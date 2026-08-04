import {
    WalletOverview,
    type WalletLedgerRow,
    type WalletOverviewLabels,
} from "@sb-components/nivo/blocks/wallet/WalletOverview/WalletOverview"

/**
 * `WalletView` — the PAGE at `/wallet`: a list of functions, not a shape of
 * its own. A page's story is one complete STATE per story — `loading`,
 * `content`, `empty` — not a leaf-per-prop map. Grounded in the real
 * `WalletEntity` + `WalletTransactionEntity`.
 */

/** Props for {@link WalletView}. */
export interface WalletViewProps {
    /** Current wallet balance in VND (`WalletEntity.balanceVnd`). */
    balanceVnd: number
    /** Preset top-up amounts (VND), forwarded to `WalletOverview`. */
    depositPresets: Array<number>
    /** Top the wallet up by a preset amount — the connected layer runs the deposit. */
    onDeposit: (amountVnd: number) => void
    /** The ledger, newest first. */
    transactions: Array<WalletLedgerRow>
    /** `true` → the page's own first fetch is in flight; the skeleton mirror is shown. */
    isSkeleton?: boolean
    /** Already-localized copy, forwarded to the embedded `WalletOverview`. */
    labels: WalletViewLabels
}

/** Already-localized copy for the one block this page arranges. */
export interface WalletViewLabels {
    /** Forwarded to `WalletOverview`. */
    wallet: WalletOverviewLabels
}

/**
 * The wallet page. See the file header for why it composes `WalletOverview`
 * directly rather than rebuilding a balance/preset/ledger shape this block
 * already owns.
 *
 * @param props - {@link WalletViewProps}
 */
const WalletView = ({ balanceVnd, depositPresets, onDeposit, transactions, isSkeleton = false, labels }: WalletViewProps) => (
    <div
        data-tier="page"
        data-component="WalletView"
        className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8"
    >
        <WalletOverview
            balanceVnd={balanceVnd}
            depositPresets={depositPresets}
            onDeposit={onDeposit}
            transactions={transactions}
            isSkeleton={isSkeleton}
            labels={labels.wallet}
        />
    </div>
)

export { WalletView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "WalletView" } as const
