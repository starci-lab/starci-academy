import React, { useEffect, useMemo, useState } from "react"
import { SparkleIcon } from "@phosphor-icons/react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { EnumChip, type EnumChipEntry } from "@/components/composites/chips/EnumChip"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { Pagination } from "@/components/atoms/navigation/Pagination"
import { StackH, StackV } from "@/components/frames/Stack"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

/** Attempts per page inside the history drawer. */
const HISTORY_PAGE_SIZE = 6

/** Accessible name for the pager `<nav>` — `Pagination` already owns its own internal `aria-label`. */
const PAGER_ARIA_LABEL = "Task attempt history pagination"

/** One history row, already resolved by the connected `PersonalProjectTaskResultHistoryDrawer` — no raw entity. */
export interface PersonalProjectTaskResultHistoryRow {
    id: string
    /** Drives the verdict chip tone (comes straight off `attempt.passed`, no threshold math). */
    passed: boolean
    score: number | null
    servedModel: string | null
    category?: AiModelCategory
    /** `t("submissionAttempts.attemptLine", { number })`, already interpolated. */
    attemptLineLabel: string
    /** Relative time (`getTimeAgoLabel`), already localized — `null` when the attempt has no `processedAt`. */
    timeLabel: string | null
}

/** All display text, already localized by the connected `PersonalProjectTaskResultHistoryDrawer`; a story passes i18n keys. */
export interface PersonalProjectTaskResultHistoryDrawerLabels {
    /** Bare drawer title (`t("personalProjectResult.history")`) — the row count is appended alongside it. */
    historyLabel: string
    passed: string
    failed: string
    /** Empty-state title (no attempts yet). */
    emptyTitle: string
    /** Empty-state secondary line. Optional. */
    emptyDescription?: string
}

/** Props for {@link _PersonalProjectTaskResultHistoryDrawer} — presentational; all data resolved, no fetch/store/i18n. */
export type PersonalProjectTaskResultHistoryDrawerProps = {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open/close callback (also closes when a row is selected). */
    onOpenChange: (open: boolean) => void
    /** Full attempt list (newest first), already resolved to display rows. */
    rows: Array<PersonalProjectTaskResultHistoryRow>
    /** Currently selected attempt (highlighted row). */
    selectedAttemptId?: string
    /** Task max score (for the `x/max` label); 0 → show bare score. */
    maxScore: number
    /** Select an attempt (the page navigates `?attempt=`). */
    onSelect: (attemptId: string) => void
    labels: PersonalProjectTaskResultHistoryDrawerLabels
    /** AI-model tier → chip presentation, already localized — the model-byline recipe (`EnumChip`). */
    categoryMap: Partial<Record<AiModelCategory, EnumChipEntry>>
}

/** `x/max` when `maxScore` is set, otherwise the bare score. `null` reads as `0`. */
const scoreLabel = (score: number | null, maxScore: number) => (maxScore > 0 ? `${score ?? 0}/${maxScore}` : `${score ?? 0}`)

/**
 * One row's free-form content: attempt line + verdict chip + score on the first line
 * (score pushed to the far edge), an optional model byline (sparkle + model name +
 * tier chip) + time-ago on the second. Mirrors the sibling `SubmissionAttemptsDrawer`
 * row recipe — the model byline is composed here from `InlineIconLabel` + `EnumChip`
 * instead of the `ModelByline` block, since this tier may only import composites/frames.
 */
const attemptRowContent = (
    row: PersonalProjectTaskResultHistoryRow,
    isSelected: boolean,
    maxScore: number,
    labels: PersonalProjectTaskResultHistoryDrawerLabels,
    categoryMap: Partial<Record<AiModelCategory, EnumChipEntry>>,
) => {
    const servedModel = row.servedModel
    const category = row.category
    const timeLabel = row.timeLabel

    const attemptLabelAndChip = [
        () => <Typography size="sm" weight="medium" text={row.attemptLineLabel} />,
        () => <Chip tone={row.passed ? "success" : "danger"} text={row.passed ? labels.passed : labels.failed} />,
    ]

    const attemptLine = [
        () => <StackH gap={2} principle="chip-row" align="center" items={attemptLabelAndChip} />,
        () => (
            <Typography
                size="sm"
                color={row.passed ? "success-soft" : "muted"}
                text={scoreLabel(row.score, maxScore)}
            />
        ),
    ]

    const bylineParts = [
        ...(servedModel != null ? [() => (
            <InlineIconLabel icon={SparkleIcon} tone="default" size="xs" label={servedModel} />
        )] : []),
        ...(servedModel != null && category != null ? [() => (
            <EnumChip value={category} map={categoryMap} />
        )] : []),
    ]

    const rowContent = [
        () => <StackH gap={3} principle="sibling-stack" align="center" justify="between" items={attemptLine} />,
        ...(bylineParts.length > 0 || timeLabel != null ? [() => (
            <StackH
                gap={3}
                principle="sibling-stack"
                align="center"
                justify="between"
                items={[
                    ...(bylineParts.length > 0 ? [() => <StackH gap={3} principle="sibling-stack" align="center" items={bylineParts} />] : []),
                    ...(timeLabel != null ? [() => <Typography size="xs" color="muted" text={timeLabel} />] : []),
                ]}
            />
        )] : []),
    ]

    // highlight-exception (mirrors `SubmissionAttemptsDrawer`): the selected row's tint is
    // baked into the row's own content wrapper — a plain, un-tightened `<div>` — since
    // `SurfaceCardListItem` no longer takes a raw `className` of its own.
    return (
        <div className={isSelected ? "bg-accent-soft" : undefined}>
            <StackV gap={2} items={rowContent} />
        </div>
    )
}

/**
 * Personal-project task submission-history drawer — the presentational half of
 * {@link PersonalProjectTaskResultHistoryDrawer}: each attempt as a free-form
 * `SurfaceCardList` row (verdict, score, the AI model that graded it + tier, time),
 * paginated client-side. Right on desktop, bottom sheet on mobile. Sibling of
 * `SubmissionResultHistoryDrawer` (challenge) — here the verdict comes straight from
 * `row.passed` (no pass-threshold computation). See `tiers/split.md` — the connected
 * `index.tsx` owns i18n.
 *
 * @param props - {@link PersonalProjectTaskResultHistoryDrawerProps}
 */
export const _PersonalProjectTaskResultHistoryDrawer = ({
    isOpen,
    onOpenChange,
    rows,
    selectedAttemptId,
    maxScore,
    onSelect,
    labels,
    categoryMap,
}: PersonalProjectTaskResultHistoryDrawerProps) => {
    const { isMobile } = useSmViewpoint()
    const [page, setPage] = useState(1)

    // reset to the first page whenever the drawer opens
    useEffect(() => {
        if (isOpen) {
            setPage(1)
        }
    }, [isOpen])

    const totalPages = Math.max(1, Math.ceil(rows.length / HISTORY_PAGE_SIZE))
    const pagedRows = useMemo(
        () => rows.slice((page - 1) * HISTORY_PAGE_SIZE, page * HISTORY_PAGE_SIZE),
        [rows, page],
    )

    const items: Array<SurfaceCardListItem> = pagedRows.map((row) => ({
        key: row.id,
        content: () => attemptRowContent(row, row.id === selectedAttemptId, maxScore, labels, categoryMap),
        onPress: () => {
            onSelect(row.id)
            onOpenChange(false)
        },
    }))

    const listAndPager = [
        () => (
            <SurfaceCardList
                items={items}
                emptyState={() => <AsyncContentEmpty title={labels.emptyTitle} description={labels.emptyDescription} />}
            />
        ),
        ...(totalPages > 1 ? [() => (
            // `Pagination` hard-codes its own internal `aria-label` — the wrapping `<nav>`
            // is how this drawer's own accessible name still gets attached, same
            // convention `SubmissionAttemptsDrawer` uses.
            <nav aria-label={PAGER_ARIA_LABEL}>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </nav>
        )] : []),
    ]

    return (
        <DrawerShell
            identity={{ tier: "overlay", component: "PersonalProjectTaskResultHistoryDrawer" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={isMobile ? "bottom" : "right"}
            title={`${labels.historyLabel} · ${rows.length}`}
            body={() => <StackV gap={4} items={listAndPager} />}
        />
    )
}
