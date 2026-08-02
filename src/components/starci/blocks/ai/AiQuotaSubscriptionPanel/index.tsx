import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { AiQuotaLane, type AiQuotaLaneData } from "@/components/starci/blocks/ai/AiQuotaLane"
import { StackV } from "@/components/frames/Stack"

/**
 * `AiQuotaSubscriptionPanel` — the "Plan" tab body inside `AiQuotaModal`. The
 * Premium branch reuses `AiQuotaLane` unchanged; this panel owns the switch on
 * `tier` (no plan: CTA-in-a-card; active plan: lane-plus-caption) and the
 * surrounding CTA/caption wording.
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
                        <StackV gap={4} principles={["content-row"]} align="start" isSkeleton={isSkeleton} items={[
                            () => (
                                <Typography
                                    size="sm"
                                    color="muted"
                                    isSkeleton={isSkeleton}
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
                                    isSkeleton={isSkeleton}
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
            <StackV gap={4} isSkeleton={isSkeleton} items={[
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
                        isSkeleton={isSkeleton}
                        text={`You're on the ${TIER_LABEL[tier]} plan.`}

                    />
                ),
            ]} />
        </div>
    )
}

export { AiQuotaSubscriptionPanel }
