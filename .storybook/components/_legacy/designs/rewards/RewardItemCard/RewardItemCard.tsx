import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { ReactNode } from "react"
import { Card, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import type { IconComponent } from "@sb-components/atoms/display/IconTile/IconTile"
import { TitledText } from "@sb-components/layouts/text/TitledText/TitledText"

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

/** Props shared by both the real and skeleton state of {@link RewardItemCard}. */
export interface RewardItemCardOwnProps {
    /** Formats the numeric cost into the chip label. Defaults to `"<n> Coin"`. */
    formatCost?: (cost: number) => ReactNode
    /** Redeem CTA label. Defaults to `"Đổi"`. */
    redeemLabel?: string
    /** Shown on the CTA instead of {@link RewardItemCardOwnProps.redeemLabel} when `disabled` (can't afford). */
    cannotAffordLabel?: string
    /** Fired on redeem-CTA press. */
    onRedeem: () => void
    /** `true` → viewer can't afford this reward: CTA disabled, label swaps to {@link RewardItemCardOwnProps.cannotAffordLabel}. */
    disabled?: boolean
    /** `true` → this reward's redeem is in flight (CTA spinner via `Button`'s `isPending`, press locked). */
    isRedeeming?: boolean
    /** `true` → emit `data-anat-part` on each anatomy part (Storybook `BlockAnatomy` overlay). */
    showAnatomy?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * Props for the {@link RewardItemCard} block. `isSkeleton: true` drops the
 * content requirements (icon/title/description/cost become optional and are
 * ignored) — render the skeleton MIRROR (same `Card` frame/box), keeping the
 * catalog grid from jumping while the reward list loads (§6/§8: skeleton is a
 * PROP, not a separate component).
 */
export type RewardItemCardProps = RewardItemCardOwnProps &
    (
        | {
              isSkeleton: true
              /** Leading glyph (phosphor icon component), shown inside an `IconTile`. */
              icon?: IconComponent
              title?: string
              description?: string
              /** Coin cost — rendered through {@link RewardItemCardOwnProps.formatCost} inside a `StatusChip`. */
              cost?: number
          }
        | {
              isSkeleton?: false
              /** Leading glyph (phosphor icon component), shown inside an `IconTile`. */
              icon: IconComponent
              title: string
              description: string
              /** Coin cost — rendered through {@link RewardItemCardOwnProps.formatCost} inside a `StatusChip`. */
              cost: number
          }
    )

/**
 * Reward catalog item: an icon tile, title + description, a Coin-cost chip and a
 * redeem CTA. Presentational + self-contained — the caller only supplies data and
 * an `onRedeem` callback; affordability/pending state are props, not derived here.
 *
 * @param props - {@link RewardItemCardProps}
 */
export const RewardItemCard = (props: RewardItemCardProps) => {
    const {
        formatCost = (amount) => `${amount} Coin`,
        redeemLabel = "Đổi",
        cannotAffordLabel = "Không đủ Coin",
        onRedeem,
        disabled = false,
        isRedeeming = false,
        showAnatomy = false,
        className,
    } = props

    if (props.isSkeleton) {
        return (
            <Card className={cn("flex flex-col gap-3", className)}>
                <div className="flex items-start gap-3">
                    <HeroSkeleton className="size-12 shrink-0 rounded-xl" data-anat-part={showAnatomy ? "Skeleton.Icon" : undefined} />
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
                    <Chip.Base isSkeleton showAnatomy={showAnatomy} />
                    <Button isSkeleton className="w-20" anatPart={showAnatomy ? "Skeleton" : undefined} />
                </div>
            </Card>
        )
    }

    const { icon, title, description, cost } = props

    return (
        <Card className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-start gap-3">
                <IconTile.Base size="sm" tone="accent" icon={icon} anatPart={showAnatomy ? "IconTile" : undefined} />
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
                <Chip.Base tone="accent" anatPart={showAnatomy ? "StatusChip" : undefined} text={formatCost(cost)} />
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
