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
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackV } from "@/components/frames/Stack"

/**
 * `AiQuotaHistoryPanel` — the "History" tab body inside `AiQuotaModal`: a 7-day
 * usage bar chart plus a scrollable, bordered list of recent AI charges.
 * `isLoading` swaps the whole `ChargesList` region for its shimmer mirror; an
 * empty `items` array renders the list's own empty state. The chart draws from
 * `chartPoints` regardless of either.
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
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: AiQuotaHistoryPanelProps) => {
    const isEmpty = !isLoading && (items?.length ?? 0) === 0

    const chart = (
        <StackV gap={4} principle="card-caption"
            explain="Holds caption text under card media so the caption stays attached to the image above it."
            items={[
                () => <Typography size="sm" weight="medium" text="Credits used per day (last 7 days)" />,
                () => (
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
                ),
            ]} />
    )

    const chargesList = (
        <StackV gap={4} items={[
            () => <Typography size="sm" weight="medium" text="AI usage history" />,
            () => (
                <div className="max-h-64 overflow-y-auto">
                    <AsyncContent
                        isLoading={isLoading}
                        skeleton={() => <SurfaceCardList variant="nested" items={skeletonItems()} isSkeleton />}
                        isEmpty={isEmpty}
                        emptyContent={{
                            title: "No AI usage yet.",

                        }}
                        content={() => <SurfaceCardList variant="nested" items={(items ?? []).map((item) => toListItem(item))} />}

                    />
                </div>
            ),
        ]} />
    )

    return (
        <StackV
            identity={{ tier: "block", component: "AiQuotaHistoryPanel" }}
            gap={6}
            classNames={classNames}
            items={[() => chart, () => chargesList]}
        />
    )
}
