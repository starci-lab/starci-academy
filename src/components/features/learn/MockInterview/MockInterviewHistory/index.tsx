"use client"

import React, { useState } from "react"
import { Chip, cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
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
}

/** Attempts to show on the setup screen initially, and how many more "Xem thêm" reveals per click. */
const HISTORY_PAGE_SIZE = 10

/** Verdict → chip color (đạt / cận / chưa đạt) — mirrors {@link MockInterviewScorecard}'s convention. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/**
 * The viewer's past mock-interview sessions for this course, newest first —
 * shown on the setup screen so a learner can re-open and review a previous
 * scorecard instead of it vanishing once graded. Renders even when empty
 * (labeled section on a page the learner opened — never self-hides).
 * @param props - {@link MockInterviewHistoryProps}
 */
export const MockInterviewHistory = ({ courseId, courseDisplayId, className }: MockInterviewHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // "Xem thêm" grows the page size client-side (offset stays 0) rather than opening a
    // separate route/drawer — simplest overflow affordance for a list the learner is
    // unlikely to page through more than once or twice.
    const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE)
    const attemptsSwr = useQueryMyMockInterviewAttemptsSwr(courseId, visibleCount, 0)
    const items = attemptsSwr.data?.items ?? []
    const totalCount = attemptsSwr.data?.totalCount ?? items.length
    const hasMore = items.length < totalCount
    const [selectedAttempt, setSelectedAttempt] = useState<MockInterviewAttemptItem | null>(null)

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

    // frameless ONLY once real rows self-frame as a SurfaceListCard (avoids
    // card-in-card there); while loading/empty/erroring there is no bounded
    // surface of its own, so LabeledCard's own Card must frame it — otherwise
    // the empty/error/skeleton state renders bare on the page background,
    // mismatching the framed sibling section above it.
    const hasRows = !attemptsSwr.isLoading && !attemptsSwr.error && items.length > 0

    return (
        <>
            {/* onSeeMore only claims the label row's right slot once there are more
                attempts than the current page — never a dead "Xem thêm" past the end. */}
            <LabeledCard
                frameless={hasRows}
                label={t("mockInterview.historyTitle")}
                onSeeMore={hasMore ? () => setVisibleCount((count) => count + HISTORY_PAGE_SIZE) : undefined}
                seeMoreLabel={t("mockInterview.historySeeMore")}
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
                    isEmpty={!attemptsSwr.isLoading && items.length === 0}
                    emptyContent={{ title: t("mockInterview.historyEmpty") }}
                    error={items.length === 0 ? attemptsSwr.error : undefined}
                    errorContent={{
                        title: t("mockInterview.historyError"),
                        onRetry: () => void attemptsSwr.mutate(),
                        retryLabel: t("mockInterview.promptsRetry"),
                    }}
                >
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
        </>
    )
}
