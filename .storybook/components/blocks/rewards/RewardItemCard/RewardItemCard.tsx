import React from "react"
import type { ReactNode } from "react"
import { Card, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { Button } from "../../buttons/Button/Button"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { IconTile } from "../../identity/IconTile/IconTile"
import { TitledText } from "../../text/TitledText/TitledText"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from the per-reward `Card`
 * inline in `@/components/features/rewards/RewardsPage/RewardCatalog`. Authored
 * in Storybook (not `src`); synced to `src` later. NO `@/components` imports —
 * composes local ports only (`IconTile`, `StatusChip`, `Button`, `Skeleton`) over
 * a raw HeroUI `Card` frame.
 *
 * The real catalog embeds this markup per reward plus an expand-in-place shipping
 * form (physical rewards) + a spend-confirm modal it owns at the CATALOG level —
 * this port isolates the reusable, self-contained item shell (icon · title/desc ·
 * cost chip · redeem CTA); the parent screen wires the shipping/confirm flow
 * around `onRedeem`.
 */

/** Props for the {@link RewardItemCard} block. */
export interface RewardItemCardProps {
    /** Leading glyph (phosphor `*Icon`), shown inside an `IconTile`. Primitive owns sizing — pass it bare. */
    icon: ReactNode
    title: string
    description: string
    /** Coin cost — rendered through {@link RewardItemCardProps.formatCost} inside a `StatusChip`. */
    cost: number
    /** Formats the numeric cost into the chip label. Defaults to `"<n> Coin"`. */
    formatCost?: (cost: number) => ReactNode
    /** Redeem CTA label. Defaults to `"Đổi"`. */
    redeemLabel?: string
    /** Shown on the CTA instead of {@link RewardItemCardProps.redeemLabel} when `disabled` (can't afford). */
    cannotAffordLabel?: string
    /** Fired on redeem-CTA press. */
    onRedeem: () => void
    /** `true` → viewer can't afford this reward: CTA disabled, label swaps to {@link RewardItemCardProps.cannotAffordLabel}. */
    disabled?: boolean
    /** `true` → this reward's redeem is in flight (CTA spinner via `Button`'s `isPending`, press locked). */
    isRedeeming?: boolean
    /**
     * `true` → render the skeleton MIRROR (same `Card` frame/box), keeping the
     * catalog grid from jumping while the reward list loads. All other props
     * ignored (§6/§8: skeleton is a PROP, not a separate component).
     */
    isSkeleton?: boolean
    /** `true` → emit `data-anat-part` on each anatomy part (Storybook `BlockAnatomy` overlay). */
    showAnatomy?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * Reward catalog item: an icon tile, title + description, a Coin-cost chip and a
 * redeem CTA. Presentational + self-contained — the caller only supplies data and
 * an `onRedeem` callback; affordability/pending state are props, not derived here.
 *
 * @param props - {@link RewardItemCardProps}
 */
export const RewardItemCard = ({
    icon,
    title,
    description,
    cost,
    formatCost = (amount) => `${amount} Coin`,
    redeemLabel = "Đổi",
    cannotAffordLabel = "Không đủ Coin",
    onRedeem,
    disabled = false,
    isRedeeming = false,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: RewardItemCardProps) => {
    if (isSkeleton) {
        return (
            <Card className={cn("flex flex-col gap-3", className)}>
                <div className="flex items-start gap-3">
                    <Skeleton
                        className="size-12 shrink-0 rounded-xl"
                        anatPart={showAnatomy ? "Skeleton.Icon" : undefined}
                    />
                    {/* title↔description stack = TitledText (skeleton mirror delegated) */}
                    <TitledText
                        title=""
                        subtitle="x"
                        isSkeleton
                        className="flex-1"
                        anatPart={showAnatomy ? "TitledText" : undefined}
                    />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <Skeleton.Chip anatPart={showAnatomy ? "Skeleton.Chip" : undefined} />
                    <Skeleton.Button
                        width="w-20"
                        anatPart={showAnatomy ? "Skeleton.Button" : undefined}
                    />
                </div>
            </Card>
        )
    }

    return (
        <Card className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-start gap-3">
                <IconTile size="sm" tone="accent" icon={icon} anatPart={showAnatomy ? "IconTile" : undefined} />
                {/* title (body-sm semibold) + muted description = one TitledText (was 2 raw
                    spans — §9 fix: font now flows through Typography via the primitive) */}
                <TitledText
                    title={title}
                    subtitle={description}
                    weight="semibold"
                    truncate
                    className="flex-1"
                    anatPart={showAnatomy ? "TitledText" : undefined}
                />
            </div>

            <div className="flex items-center justify-between gap-3">
                <StatusChip tone="accent" anatPart={showAnatomy ? "StatusChip" : undefined}>{formatCost(cost)}</StatusChip>
                <Button
                    variant="primary"
                    size="sm"
                    isDisabled={disabled || isRedeeming}
                    isPending={isRedeeming}
                    onPress={onRedeem}
                    anatPart={showAnatomy ? "Button" : undefined}
                >
                    {disabled ? cannotAffordLabel : redeemLabel}
                </Button>
            </div>
        </Card>
    )
}
