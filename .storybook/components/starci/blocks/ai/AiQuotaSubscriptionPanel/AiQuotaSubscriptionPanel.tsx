import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { AiQuotaLane, type AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AiQuotaSubscriptionPanel` — a BLOCK: the body of the "Package" (Subscription)
 * tab inside `AiQuotaModal` — either a "no paid tier yet" CTA, or the Premium
 * `AiQuotaLane` plus a caption naming the active tier.
 *
 * `tier` and `premiumLane` arrive as plain typed props and `onSubscribe` is a bare
 * callback; data fetching and routing stay app wiring, out of scope. Two leaves,
 * branching on whether `tier` is set:
 *   - `NoTierCta` — a muted sentence + one button inside a bordered `SurfaceCard`
 *     (`variant="nested"`) so the offer reads as its own inset region.
 *   - `ActiveLane` — the reused `AiQuotaLane` block plus a caption naming the
 *     tier; `data`/`isLoading` pass straight through.
 *
 * The block owns its own wording (CTA label, "no tier" sentence, "active tier"
 * caption are hardcoded, not string props). "No tier" is modelled as
 * `tier: AiQuotaTier | null` rather than folding null into the tier union.
 */

/** Paid AI subscription tier (mirrors `src`'s `AiSubTier`). */
export type AiQuotaTier = "plus" | "pro" | "max"

/** {@link AiQuotaTier} → its display code in the "active tier" caption. */
const TIER_LABEL: Record<AiQuotaTier, string> = {
    plus: "PLUS",
    pro: "PRO",
    max: "MAX",
}

/** The Premium `AiQuotaLane` feed — same shape {@link AiQuotaLane} itself takes, passed straight through. */
export interface AiQuotaSubscriptionPanelPremiumLane {
    /** The lane's two windows. Unset while `isLoading` (or before the first fetch lands). */
    data?: AiQuotaLaneData
    /** `true` → the Premium lane's own fetch is in flight. */
    isLoading: boolean
}

/** Props {@link AiQuotaSubscriptionPanel} carries regardless of loading state. */
interface AiQuotaSubscriptionPanelOwnProps {
    /** Fired when the reader taps the CTA on the no-tier leaf. */
    onSubscribe: () => void
    /** Extra classes on the root. */
    className?: string
}

/**
 * Props for {@link AiQuotaSubscriptionPanel}. `tier`/`premiumLane` are REQUIRED
 * unless `isSkeleton` (§12b) — which of the two leaves to show isn't known
 * before the subscription fetch resolves.
 */
export type AiQuotaSubscriptionPanelProps = AiQuotaSubscriptionPanelOwnProps &
    (
        | { isSkeleton: true; tier?: AiQuotaTier | null; premiumLane?: AiQuotaSubscriptionPanelPremiumLane }
        | {
            isSkeleton?: false
            /** Active paid tier, or `null` on the free lane — picks the leaf. */
            tier: AiQuotaTier | null
            /** Premium lane data, only rendered once `tier` is set. */
            premiumLane: AiQuotaSubscriptionPanelPremiumLane
        }
    )

/**
 * Subscription tab body of `AiQuotaModal`. See the file header for the full
 * contract and the two leaves.
 *
 * @param props - {@link AiQuotaSubscriptionPanelProps}
 */
const AiQuotaSubscriptionPanel = ({
    tier,
    premiumLane,
    onSubscribe,
    isSkeleton = false,
    className,
}: AiQuotaSubscriptionPanelProps) => {
    if (isSkeleton) {
        return (
            <div className={className}>
                <AiQuotaLane isLoading />
            </div>
        )
    }
    if (tier == null) {
        return (
            <div className={className}>
                <SurfaceCard
                    variant="nested"
                    padding={4}


                    body={() => (
                        <StackV gap={4} align="start" items={[
                            () => (
                                <Typography
                                    size="sm"
                                    color="muted"
                                    text="You don't have a paid plan yet. Upgrade to unlock Premium credit and get graded with premium models."

                                />
                            ),
                            () => (
                                <Button
                                    label="Subscribe to a paid plan"
                                    variant="primary"
                                    size="lg"
                                    suffixIcon={ArrowRightIcon}
                                    iconSlide
                                    onPress={onSubscribe}
                                />
                            ),
                        ]} />
                    )}
                />
            </div>
        )
    }

    return (
        <div className={className}>
            <StackV gap={4} items={[
                () => (
                    <AiQuotaLane
                        data={premiumLane?.data}
                        isLoading={premiumLane?.isLoading ?? false}


                    />
                ),
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        text={`You're on the ${TIER_LABEL[tier]} plan.`}

                    />
                ),
            ]} />
        </div>
    )
}

export { AiQuotaSubscriptionPanel }
