import React, { useEffect, useMemo, useState } from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Pagination } from "@/components/atoms/navigation/Pagination"
import { StackH, StackV } from "@/components/frames/Stack"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { ModelByline } from "@/components/blocks/grading/GradingByline"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

/** Attempts per page inside the history drawer. */
const HISTORY_PAGE_SIZE = 6

/** One history row, already resolved by the connected `SubmissionResultHistoryDrawer` — no raw entity. */
export interface SubmissionResultHistoryRow {
    id: string
    attemptNumber: number
    score: number | null
    servedModel: string | null
    category?: AiModelCategory
    /** `t("submissionAttempts.attemptLine", { number })`, already interpolated. */
    attemptLineLabel: string
    /** Relative time (`getTimeAgoLabel`), already localized — `null` when the attempt has no `processedAt`. */
    timeLabel: string | null
}

/** All display text, already localized by the connected `SubmissionResultHistoryDrawer`; a story passes i18n keys. */
export interface SubmissionResultHistoryDrawerLabels {
    /** Bare drawer title (`t("submissionResult.history")`) — the row count is appended alongside it. */
    historyLabel: string
    passed: string
    failed: string
}

/** Props for {@link _SubmissionResultHistoryDrawer} — presentational; all data resolved, no fetch/store/i18n. */
export type SubmissionResultHistoryDrawerProps = {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open/close callback (also closes when a row is selected). */
    onOpenChange: (open: boolean) => void
    /** Full attempt list (newest first), already resolved to display rows. */
    rows: Array<SubmissionResultHistoryRow>
    /** Currently selected attempt (highlighted row). */
    selectedAttemptId?: string
    /** Requirement max score (for the `x/max` label + verdict threshold). */
    maxScore: number
    /** Pass threshold ratio (verdict per row). */
    passThreshold: number
    /** Select an attempt (the page navigates `?attempt=`). */
    onSelect: (attemptId: string) => void
    labels: SubmissionResultHistoryDrawerLabels
}

/**
 * One row's verdict + score text — guards an unknown threshold (treated as NOT passing).
 */
const isRowPassing = (score: number | null, maxScore: number, passThreshold: number) =>
    passThreshold > 0 && maxScore > 0 && (score ?? 0) >= passThreshold * maxScore

/** `x/max` when a max is known, the bare score otherwise. */
const rowScoreLabel = (score: number | null, maxScore: number) =>
    maxScore > 0 ? `${score ?? 0}/${maxScore}` : `${score ?? 0}`

/**
 * One history row's free-form content: attempt line + verdict chip on line one (score
 * pushed to the far edge via the track's own `justify="between"`), the grading-model
 * byline + relative time on line two. Reuses {@link ModelByline} — the SAME connected
 * block the graded-result card uses — instead of re-deriving the model/tier byline
 * locally, so the category label stays localized and in sync with every other reader
 * of it.
 */
const historyRowContent = (
    row: SubmissionResultHistoryRow,
    isPassing: boolean,
    scoreText: string,
    labels: SubmissionResultHistoryDrawerLabels,
) => {
    const timeLabel = row.timeLabel
    return (
        <StackV
            gap={2}
            items={[
                () => (
                    <StackH
                        gap={3}
                        principles={["sibling-stack"]}
                        align="center"
                        justify="between"
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principles={["chip-row"]}
                                    align="center"
                                    items={[
                                        () => <Typography size="sm" weight="medium" text={row.attemptLineLabel} />,
                                        () => <Chip tone={isPassing ? "success" : "danger"} text={isPassing ? labels.passed : labels.failed} />,
                                    ]}
                                />
                            ),
                            () => <Typography size="sm" color={isPassing ? "success-soft" : "muted"} text={scoreText} />,
                        ]}
                    />
                ),
                ...(row.servedModel != null || timeLabel != null ? [() => (
                    <StackH
                        gap={3}
                        principles={["chip-row"]}
                        align="center"
                        at="sm"
                        justify="between"
                        items={[
                            () => <ModelByline model={row.servedModel} category={row.category} />,
                            ...(timeLabel != null ? [() => <Typography size="xs" color="muted" text={timeLabel} />] : []),
                        ]}
                    />
                )] : []),
            ]}
        />
    )
}

/**
 * Submission-history drawer — the presentational half of {@link SubmissionResultHistoryDrawer}: each
 * attempt as a free-form `SurfaceCardList` row (verdict, score, the AI model that graded it + tier,
 * time), paginated client-side. Right on desktop, bottom sheet on mobile. Composes `DrawerShell`
 * (the shared drawer scaffold) — the selected row's highlight is `SurfaceCardListItem`'s own
 * `tone="accent"` left-edge band, not a hand-rolled tint. See `tiers/split.md` — the connected
 * `index.tsx` owns i18n.
 *
 * @param props - {@link SubmissionResultHistoryDrawerProps}
 */
export const _SubmissionResultHistoryDrawer = ({
    isOpen,
    onOpenChange,
    rows,
    selectedAttemptId,
    maxScore,
    passThreshold,
    onSelect,
    labels,
}: SubmissionResultHistoryDrawerProps) => {
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

    // `tone="accent"` reads as a left accent band — the existing DATA-signal
    // vocabulary every card frame already shares — instead of a hand-rolled
    // tint wrapper around the row's own content.
    const items: Array<SurfaceCardListItem> = pagedRows.map((row) => ({
        key: row.id,
        content: () => historyRowContent(row, isRowPassing(row.score, maxScore, passThreshold), rowScoreLabel(row.score, maxScore), labels),
        tone: row.id === selectedAttemptId ? "accent" : undefined,
        onPress: () => {
            onSelect(row.id)
            onOpenChange(false)
        },
    }))

    const listAndPager = [
        () => <SurfaceCardList items={items} />,
        // `Pagination` hard-codes its own internal `aria-label` (atom, §4) — the
        // wrapping `<nav>` is how this drawer's own accessible name still gets
        // attached, same convention `SubmissionAttemptsDrawer` (drawersv2) uses.
        ...(totalPages > 1 ? [() => (
            <nav aria-label={labels.historyLabel}>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </nav>
        )] : []),
    ]

    return (
        <div data-tier="overlay" data-component="SubmissionResultHistoryDrawer">
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={isMobile ? "bottom" : "right"}
                title={`${labels.historyLabel} · ${rows.length}`}
                body={() => <StackV gap={4} items={listAndPager} />}
            />
        </div>
    )
}
