import React from "react"
import type { ProgressColor } from "@sb-components/atoms/display/Progress/Progress"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AiQuotaLane`: one lane's pair of rolling-window quota bars — "5 giờ
 * tới" above "tuần này" — both counting usage against the same lane's cap.
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
 * ⭐ TWO LEAVES, ONE SHAPE (per the task's own framing, and per `src`): reading
 * the "next 5 hours" window and reading the "this week" window are the SAME
 * composition — label · used/limit · bar · optional reset line. They are not
 * two structures, so the leaf (`QuotaBar` below) is written ONCE and called
 * twice — matching how `src`'s `QuotaLane` renders the identical `<QuotaBar>`
 * back to back with only the label/window swapped. `QuotaBar` itself carries
 * no `anatPart` (see its own header) — it has no story of its own to badge a
 * wrapper name toward, so only the real atoms/frames inside it enter the
 * anatomy tree, twice over, once per call.
 *
 * ⭐ FILL TONE STAYS A THRESHOLD BAND OWNED HERE, same split `src` keeps in its
 * own `resolve-quota-bar-fill-tone.ts`: accent ≤75% used, warning >75%, danger
 * >90%. A ratio a caller could get subtly wrong (an off-by-one on the boundary,
 * a different cutoff per screen) stays inside the one place that draws the bar
 * rather than duplicated at every call site.
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
    /** Reset line under the bar (e.g. `"Reset lúc 18:50 01/06"`). `null`/unset → no line. */
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
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Usage ratio above which a bar turns `warning` (ported from `src`'s fill-tone resolver). */
const WARNING_USAGE_RATIO = 0.75
/** Usage ratio above which a bar turns `danger`. */
const DANGER_USAGE_RATIO = 0.9

/** Consumed share → tier colour. `accent` ≤75% · `warning` >75% · `danger` >90%. */
const resolveFillTone = (used: number, limit: number): ProgressColor => {
    const ratio = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : (used > 0 ? 1 : 0)
    if (ratio > DANGER_USAGE_RATIO) {
        return "danger"
    }
    if (ratio > WARNING_USAGE_RATIO) {
        return "warning"
    }
    return "accent"
}

/** Same clamp `src`'s `QuotaBar` runs before handing a percent to `ProgressBar`. */
const resolveFillPercent = (used: number, limit: number): number => {
    if (limit <= 0) {
        return used > 0 ? 100 : 0
    }
    return Math.min(100, Math.max(0, (used / limit) * 100))
}

/** Props for the internal {@link QuotaBar} leaf — one labelled window, real or skeleton. */
interface QuotaBarProps {
    /** Window label the block owns (e.g. `"Trong 5 giờ"`) — never a caller-formatted string (§14d.1). */
    label: string
    /** The window's numbers. Unset while `isSkeleton`. */
    window?: AiQuotaWindow
    /** `true` → draws the shimmer mirror instead of real numbers. */
    isSkeleton?: boolean
    showAnatomy?: boolean
}

/**
 * One labelled rolling-window bar: a label/used-limit row atop a {@link
 * ProgressBar}, an optional reset line underneath. Ported from `src`'s
 * `QuotaBar` leaf — the ONE shape both the next-5-hours and this-week rows in
 * {@link AiQuotaLane} are (see file header).
 *
 * ⚠️ Not itself anatomy-tagged: it has no story of its own (co-located, not a
 * separate exported unit), so it only surfaces the REAL parts inside it
 * (`StackV`/`StackH`/`Typography`/`ProgressBar`) rather than badging a wrapper
 * name a BlockAnatomy panel could never link anywhere (check-orphan-parts).
 */
const QuotaBar = ({ label, window, isSkeleton = false, showAnatomy = false }: QuotaBarProps) => {
    if (isSkeleton || !window) {
        return (
            <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                    <Typography size="sm" color="muted" isSkeleton className="w-20" anatPart={showAnatomy ? "Typography" : undefined} />
                    <Typography size="sm" isSkeleton className="w-16" anatPart={showAnatomy ? "Typography" : undefined} />
                </StackH>
                <ProgressBar isSkeleton showAnatomy={showAnatomy} />
                <Typography size="xs" color="muted" isSkeleton className="w-1/3" anatPart={showAnatomy ? "Typography" : undefined} />
            </StackV>
        )
    }

    return (
        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
            <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                <Typography size="sm" color="muted" text={label} anatPart={showAnatomy ? "Typography" : undefined} />
                <Typography
                    size="sm"
                    weight="medium"
                    tabularNums
                    text={<>{window.used} / {window.limit}</>}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            </StackH>
            <ProgressBar
                value={resolveFillPercent(window.used, window.limit)}
                color={resolveFillTone(window.used, window.limit)}
                size="sm"
                ariaLabel={label}
                showAnatomy={showAnatomy}
            />
            {window.resetLabel ? (
                <Typography size="xs" color="muted" text={window.resetLabel} anatPart={showAnatomy ? "Typography" : undefined} />
            ) : null}
        </StackV>
    )
}

/**
 * The lane's two bars. See the file header for what it owns (window labels,
 * the fill-tone threshold) and what it deliberately does not (fetching — `data`
 * is a plain prop, never an internal SWR call).
 *
 * @param props - {@link AiQuotaLaneProps}
 */
const AiQuotaLane = ({ data, isLoading, showAnatomy = false, anatPart }: AiQuotaLaneProps) => {
    const showSkeleton = isLoading || !data

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                <QuotaBar
                    label="Trong 5 giờ"
                    window={data?.window5h}
                    isSkeleton={showSkeleton}
                    showAnatomy={showAnatomy}
                />
                <QuotaBar
                    label="Trong 7 ngày"
                    window={data?.windowWeek}
                    isSkeleton={showSkeleton}
                    showAnatomy={showAnatomy}
                />
            </StackV>
        </div>
    )
}

export { AiQuotaLane }
