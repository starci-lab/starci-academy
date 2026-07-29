import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { AiQuotaLane, type AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AiQuotaSubscriptionPanel`: body of the "Gói" (Subscription) tab
 * inside `AiQuotaModal` — either a plain "no paid tier yet" CTA, or the
 * Premium `AiQuotaLane` plus a caption naming the active tier.
 *
 * PORTED FROM `src/components/modals/AiQuotaModal/SubscriptionTab/index.tsx`.
 * The source fetches `useQueryMyAiQuotaSwr` itself and routes the CTA via
 * `useRouter`/`pathConfig`; both are APP WIRING, out of scope here (§13/rule
 * 13's sibling discipline for a presentational block — same cut a `page.tsx`
 * makes for its data hooks). `tier` and `premiumLane` arrive as plain typed
 * props instead, and `onSubscribe` is a bare callback the screen wires up.
 *
 * TWO LEAVES, branching on whether `tier` is set — same branch the source
 * makes on `!quota.tier`:
 *   - `NoTierCta` — a muted sentence + one button, inside a bordered
 *     `SurfaceCard` (`variant="nested"`) so the offer reads as its own inset
 *     region inside the modal's already-filled face — the SAME composite
 *     `AiQuotaHistoryPanel` (this plan's sibling tab body) already reuses for
 *     its chart panel, instead of a hand-rolled `border` div.
 *   - `ActiveLane` — the reused `AiQuotaLane` block (this plan's sibling,
 *     "new, reuse within this plan") plus a caption naming the tier. `data`/
 *     `isLoading` pass straight through to it unshaped — this panel does not
 *     re-decide what a quota bar looks like, only what wraps it.
 *
 * §14d.1 — THE BLOCK OWNS ITS OWN WORDING. All three Vietnamese strings (the
 * CTA label, the "no tier" sentence, the "active tier" caption) are ported
 * verbatim from `vi.json`'s `aiQuota.subscribeCta` / `subscriptionNone` /
 * `subscriptionActive` and hardcoded here — there is no `ctaLabel`/`caption`
 * string prop, matching the task's own prop list (`tier` / `premiumLane` /
 * `onSubscribe` only, no pre-formatted text).
 *
 * JUDGEMENT CALL — `AiQuotaTier` is the real tier enum (`plus`/`pro`/`max`,
 * mirroring `src`'s `AiSubTier`); the "no tier" state is modelled as
 * `tier: AiQuotaTier | null` rather than folding "null" into the tier union
 * itself, since a tier value and "no tier at all" are a different KIND of
 * fact (what plan vs. whether there is one), and the null check is exactly
 * the leaf switch this block makes.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    anatPart,
    showAnatomy = false,
}: AiQuotaSubscriptionPanelProps) => {
    if (isSkeleton) {
        return (
            <div className={className} data-anat-part={anatPart}>
                <AiQuotaLane isLoading showAnatomy={showAnatomy} anatPart={showAnatomy ? "AiQuotaLane" : undefined} />
            </div>
        )
    }
    if (tier == null) {
        return (
            <div className={className} data-anat-part={anatPart}>
                <SurfaceCard
                    variant="nested"
                    padding="cozy"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "SurfaceCard" : undefined}
                >
                    <StackV gap="grouped" align="start" anatPart={showAnatomy ? "StackV" : undefined}>
                        <Typography
                            size="sm"
                            color="muted"
                            text="Bạn chưa có gói trả phí. Nâng cấp để mở khoá credit Premium và chấm bài bằng model cao cấp."
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                        <Button
                            label="Đăng ký gói trả phí"
                            variant="primary"
                            size="lg"
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onSubscribe}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    </StackV>
                </SurfaceCard>
            </div>
        )
    }

    return (
        <div className={className} data-anat-part={anatPart}>
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                <AiQuotaLane
                    data={premiumLane?.data}
                    isLoading={premiumLane?.isLoading ?? false}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "AiQuotaLane" : undefined}
                />
                <Typography
                    size="sm"
                    color="muted"
                    text={`Bạn đang dùng gói ${TIER_LABEL[tier]}.`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            </StackV>
        </div>
    )
}

export { AiQuotaSubscriptionPanel }
