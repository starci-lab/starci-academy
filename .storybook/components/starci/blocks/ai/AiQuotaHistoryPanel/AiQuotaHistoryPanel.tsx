import React from "react"
import dayjs from "dayjs"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AiQuotaHistoryPanel`: the body of the "History" tab inside
 * `AiQuotaModal` — a 7-day credit-usage bar chart plus a scrollable list of
 * recent AI charges (model · what it was for · when · credit delta).
 *
 * PORTED FROM `src/components/modals/AiQuotaModal/HistoryTab/index.tsx`, same
 * discipline as `LanguageDonut`/`ContentModeNav` (see their file headers): the
 * recharts call is carried over as-is (no chart wrapper exists in this design
 * system yet), and the domain vocabulary (purpose labels, the "auto model"
 * fallback, the credits unit) is OWNED here as a block-local table — the caller
 * hands over an enum (`surface`) and a number, never a pre-formatted string
 * (§14d.1), same pattern as `ContentModeNav`'s `MODE_LABEL`.
 *
 * FOUR JUDGEMENT CALLS worth flagging:
 *
 * 1. **New group `ai/`.** None of the five existing block groups
 *    (`commerce`/`consultant`/`learn`/`navigation`/`profile`) fit: this is
 *    neither a pricing/urgency nudge (`commerce`), nor lesson content
 *    (`learn`), nor identity (`profile`) — it is the AI-credit-usage domain on
 *    its own, and forcing it into a neighbour group would misfile it just to
 *    avoid a new folder.
 * 2. **Chart caption says "7 days", not the source's "14 days".** `vi.json`'s
 *    `aiQuota.history.chartTitle` reads "…(last 14 days)", but the source
 *    hook that feeds it only ever builds SEVEN day-buckets (`for (let offset =
 *    7 - 1; …)`) — the "14" was already stale copy sitting above a 7-bar
 *    chart. This block (and the task spec) commit to the real bucket count,
 *    so the caption is fixed to match what actually renders instead of
 *    carrying the mismatch forward. Same reasoning: the X-axis shows every
 *    day (`interval={0}`) instead of the source's `interval={1}` — that
 *    skip-one tuning made sense for 14 points, not for 7.
 * 3. **No `ScrollShadow` atom exists yet.** The source wraps the row list in
 *    HeroUI's `ScrollShadow`; this design system has no equivalent atom, so
 *    the scrollable region here is a plain `max-h-64 overflow-y-auto` div —
 *    flagged as a gap per §B3 rather than faking the fade effect by hand.
 * 4. **Credit-delta chip tone is ported VERBATIM**, sign included:
 *    `credits > 0 → "warning"`, otherwise `→ "success"`. This reads oddly for
 *    a "cost" metric at a glance, but re-deriving the sign convention is a
 *    business-logic call outside this port's scope — kept exactly as the
 *    source branches so behaviour does not silently drift.
 *
 * LEAVES:
 *   - `Chart` — the recharts `BarChart`, ALWAYS rendered from `chartPoints`
 *     (defaults to `[]`) regardless of `isLoading`/emptiness — the source
 *     never skeletons or empties it, so neither does this port.
 *   - `ChargesList` — the ONE `AsyncContent`-switched region: a 3-row
 *     `SurfaceCardList` mirror while `isLoading`, otherwise the real bordered,
 *     scrollable row list — which itself falls to an empty message when
 *     `items` is `[]`. Per canon `2-leaf-states.md` §0 R0 (see the story's
 *     own header): `isLoading` is the caller-set switch ⇒ its own leaf;
 *     `items.length === 0` is DATA returning empty ⇒ a STATE inside the
 *     "loaded" leaf, not a leaf of its own.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** What an AI charge was for — the block owns the display label per surface. */
export type AiQuotaHistorySurface = "grade" | "interview" | "chatbot"

/** {@link AiQuotaHistorySurface} → its display label. The block's own vocabulary (§14d.1). */
const PURPOSE_LABEL: Record<AiQuotaHistorySurface, string> = {
    grade: "Challenge grading",
    interview: "Interview grading",
    chatbot: "AI chat",
}

/** Fallback row title when a charge carries no specific model name. */
const AUTO_MODEL_LABEL = "Automatic model (free)"

/** Unit suffix on every credit-delta chip. */
const CREDITS_UNIT = "credit"

/** One day-bucket plotted on the usage chart. */
export interface AiQuotaHistoryChartPoint {
    /** X-axis label, already formatted (e.g. `"12/07"`). */
    day: string
    /** Credits consumed that day. */
    credits: number
}

/** One row of the recent-charges list. */
export interface AiQuotaHistoryChargeItem {
    /** Stable React key. */
    key: string
    /** Model name, when the charge names one specifically. Falls back to {@link AUTO_MODEL_LABEL}. */
    model?: string
    /** What the charge was for — drives the block-owned {@link PURPOSE_LABEL}. */
    surface: AiQuotaHistorySurface
    /** When the charge happened — the block formats this itself (`HH:mm DD/MM`). */
    occurredAt: string | number | Date
    /** Credit delta for this charge. Sign drives the trailing chip's tone (see judgement call 4). */
    credits: number
}

/** Props for {@link AiQuotaHistoryPanel}. */
export interface AiQuotaHistoryPanelProps {
    /** The 7 day-buckets for the chart. Defaults to an empty plot when omitted. */
    chartPoints?: Array<AiQuotaHistoryChartPoint>
    /** Recent charges, most recent first. `undefined` while the first load is still running. */
    items?: Array<AiQuotaHistoryChargeItem>
    /** `true` while the charges list's first load is running (drives ONLY the `ChargesList` leaf). */
    isLoading: boolean
    /** Extra classes on the root. */
    className?: string
    /** Dev/spec: tag this block's own directly-composed parts (`StackV`/`Typography`/`SurfaceCard`/`SurfaceCardList`/`Chip`) for a BlockAnatomy panel. */
}

/** How many placeholder rows the loading mirror shows — matches the source's 3-row skeleton. */
const SKELETON_ROW_COUNT = 3

/** Chip tone for a credit delta — see judgement call 4 in the file header: ported verbatim. */
const deltaTone = (credits: number): ChipTone => (credits > 0 ? "warning" : "success")

const toListItem = (item: AiQuotaHistoryChargeItem): SurfaceCardListItem => ({
    key: item.key,
    title: item.model ?? AUTO_MODEL_LABEL,
    subtitle: `${PURPOSE_LABEL[item.surface]} · ${dayjs(item.occurredAt).format("HH:mm DD/MM")}`,
    meta: () => <Chip tone={deltaTone(item.credits)} text={`${item.credits} ${CREDITS_UNIT}`} />,
})

/** Placeholder rows for the loading mirror — same row shape, shimmer chip in the meta slot. */
const skeletonItems = (): Array<SurfaceCardListItem> => Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
    key: `skeleton-${index}`,
    title: "Model",
    subtitle: "Purpose · Time",
    meta: () => <Chip isSkeleton />,
}))

/**
 * History tab body of `AiQuotaModal` — usage chart + recent-charges list.
 *
 * @param props - {@link AiQuotaHistoryPanelProps}
 */
export const AiQuotaHistoryPanel = ({
    chartPoints = [],
    items,
    isLoading,
    className,
}: AiQuotaHistoryPanelProps) => {
    const isEmpty = !isLoading && (items?.length ?? 0) === 0

    const chart = (
        <StackV gap={4} body={
            <>
                <Typography size="sm" weight="medium" text="Credits used per day (last 7 days)" />
                <SurfaceCard
                    variant="nested"
                    padding={4}

                    body={() => (
                        <div className="h-44 w-full text-accent-soft-foreground">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartPoints} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="currentColor"
                                        className="text-divider"
                                        vertical={false}
                                    />
                                    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={0} tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                                    <Tooltip
                                        cursor={{ fill: "currentColor", opacity: 0.08 }}
                                        formatter={(value) => [`${value} ${CREDITS_UNIT}`, ""]}
                                    />
                                    <Bar dataKey="credits" fill="currentColor" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                />
            </>
        } />
    )

    const chargesList = (
        <StackV gap={4} body={
            <>
                <Typography size="sm" weight="medium" text="AI usage history" />
                <div className="max-h-64 overflow-y-auto">
                    <AsyncContent
                        isLoading={isLoading}
                        skeleton={<SurfaceCardList variant="nested" items={skeletonItems()} isSkeleton />}
                        isEmpty={isEmpty}
                        emptyContent={{
                            title: "No AI usage yet.",

                        }}
                        content={<SurfaceCardList variant="nested" items={(items ?? []).map((item) => toListItem(item))} />}

                    />
                </div>
            </>
        } />
    )

    return (
        <div>
            <StackV gap={6} className={className} body={<>{chart}{chargesList}</>} />
        </div>
    )
}
