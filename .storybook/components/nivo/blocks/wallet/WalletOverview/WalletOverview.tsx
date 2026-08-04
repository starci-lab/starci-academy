import { WalletIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `WalletOverview` — the mock wallet: a large balance, preset top-up buttons, and
 * the movement ledger. Two DATA states of the single shape: `empty-ledger` and
 * `with-ledger` (the balance + presets are always present). Grounded in the real
 * `WalletEntity` and `WalletTransactionEntity`.
 */

/** The two ledger movements — mirrors `WalletTransactionType` (`deposit` · `spend`). */
export type WalletMovementKey = "deposit" | "spend"

/** One ledger row — a subset of `WalletTransactionEntity`. */
export interface WalletLedgerRow {
    /** Transaction id. */
    id: string
    /** Whether funds came in (deposit) or went out (spend) (`WalletTransactionEntity.type`). */
    type: WalletMovementKey
    /** Amount moved in VND, always positive (`WalletTransactionEntity.amountVnd`). */
    amountVnd: number
    /** Human-readable note, or null (`WalletTransactionEntity.note`). */
    note?: string | null
    /** Already-formatted movement date (`WalletTransactionEntity.createdAt`). */
    dateLabel: string
}

/** Props for {@link WalletOverview}. */
export interface WalletOverviewProps {
    /** Current wallet balance in VND (`WalletEntity.balanceVnd`). */
    balanceVnd: number
    /** Preset top-up amounts (VND), rendered as one button each. */
    depositPresets: Array<number>
    /** Top the wallet up by a preset amount — the connected layer runs the deposit. */
    onDeposit: (amountVnd: number) => void
    /** The ledger, newest first. */
    transactions: Array<WalletLedgerRow>
    /**
     * `true` → the wallet's own first fetch is in flight: the balance figure and
     * the deposit presets shimmer, and the ledger card renders a fixed count of
     * movement-shaped rows with every content node shimmering (§12b). Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: WalletOverviewLabels
}

/** The already-resolved copy the block renders. */
export interface WalletOverviewLabels {
    /** Caption above the balance figure (e.g. "Balance"). */
    balanceLabel: string
    /** Heading above the deposit presets (e.g. "Add funds"). */
    depositLabel: string
    /** Ledger card title (e.g. "Recent activity"). */
    ledgerTitle: string
    /** Empty-ledger title. */
    emptyTitle: string
    /** Empty-ledger supporting line. */
    emptyDescription: string
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix, never a formatted string in. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** A deposit reads as a credit (+, success); a spend reads as a debit (−, muted foreground). */
const signedVnd = (row: WalletLedgerRow) =>
    `${row.type === "deposit" ? "+" : "-"}${formatVnd(row.amountVnd)}`

/** How many placeholder rows the loading mirror draws while the ledger hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder ledger rows — sized like a real movement so the shimmer mirrors the loaded shape. */
const SKELETON_LEDGER: Array<WalletLedgerRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    type: "deposit",
    amountVnd: 0,
    note: "Wallet movement note",
    dateLabel: "01/01/2026",
}))

/**
 * One ledger row — note + date on the left, the signed amount on the right. The
 * SAME shape drives the loaded and the loading rows; `isSkeleton` threads down so a
 * loading row is the loaded row with its content nodes shimmering.
 */
const WalletLedgerRowItem = ({ row, isSkeleton }: {
    row: WalletLedgerRow
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        isSkeleton={isSkeleton}
                                        text={row.note ?? formatVnd(row.amountVnd)}
                                    />
                                ),
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={row.dateLabel} />,
                            ]}
                        />
                    ),
                    () => (
                        <Typography
                            size="sm"
                            weight="medium"
                            tabularNums
                            color={row.type === "deposit" ? "success" : "default"}
                            isSkeleton={isSkeleton}
                            text={signedVnd(row)}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * The wallet overview. See the file header for why empty-ledger vs with-ledger are
 * states of one shape rather than separate leaves, and how `isSkeleton` mirrors the
 * loaded rows.
 *
 * @param props - {@link WalletOverviewProps}
 */
const WalletOverview = ({ balanceVnd, depositPresets, onDeposit, transactions, isSkeleton = false, labels }: WalletOverviewProps) => {
    const rows = isSkeleton ? SKELETON_LEDGER : transactions
    return (
        <div data-tier="block" data-component="WalletOverview">
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <SurfaceCard
                            padding={3}
                            isSkeleton={isSkeleton}
                            body={() => (
                                <StackV
                                    gap={3}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <StackV
                                                gap={1}
                                                isSkeleton={isSkeleton}
                                                items={[
                                                    () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.balanceLabel} />,
                                                    () => (
                                                        <Typography
                                                            size="h2"
                                                            weight="bold"
                                                            tabularNums
                                                            isSkeleton={isSkeleton}
                                                            text={formatVnd(balanceVnd)}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <StackV
                                                gap={2}
                                                isSkeleton={isSkeleton}
                                                items={[
                                                    () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={labels.depositLabel} />,
                                                    () => (
                                                        <StackH
                                                            gap={2}
                                                            at="sm"
                                                            isSkeleton={isSkeleton}
                                                            items={depositPresets.map((amount) => () => (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    isSkeleton={isSkeleton}
                                                                    label={formatVnd(amount)}
                                                                    onPress={isSkeleton ? undefined : () => onDeposit(amount)}
                                                                />
                                                            ))}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            )}
                        />
                    ),
                    () => (
                        <SurfaceCard
                            padding={3}
                            label={labels.ledgerTitle}
                            isSkeleton={isSkeleton}
                            body={() =>
                                !isSkeleton && transactions.length === 0 ? (
                                    <EmptyState
                                        icon={WalletIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                    />
                                ) : (
                                    <StackV
                                        gap={2}
                                        isSkeleton={isSkeleton}
                                        items={rows.map((row) => () => (
                                            <WalletLedgerRowItem row={row} isSkeleton={isSkeleton} />
                                        ))}
                                    />
                                )
                            }
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { WalletOverview }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "WalletOverview" } as const
