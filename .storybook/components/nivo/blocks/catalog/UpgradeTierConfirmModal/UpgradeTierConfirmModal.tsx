import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `UpgradeTierConfirmModal` — the last step before an owned catalog order is
 * upgraded to a higher tier of the same item: recap the current tier and the
 * target tier, show the proration amount due, then request the upgrade. It
 * owns one domain-shaped selection (product, current tier, target tier,
 * proration), which is exactly why it sits in `blocks/catalog` rather than
 * `overlays/modals` — the same placement `BuyConfirmModal` uses in this
 * folder (OVERLAY-9: the surface is generic, the entity belongs to the block
 * inside it). Grounded in `CatalogOrderEntity` + `CatalogTierEntity`;
 * confirming does not swap the tier itself — it issues the Unpaid
 * `CatalogUpgrade` proration invoice, and the swap applies once that invoice
 * is paid (`upgradeCatalogTier` mutation).
 */

/** The upgrade about to be requested — a subset of `CatalogOrderEntity` + its current/target `CatalogTierEntity`. */
export interface UpgradeTierConfirmModalOrder {
    /** Catalog item name (`CatalogItemEntity.name`, e.g. "AI Academy"). */
    productName: string
    /** The order's current tier name (`CatalogTierEntity.name`). */
    currentTierName: string
    /** The tier being upgraded to (`CatalogTierEntity.name`). */
    targetTierName: string
    /** Current tier's monthly price in VND, or null (`CatalogTierEntity.priceMonthlyVnd`). */
    currentPriceMonthlyVnd?: number | null
    /** Current tier's one-time price in VND, or null (`CatalogTierEntity.priceOneTimeVnd`). */
    currentPriceOneTimeVnd?: number | null
    /** Target tier's monthly price in VND, or null (`CatalogTierEntity.priceMonthlyVnd`). */
    targetPriceMonthlyVnd?: number | null
    /** Target tier's one-time price in VND, or null (`CatalogTierEntity.priceOneTimeVnd`). */
    targetPriceOneTimeVnd?: number | null
    /** Short positioning copy for the target tier, or null (`CatalogTierEntity.description`). */
    description?: string | null
}

/** Props for {@link UpgradeTierConfirmModal}. */
export interface UpgradeTierConfirmModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The order + target tier about to be upgraded, or null before any tier has been chosen. */
    order: UpgradeTierConfirmModalOrder | null
    /** Request the upgrade — the connected layer runs the `upgradeCatalogTier` mutation. */
    onConfirm: () => void
    /** `true` → the upgrade is being requested (confirm button busy, cancel locks). */
    isConfirming?: boolean
    /**
     * Set when the `upgradeCatalogTier` mutation is rejected (e.g. the order is no
     * longer active, or the target tier no longer sits above the current one) —
     * renders inline above the footer. Cleared by the connected layer the next
     * time the modal is reopened.
     */
    errorMessage?: string | null
    /**
     * `true` → the modal's own first fetch (e.g. resolving the order's current
     * tier) is in flight: the recap and the confirm button both shimmer. Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: UpgradeTierConfirmModalLabels
}

/** The already-resolved copy the modal renders. */
export interface UpgradeTierConfirmModalLabels {
    /** Title prefix, combined with the product + current/target tier names (e.g. "Confirm upgrade"). */
    titlePrefix: string
    /** Label before the current-tier row (e.g. "Current plan"). */
    currentPlanLabel: string
    /** Label before the proration amount (e.g. "Amount due"). */
    dueLabel: string
    /** Note explaining the invoice-then-pay flow, always shown. */
    noteText: string
    /** Text shown in place of a price when the proration amount is 0. */
    freeLabel: string
    /** Cancel button label. */
    cancelLabel: string
    /** Confirm button label. */
    confirmLabel: string
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** A tier's effective price — recurring price wins over one-time, mirroring the backend's own resolution. */
const tierPriceVndOf = (priceMonthlyVnd?: number | null, priceOneTimeVnd?: number | null): number =>
    priceMonthlyVnd ?? priceOneTimeVnd ?? 0

/** The proration amount due for this upgrade — the price difference between the two tiers, never negative. */
const prorationAmountVndOf = (order: UpgradeTierConfirmModalOrder): number =>
    Math.max(
        0,
        tierPriceVndOf(order.targetPriceMonthlyVnd, order.targetPriceOneTimeVnd)
            - tierPriceVndOf(order.currentPriceMonthlyVnd, order.currentPriceOneTimeVnd),
    )

/** Resolve the proration amount into one display string: formatted VND, or free. */
const dueTextOf = (order: UpgradeTierConfirmModalOrder, labels: UpgradeTierConfirmModalLabels): string => {
    const amountVnd = prorationAmountVndOf(order)
    return amountVnd === 0 ? labels.freeLabel : formatVnd(amountVnd)
}

/**
 * The upgrade-confirmation modal. See the file header for why it sits in
 * `blocks/catalog` rather than the generic overlay tier.
 *
 * @param props - {@link UpgradeTierConfirmModalProps}
 */
const UpgradeTierConfirmModal = ({
    isOpen,
    onOpenChange,
    order,
    onConfirm,
    isConfirming = false,
    errorMessage = null,
    isSkeleton = false,
    labels,
}: UpgradeTierConfirmModalProps) => {
    const title = order != null
        ? `${labels.titlePrefix} — ${order.productName} · ${order.currentTierName} → ${order.targetTierName}`
        : labels.titlePrefix

    return (
        <div data-tier="block" data-component="UpgradeTierConfirmModal">
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={title}
                size="md"
                isSkeleton={isSkeleton}
                body={({ isSkeleton: skeleton }: SkeletonProps) => (
                    <StackV
                        gap={4}
                        principle="label-field"
                        isSkeleton={skeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    isSkeleton={skeleton}
                                    items={[
                                        () => <Typography size="sm" color="muted" isSkeleton={skeleton} text={labels.dueLabel} />,
                                        () => (
                                            <Typography
                                                size="lg"
                                                weight="bold"
                                                tabularNums
                                                isSkeleton={skeleton}
                                                text={order != null ? dueTextOf(order, labels) : labels.freeLabel}
                                            />
                                        ),
                                    ]}
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
                                    principle="flex-action"
                                    justify="between"
                                    isSkeleton={skeleton}
                                    items={[
                                        () => <Typography size="sm" color="muted" isSkeleton={skeleton} text={labels.currentPlanLabel} />,
                                        () => (
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                isSkeleton={skeleton}
                                                text={order?.currentTierName ?? ""}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => <Typography size="xs" color="muted" isSkeleton={skeleton} text={labels.noteText} />,
                            ...(errorMessage
                                ? [() => <Typography size="sm" color="danger" isSkeleton={skeleton} text={errorMessage} />]
                                : []),
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

export { UpgradeTierConfirmModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "UpgradeTierConfirmModal" } as const
