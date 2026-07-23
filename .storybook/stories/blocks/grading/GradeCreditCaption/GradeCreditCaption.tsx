import React from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/grading/GradeCreditCaption`. Authored in Storybook (not
 * `src`); synced to `src` later. NO `@/components` imports. In `src` the quota
 * type is `QueryMyAiQuotaResponseData` and the copy comes from
 * `useTranslations()`; the credit shape + strings are INLINED here so the local
 * port stays self-contained.
 */

/** Minimal weekly/burst credit snapshot the caption reads (subset of `myAiQuota`). */
export interface GradeCreditUsage {
    credit: {
        /** Credits left in the rolling 5h burst window. */
        remaining5h: number
        /** Credits left in the weekly pool. */
        remainingWeek: number
        /** Weekly pool size (for the "N/M" line). */
        limitWeek: number
    }
}

/** Props for {@link GradeCreditCaption}. */
export interface GradeCreditCaptionProps {
    /**
     * Unified, TIER-AWARE quota snapshot from `myAiQuota` (free base OR the active
     * tier's cap). Null/undefined while loading → the caption renders NOTHING.
     */
    creditUsage: GradeCreditUsage | null | undefined
    /**
     * True when a concrete model is pinned (vs the Auto lane). Both lanes debit
     * the SAME weekly pool, so the credit line shows either way — this only gates
     * the affordability WARNING (fired for Auto, whose per-run cost is known via
     * `autoCreditCost`; a pinned model's cost isn't known here). Pass `!!selection.model`.
     */
    hasPinnedModel: boolean
    /** Credits per Auto run (`systemConfig.ai.auto.creditCost`) — drives the quota-reached check. */
    autoCreditCost: number | undefined
    /** Optional press → open the AI-quota details modal (makes the caption interactive). */
    onOpenDetails?: () => void
    /** Extra classes on the wrapper. */
    className?: string
    /** Storybook-only: emit `data-anat-part` anchors on each part for the anatomy panel. */
    showAnatomy?: boolean
}

/**
 * The ONE shared "còn N/M credit tuần này" caption for every AI surface, sitting
 * directly under (or beside) the model picker. Bound to the PICKER — NOT the CTA
 * button — so it's correct regardless of the button's width. Shows the unified
 * weekly pool for BOTH lanes (Auto AND a pinned model both debit it). Renders a
 * muted line normally, or a `text-danger-soft-foreground` warning line (with icon) when the pool
 * can't afford the next AUTO run. Free-lane surfaces (chatbot) don't consume the
 * pool → they simply don't render this.
 *
 * The feature QUERIES `myAiQuota` and passes it in — this block does NOT query
 * (so callers that don't need credit aren't burdened with the request).
 *
 * @param props - {@link GradeCreditCaptionProps}
 */
export const GradeCreditCaption = ({
    creditUsage,
    hasPinnedModel,
    autoCreditCost,
    onOpenDetails,
    className,
    showAnatomy,
}: GradeCreditCaptionProps) => {
    // no snapshot yet (loading) → render nothing.
    if (!creditUsage) {
        return null
    }

    // BOTH lanes debit the SAME weekly pool — the served model's catalog credit,
    // whether Auto-picked or pinned (a pinned premium model costs MORE, not zero).
    // So show the pool for both. The affordability WARNING only fires on Auto,
    // where we know the per-run cost (`autoCreditCost`); a pinned model's cost
    // isn't known here, so it shows the usage line without the block check.
    // Two independent windows can trigger the block — a short 5h burst cap or the
    // weekly pool — and the message must name the ACTUAL reason: telling someone
    // who still has weekly credit that they're "out for the week" is just wrong.
    const canAffordAuto = autoCreditCost !== undefined
    const blockedByBurst = canAffordAuto && creditUsage.credit.remaining5h < autoCreditCost
    const blockedByWeek = canAffordAuto && creditUsage.credit.remainingWeek < autoCreditCost
    const blocked = !hasPinnedModel && (blockedByBurst || blockedByWeek)

    const text = blocked
        ? (blockedByWeek
            ? "Đã hết credit AI tuần này"
            : "Đã dùng hết credit trong ít phút vừa rồi — chờ khung giờ mới")
        : `Còn ${creditUsage.credit.remainingWeek}/${creditUsage.credit.limitWeek} credit tuần này`

    const content = (
        <span
            data-anat-part={showAnatomy ? "span · caption" : undefined}
            className={cn(
                "inline-flex items-center gap-1 text-sm",
                blocked ? "font-medium text-danger-soft-foreground" : "text-muted",
            )}
        >
            {blocked ? <WarningCircleIcon aria-hidden data-anat-part={showAnatomy ? "WarningCircleIcon" : undefined} className="size-4 shrink-0" /> : null}
            {text}
        </span>
    )

    if (onOpenDetails) {
        return (
            <button
                type="button"
                onClick={onOpenDetails}
                data-anat-part={showAnatomy ? "button · pressable" : undefined}
                className={cn("w-fit cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent", className)}
            >
                {content}
            </button>
        )
    }

    return <span data-anat-part={showAnatomy ? "span · wrapper" : undefined} className={cn(className)}>{content}</span>
}
