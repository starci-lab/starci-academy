import React, { useEffect, useMemo, useState } from "react"
import { cn, Chip, Drawer, Pagination, ScrollShadow, Typography } from "@heroui/react"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
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
    previous: string
    next: string
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
 * Submission-history drawer — the presentational half of {@link SubmissionResultHistoryDrawer}: each
 * attempt as a bordered surface-card row (verdict, score, the AI model that graded it + tier, time),
 * paginated client-side. Right on desktop, bottom sheet on mobile. See `tiers/split.md` — the connected
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

    // verdict + score for a row, guarding an unknown threshold (treat as NOT passing)
    const isPassing = (score: number | null) =>
        passThreshold > 0 && maxScore > 0 && (score ?? 0) >= passThreshold * maxScore
    const scoreLabel = (score: number | null) => (maxScore > 0 ? `${score ?? 0}/${maxScore}` : `${score ?? 0}`)

    return (
        <Drawer data-tier="overlay" data-component="SubmissionResultHistoryDrawer">
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} className="backdrop-blur-sm">
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0">
                        <div className="p-4">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {`${labels.historyLabel} · ${rows.length}`}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <ScrollShadow hideScrollBar className="h-full p-4">
                                <SurfaceListCard>
                                    {pagedRows.map((row) => {
                                        const selected = row.id === selectedAttemptId
                                        const rowPass = isPassing(row.score)
                                        return (
                                            <SurfaceListCardItem
                                                key={row.id}
                                                onPress={() => {
                                                    onSelect(row.id)
                                                    onOpenChange(false)
                                                }}
                                                className={selected ? "bg-accent-soft hover:bg-accent-soft" : undefined}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Typography type="body-sm" weight="medium">
                                                            {row.attemptLineLabel}
                                                        </Typography>
                                                        <Chip color={rowPass ? "success" : "danger"} variant="soft" size="sm">
                                                            <Chip.Label>
                                                                {rowPass ? labels.passed : labels.failed}
                                                            </Chip.Label>
                                                        </Chip>
                                                        <Typography
                                                            type="body-sm"
                                                            className={cn("ml-auto", rowPass ? "text-success-soft-foreground" : "text-muted")}
                                                        >
                                                            {scoreLabel(row.score)}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <ModelByline model={row.servedModel} category={row.category} />
                                                        {row.timeLabel ? (
                                                            <Typography type="body-xs" color="muted" className="ml-auto">
                                                                {row.timeLabel}
                                                            </Typography>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </SurfaceListCardItem>
                                        )
                                    })}
                                </SurfaceListCard>
                            </ScrollShadow>
                        </Drawer.Body>
                        {totalPages > 1 ? (
                            <Drawer.Footer className="border-t p-4">
                                <Pagination aria-label={labels.historyLabel} size="sm" className="w-full justify-start">
                                    <Pagination.Content className="flex flex-wrap justify-start gap-2">
                                        <Pagination.Item>
                                            <Pagination.Previous
                                                aria-label={labels.previous}
                                                isDisabled={page <= 1}
                                                onPress={() => setPage((current) => Math.max(1, current - 1))}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                            >
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                            <Pagination.Item key={pageNumber}>
                                                <Pagination.Link
                                                    isActive={pageNumber === page}
                                                    onPress={() => setPage(pageNumber)}
                                                    className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                                >
                                                    {pageNumber}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Item>
                                            <Pagination.Next
                                                aria-label={labels.next}
                                                isDisabled={page >= totalPages}
                                                onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                            >
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            </Drawer.Footer>
                        ) : null}
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
