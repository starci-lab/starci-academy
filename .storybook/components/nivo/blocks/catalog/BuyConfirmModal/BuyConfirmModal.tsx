import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `BuyConfirmModal` — the last step before a catalog order is placed: recap the
 * chosen product + tier, show what it costs and what it's paid with, then place
 * the order. It owns one domain-shaped selection (product, tier, price), which is
 * exactly why it sits in `blocks/catalog` rather than `overlays/modals` — the same
 * placement `ConnectChannelModal` uses in `blocks/agent-os` (OVERLAY-9: the surface
 * is generic, the entity belongs to the block inside it). Grounded in
 * `CatalogItemEntity` + `CatalogTierEntity`; payment is read-only against the
 * user's `WalletEntity.balanceVnd` — there is no method picker, because the
 * streamlined catalog pays from the wallet only.
 */

/** The order about to be placed — a subset of `CatalogItemEntity` + its chosen `CatalogTierEntity`. */
export interface BuyConfirmModalOrder {
    /** Catalog item name (`CatalogItemEntity.name`, e.g. "AI Academy"). */
    productName: string
    /** Chosen tier name (`CatalogTierEntity.name`, e.g. "Professional"). */
    tierName: string
    /** Monthly price in VND, or null (`CatalogTierEntity.priceMonthlyVnd`). */
    priceMonthlyVnd?: number | null
    /** One-time price in VND, or null (`CatalogTierEntity.priceOneTimeVnd`). */
    priceOneTimeVnd?: number | null
    /** Short positioning copy for the chosen tier, or null (`CatalogTierEntity.description`). */
    description?: string | null
}

/** Props for {@link BuyConfirmModal}. */
export interface BuyConfirmModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The product + tier about to be ordered, or null before any tier has been chosen. */
    order: BuyConfirmModalOrder | null
    /** The user's current wallet balance in VND (`WalletEntity.balanceVnd`) — the only payment method. */
    walletBalanceVnd: number
    /** Place the order — the connected layer creates the `CatalogOrderEntity` and its invoice. */
    onConfirm: () => void
    /** `true` → the order is being placed (confirm button busy, cancel locks). */
    isConfirming?: boolean
    /**
     * `true` → the modal's own first fetch (e.g. resolving the wallet balance) is in
     * flight: the recap and the confirm button both shimmer. Threaded straight down —
     * never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: BuyConfirmModalLabels
}

/** The already-resolved copy the modal renders. */
export interface BuyConfirmModalLabels {
    /** Title prefix, combined with the product + tier name (e.g. "Confirm purchase"). */
    titlePrefix: string
    /** Label before the wallet line (e.g. "Pay with"). */
    payWithLabel: string
    /** The wallet's display name (e.g. "nivo Wallet"). */
    walletLabel: string
    /** Suffix after a monthly price (e.g. "/ month"). */
    perMonthLabel: string
    /** Text shown in place of a price when the tier is free (price 0). */
    freeLabel: string
    /** Cancel button label. */
    cancelLabel: string
    /** Confirm button label. */
    confirmLabel: string
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** Resolve the order's price into one display string: monthly, one-time, or free. */
const priceTextOf = (order: BuyConfirmModalOrder, labels: BuyConfirmModalLabels): string => {
    if (order.priceMonthlyVnd != null) {
        return order.priceMonthlyVnd === 0
            ? labels.freeLabel
            : `${formatVnd(order.priceMonthlyVnd)} ${labels.perMonthLabel}`
    }
    if (order.priceOneTimeVnd != null) {
        return order.priceOneTimeVnd === 0 ? labels.freeLabel : formatVnd(order.priceOneTimeVnd)
    }
    return labels.freeLabel
}

/**
 * The buy-confirmation modal. See the file header for why it sits in
 * `blocks/catalog` rather than the generic overlay tier.
 *
 * @param props - {@link BuyConfirmModalProps}
 */
const BuyConfirmModal = ({
    isOpen,
    onOpenChange,
    order,
    walletBalanceVnd,
    onConfirm,
    isConfirming = false,
    isSkeleton = false,
    labels,
}: BuyConfirmModalProps) => {
    const title = order != null
        ? `${labels.titlePrefix} — ${order.productName} · ${order.tierName}`
        : labels.titlePrefix

    return (
        <div data-tier="block" data-component="BuyConfirmModal">
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={title}
                size="md"
                isSkeleton={isSkeleton}
                body={({ isSkeleton: skeleton }: SkeletonProps) => (
                    <StackV
                        gap={4}
                        isSkeleton={skeleton}
                        items={[
                            () => (
                                <Typography
                                    size="lg"
                                    weight="bold"
                                    tabularNums
                                    isSkeleton={skeleton}
                                    text={order != null ? priceTextOf(order, labels) : labels.freeLabel}
                                />
                            ),
                            ...(skeleton || order?.description
                                ? [() => (
                                    <Typography
                                        size="sm"
                                        color="muted"
                                        isSkeleton={skeleton}
                                        text={order?.description ?? ""}
                                    />
                                )]
                                : []),
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    isSkeleton={skeleton}
                                    items={[
                                        () => <Typography size="sm" color="muted" isSkeleton={skeleton} text={labels.payWithLabel} />,
                                        () => (
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                tabularNums
                                                isSkeleton={skeleton}
                                                text={`${labels.walletLabel} (${formatVnd(walletBalanceVnd)})`}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
                footer={() => (
                    <>
                        <Button variant="ghost" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isConfirming} />
                        <Button variant="primary" label={labels.confirmLabel} onPress={onConfirm} isPending={isConfirming} isDisabled={order == null} />
                    </>
                )}
            />
        </div>
    )
}

export { BuyConfirmModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "BuyConfirmModal" } as const
