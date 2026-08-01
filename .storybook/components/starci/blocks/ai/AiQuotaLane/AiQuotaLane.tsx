import React from "react"
import { QuotaBar } from "@sb-components/starci/blocks/ai/QuotaBar/QuotaBar"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AiQuotaLane`: one lane's pair of rolling-window quota bars — "next 5
 * hours" above "this week" — both counting usage against the same lane's cap.
 *
 * WHY A BLOCK, AND A SHARED ONE: ported faithfully from `@/components/modals/
 * AiQuotaModal/QuotaLane` (plus its `QuotaBar` leaf). `src`'s `QuotaLane` is
 * SHARED between the Auto tab (fed by `useQueryMyCreditUsageSwr`) and the
 * Premium branch of the Subscription tab (fed by `useQueryMyAiQuotaSwr`) — same
 * two bars, different numbers, decided entirely by WHICH query the caller wires
 * up. Storybook decouples the fetch on purpose: `data` is a plain typed prop
 * (§13 — a block never owns its own SWR/mutation), so the screen mounting each
 * tab is the one that picks the query, exactly like `src`'s `variant` prop did.
 *
 * ⭐ TWO CALLS OF THE SAME BLOCK, NOT A SECOND `QuotaBar` (mentor finalized
 * 2026-07-29): this file used to carry its OWN private `QuotaBar` leaf plus its
 * own `resolveFillTone`/`resolveFillPercent` — the exact same shape, and the
 * exact same 75%/90% ramp, that `blocks/ai/QuotaBar` already owns as a public
 * block with its own story. Two ports of `src`'s `QuotaBar` leaf were living
 * side by side with nothing keeping them in sync. This lane now calls THAT
 * block twice — label/used/limit/resetLabel swapped, nothing else — instead of
 * re-drawing it. The fill-tone ramp (accent ≤75% · warning >75% · danger >90%)
 * lives in `QuotaBar` alone now; a caller here never sees it.
 *
 * JUDGEMENT CALL — `isLoading` is REQUIRED (not defaulted, unlike the usual
 * `isSkeleton?`) because "no data yet" and "mid-fetch" render IDENTICALLY from
 * the outside (`data` is unset either way). Forcing the caller to say which one
 * it is stops a genuinely-empty response from silently reading as a shimmer
 * that never resolves.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One rolling-window quota reading, ready to draw as a single {@link ProgressBar}. */
export interface AiQuotaWindow {
    /** Amount consumed in this window. */
    used: number
    /** Cap for this window (`0` reads as "no allowance"). */
    limit: number
    /** Reset line under the bar (e.g. `"Resets at 18:50 on 06/01"`). `null`/unset → no line. */
    resetLabel?: string | null
}

/** The two rolling windows one {@link AiQuotaLane} tracks. */
export interface AiQuotaLaneData {
    /** Next-5-hours rolling window. */
    window5h: AiQuotaWindow
    /** This-week rolling window. */
    windowWeek: AiQuotaWindow
}

/** Props for {@link AiQuotaLane}. */
export interface AiQuotaLaneProps {
    /** The lane's two windows. Unset while `isLoading` (or before the first fetch lands). */
    data?: AiQuotaLaneData
    /** `true` → this lane's own fetch is in flight; both bars draw their skeleton mirror. */
    isLoading: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The lane's two bars. See the file header for what it owns (window labels)
 * and what it deliberately does not (fetching — `data` is a plain prop, never
 * an internal SWR call — and the fill-tone ramp, which `QuotaBar` owns).
 *
 * @param props - {@link AiQuotaLaneProps}
 */
const AiQuotaLane = ({ data, isLoading }: AiQuotaLaneProps) => {
    const showSkeleton = isLoading || !data

    return (
        <div>
            <StackV gap={4} body={
                <>
                    <QuotaBar
                        label="Next 5 hours"
                        used={data?.window5h.used ?? 0}
                        limit={data?.window5h.limit ?? 0}
                        resetLabel={data?.window5h.resetLabel}
                        isSkeleton={showSkeleton}


                    />
                    <QuotaBar
                        label="This week"
                        used={data?.windowWeek.used ?? 0}
                        limit={data?.windowWeek.limit ?? 0}
                        resetLabel={data?.windowWeek.resetLabel}
                        isSkeleton={showSkeleton}


                    />
                </>
            } />
        </div>
    )
}

export { AiQuotaLane }
