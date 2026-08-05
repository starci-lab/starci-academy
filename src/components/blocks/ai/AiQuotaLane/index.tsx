import React from "react"
import { QuotaBar } from "@/components/blocks/ai/QuotaBar"
import { StackV } from "@/components/frames/Stack"

/**
 * `AiQuotaLane` — one lane's pair of rolling-window quota bars ("next 5 hours"
 * above "this week"), shared by the Auto tab and the Premium branch of the
 * Subscription tab inside `AiQuotaModal`. Both rows are the same `QuotaBar`
 * composition reading a different window. Unset `data`/`isLoading` shimmers
 * both bars.
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
            <StackV gap={4} items={[
                () => (
                    <QuotaBar
                        label="Next 5 hours"
                        used={data?.window5h.used ?? 0}
                        limit={data?.window5h.limit ?? 0}
                        resetLabel={data?.window5h.resetLabel}
                        isSkeleton={showSkeleton}


                    />
                ),
                () => (
                    <QuotaBar
                        label="This week"
                        used={data?.windowWeek.used ?? 0}
                        limit={data?.windowWeek.limit ?? 0}
                        resetLabel={data?.windowWeek.resetLabel}
                        isSkeleton={showSkeleton}


                    />
                ),
            ]} />
        </div>
    )
}

export { AiQuotaLane }
