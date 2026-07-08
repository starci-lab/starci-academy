"use client"

import React, { useEffect, useState } from "react"
import { Button, Chip, cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useQueryMyMockInterviewAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewAttemptsSwr"
import { MockInterviewAttemptDrawer } from "@/components/drawers/MockInterviewAttemptDrawer"
import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MockInterviewHistory}. */
export interface MockInterviewHistoryProps extends WithClassNames<undefined> {
    /** Course whose mock-interview history to list. */
    courseId: string
    /** Course display id, for the drawer's scorecard "study this" deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action). */
    onStartInterview?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** The mode filter's fixed option order — "all" (no server-side filter) first, then the 2 top-level modes. */
type HistoryModeFilter = "all" | "qna" | "design"

/** Verdict → chip color (đạt / cận / chưa đạt) — mirrors {@link MockInterviewScorecard}'s convention. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/**
 * The viewer's past mock-interview sessions for this course, newest first —
 * the setup screen's "Lịch sử" tab. Offset-paginated (`LabeledCard`'s
 * `onSeeMore` label-row link, server-side `mode` filter so a filtered page
 * never comes up short against an un-filtered total), each row opens the
 * read-only scorecard drawer. Renders even when empty (labeled section on a
 * tab the learner opened — never self-hides).
 * @param props - {@link MockInterviewHistoryProps}
 */
export const MockInterviewHistory = ({ courseId, courseDisplayId, onStartInterview, className }: MockInterviewHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const [selectedAttempt, setSelectedAttempt] = useState<MockInterviewAttemptItem | null>(null)
    const [modeFilter, setModeFilter] = useState<HistoryModeFilter>("all")

    const [offset, setOffset] = useState(0)
    const [items, setItems] = useState<Array<MockInterviewAttemptItem>>([])
    const [totalCount, setTotalCount] = useState(0)

    const attemptsSwr = useQueryMyMockInterviewAttemptsSwr(
        courseId,
        PAGE_SIZE,
        offset,
        modeFilter === "all" ? undefined : modeFilter,
    )

    // accumulate pages as `offset` advances ("load more"); a fresh
    // course/filter resets the accumulator (guarded by the effect below).
    useEffect(() => {
        const data = attemptsSwr.data
        if (!data) {
            return
        }
        setItems((previous) => (offset === 0 ? data.items : [...previous, ...data.items]))
        setTotalCount(data.totalCount)
         
    }, [attemptsSwr.data, offset])

    // course/filter changed → start the accumulator over
    useEffect(() => {
        setOffset(0)
        setItems([])
    }, [courseId, modeFilter])

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

    const hasMore = items.length < totalCount
    // frameless ONLY once real rows self-frame as a SurfaceListCard (avoids
    // card-in-card there); while loading/empty/erroring there is no bounded
    // surface of its own, so LabeledCard's own Card must frame it — otherwise
    // the empty/error/skeleton state renders bare on the page background,
    // mismatching the framed sibling section above it.
    const hasRows = !attemptsSwr.isLoading && !attemptsSwr.error && items.length > 0

    return (
        <div className="flex flex-col gap-6">
            {/* NESTED under the outer "Bắt đầu/Lịch sử/Thống kê" TabsCard (variant="primary"
                there) — a SECOND primary-weight tab bar here would render at the same visual
                weight and read as 2 stacked tab rows. `variant="secondary"` + `className="w-full"`
                gives the lighter, full-width underline treatment for an in-page content filter
                nested inside an already-selected top-level tab (mirrors Flashcard Quiz's own
                nested TabsCard, fe/components/tabs.md §0). */}
            <TabsCard
                variant="secondary"
                className="w-full"
                leftTabs={{
                    items: [
                        { key: "all", label: t("mockInterview.historyFilterAll") },
                        { key: "qna", label: t("mockInterview.historyFilterQna") },
                        { key: "design", label: t("mockInterview.historyFilterDesign") },
                    ],
                    selectedKey: modeFilter,
                    ariaLabel: t("mockInterview.historyFilterAll"),
                    onSelectionChange: (key) => setModeFilter(key as HistoryModeFilter),
                }}
            />

            {/* onSeeMore only claims the label row's right slot once there are more
                attempts than the current page — never a dead "Xem thêm" past the end. */}
            <LabeledCard
                frameless={hasRows}
                label={t("mockInterview.historyTitle")}
                onSeeMore={hasMore ? () => setOffset((previous) => previous + PAGE_SIZE) : undefined}
                seeMoreLabel={t("mockInterview.historyLoadMore")}
                className={cn(className)}
            >
                <AsyncContent
                    isLoading={attemptsSwr.isLoading && items.length === 0}
                    skeleton={(
                        <div className="flex flex-col gap-3">
                            <SkeletonListRow withTrailing />
                            <SkeletonListRow withTrailing />
                            <SkeletonListRow withTrailing />
                        </div>
                    )}
                    error={items.length === 0 ? attemptsSwr.error : undefined}
                    errorContent={{
                        title: t("mockInterview.historyError"),
                        onRetry: () => void attemptsSwr.mutate(),
                        retryLabel: t("mockInterview.promptsRetry"),
                    }}
                >
                    {!attemptsSwr.isLoading && items.length === 0 ? (
                        <EmptyState
                            title={modeFilter === "all" ? t("mockInterview.historyEmpty") : t("mockInterview.historyEmptyFiltered")}
                            action={onStartInterview ? (
                                <Button size="sm" variant="secondary" onPress={onStartInterview}>
                                    {t("mockInterview.begin")}
                                </Button>
                            ) : undefined}
                        />
                    ) : (
                        <SurfaceListCard>
                            {items.map((attempt) => (
                                <SurfaceListCardRow
                                    key={attempt.id}
                                    title={attempt.promptTitle}
                                    subtitle={formatDate(attempt.createdAt)}
                                    meta={(
                                        <Chip size="sm" variant="soft" color={verdictColorOf(attempt.verdict)}>
                                            <Chip.Label>{attempt.overallScore}</Chip.Label>
                                        </Chip>
                                    )}
                                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                                    onPress={() => setSelectedAttempt(attempt)}
                                />
                            ))}
                        </SurfaceListCard>
                    )}
                </AsyncContent>
            </LabeledCard>

            <MockInterviewAttemptDrawer
                isOpen={selectedAttempt !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedAttempt(null)
                    }
                }}
                attempt={selectedAttempt}
                courseId={courseId}
                courseDisplayId={courseDisplayId}
            />
        </div>
    )
}
