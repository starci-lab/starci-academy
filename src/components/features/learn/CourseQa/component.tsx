import React from "react"
import type { Key } from "react"
import { ArrowRightIcon, ChatsCircleIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Pagination } from "@/components/atoms/navigation/Pagination"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { TabsCard, type TabsCardItem } from "@/components/blocks/navigation/TabsCard"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { CommentComposer } from "@/components/features/community/Discussion/CommentComposer"
import { LearnBreadcrumb } from "@/components/features/learn/shared/LearnBreadcrumb"
import { Container } from "@/components/frames/Container"
import { StackV, StackH } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { QuestionRow } from "./QuestionRow"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"

/** How many placeholder rows the co-located skeleton shows while the first page loads. */
const SKELETON_QUESTION_COUNT = 4

/** All display text, already localized by the connected `CourseQa`; a story passes i18n keys. */
export interface CourseQaLabels {
    breadcrumbCurrent: string
    title: string
    description: string
    /** Zero-ever-questions invitation card (no filter/search applied). */
    emptyInvitationTitle: string
    emptyInvitationHint: string
    emptyInvitationCta: string
    /** Omitted when the enrollment count isn't known yet. */
    enrollmentLine?: string
    /** "N asked · M answered" — the connected file interpolates the totals. */
    answeredLine: string
    filterAriaLabel: string
    searchPlaceholder: string
    /** Result count — the connected file interpolates the total. */
    countLabel: string
    composerPlaceholder: string
    composerSubmitLabel: string
    /** Settled-empty-under-a-filter/search message (distinct from the invitation card). */
    searchEmptyTitle: string
    errorTitle: string
    retryLabel: string
    paginationAriaLabel: string
}

/** Props for {@link _CourseQa} — presentational; all data resolved, no fetch/store/i18n. */
export interface CourseQaProps {
    /** First load of the question list, nothing in hand → the list region shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero matching questions (under a filter/search) → the search-empty message. */
    isEmpty?: boolean
    /** Truthy → the list-load error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry the question-list fetch. */
    onRetry: () => void

    /** `true` → the course has zero questions EVER (no filter/search applied) — the invitation card replaces the whole toolbar+list region. */
    isInvitationEmpty: boolean
    /** Fired by the invitation card's CTA — routes into the course content. */
    onGoToContent: () => void

    /** Filter pills, already localized. */
    filterTabs: Array<TabsCardItem>
    /** Active filter key (URL-synced by the connected file). */
    selectedFilterKey: string
    onSelectFilter: (key: Key) => void

    /** Raw (undebounced) search box value. */
    searchValue: string
    onSearchChange: (value: string) => void

    /** Current viewer id (drives own-question/own-bubble handling downstream); `null` when signed out. */
    currentUserId: string | null
    /** Current viewer identity for the composer avatar and answer bubbles; `null` when signed out. */
    currentUser: { username: string, avatar?: string } | null
    /** `true` while the course-general question composer's mutation is in flight. */
    isPostingQuestion: boolean
    onSubmitQuestion: (body: string) => void

    /** The current page's questions, in display order. */
    questions: Array<CourseQuestionNode>
    /** Fired after an answer is posted/edited/deleted, or the composer posts — bumps the parent's aggregates. */
    onAnswered: () => void

    /** 1-based current page. */
    page: number
    totalPages: number
    onPageChange: (page: number) => void

    labels: CourseQaLabels
}

/**
 * Co-located mirror of {@link QuestionRow}'s collapsed ({@link
 * import("./QaInboxRow").QaInboxRow}) shape — avatar · asker+time line · two-line
 * preview · scope+status chip row · status dot. `QuestionRow` itself takes no
 * `isSkeleton` (see `missingSkeletonSupport`), so this stands in only while
 * `isSkeleton` is true, in the SAME position the real row renders in once the
 * first page resolves.
 */
const QuestionRowSkeleton = () => (
    <StackH gap={4} align="start" padding={4} items={[
        () => <Avatar isSkeleton size="sm" />,
        () => (
            <StackV gap={3} classNames={["min-w-0", "flex-1"]} items={[
                () => <Typography size="xs" isSkeleton classNames={["w-1/3"]} />,
                () => (
                    <StackV gap={3} items={[
                        () => <Typography size="sm" isSkeleton classNames={["w-full"]} />,
                        () => <Typography size="sm" isSkeleton classNames={["w-2/3"]} />,
                    ]} />
                ),
                () => (
                    <StackH gap={3} align="center" items={[
                        () => <Chip isSkeleton />,
                        () => <Chip isSkeleton />,
                    ]} />
                ),
            ]} />
        ),
        // status dot — no home atom for a bare colour dot; same escape hatch the
        // `Pagination` atom uses for its own shimmer squares.
        () => <Skeleton className="size-2 shrink-0 rounded-full" />,
    ]} />
)

/**
 * Course-wide Q&A roll-up (S2 of `CourseCommunity/LAYOUT-BRAINSTORM.md`) — the
 * presentational half of {@link CourseQa}. Vertical layout inside the learn
 * shell's centered reading column:
 *
 *   PageHeader → [invitation card | honest strip → composer → toolbar (filter
 *   tabs + search + count) → list → pager]
 *
 * The invitation card (zero questions ever, no filter/search) is a distinct
 * product state, not an async one — it replaces the whole toolbar+list region
 * unconditionally once settled. The list+pager region carries the actual async
 * lifecycle: `error` falls to the shared `AsyncContentError` frame, settled-empty
 * (under a filter/search) to `AsyncContentEmpty`, and otherwise the row list
 * renders with the SAME row component/count shape while `isSkeleton` is true
 * (loading-and-skeleton.md). See `tiers/split.md` — the connected `index.tsx`
 * owns the fetch, the URL-synced filter, and i18n.
 *
 * @param props - {@link CourseQaProps}
 */
const _CourseQa = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    isInvitationEmpty,
    onGoToContent,
    filterTabs,
    selectedFilterKey,
    onSelectFilter,
    searchValue,
    onSearchChange,
    currentUserId,
    currentUser,
    isPostingQuestion,
    onSubmitQuestion,
    questions,
    onAnswered,
    page,
    totalPages,
    onPageChange,
    labels,
}: CourseQaProps) => {
    const listZone = () => {
        // error beats a stale loading flag; empty only once settled (BLOCK-8 order).
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retryLabel} />
        }
        if (!isSkeleton && isEmpty) {
            return <AsyncContentEmpty title={labels.searchEmptyTitle} />
        }

        // ROWS — while shimmering, placeholder rows keep the SAME row component and
        // count shape as the real content (loading-and-skeleton.md §1).
        const rows = isSkeleton
            ? Array.from({ length: SKELETON_QUESTION_COUNT }, (_unused, index) => <QuestionRowSkeleton key={`skeleton-${index}`} />)
            : questions.map((question) => (
                <QuestionRow
                    key={question.id}
                    question={question}
                    currentUserId={currentUserId}
                    currentUser={currentUser}
                    onAnswered={onAnswered}
                />
            ))

        const listItems: Array<ComponentTypeWithSkeleton> = [
            () => <SurfaceListCard className="divide-y divide-default">{rows}</SurfaceListCard>,
            ...(!isSkeleton && totalPages > 1 ? [() => (
                <nav aria-label={labels.paginationAriaLabel}>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
                </nav>
            )] : []),
        ]

        return <StackV gap={6} items={listItems} />
    }

    const mainBody = () => {
        const enrollmentLine = labels.enrollmentLine
        const stripItems: Array<ComponentTypeWithSkeleton> = [
            ...(enrollmentLine ? [() => <Typography size="sm" color="muted" text={enrollmentLine} />] : []),
            () => <Typography size="sm" color="muted" text={labels.answeredLine} />,
        ]

        return (
            <StackV gap={6} items={[
                () => <StackV gap={2} items={stripItems} />,
                () => (
                    <CommentComposer
                        collapsible
                        currentUser={currentUser}
                        placeholder={labels.composerPlaceholder}
                        submitLabel={labels.composerSubmitLabel}
                        busy={isPostingQuestion}
                        onSubmit={onSubmitQuestion}
                    />
                ),
                () => (
                    <StackV gap={4} items={[
                        () => (
                            <TabsCard
                                leftTabs={{
                                    items: filterTabs,
                                    selectedKey: selectedFilterKey,
                                    ariaLabel: labels.filterAriaLabel,
                                    onSelectionChange: onSelectFilter,
                                }}
                            />
                        ),
                        () => (
                            <StackH gap={4} align="center" justify="between" at="sm" items={[
                                () => <SearchInput value={searchValue} onValueChange={onSearchChange} placeholder={labels.searchPlaceholder} />,
                                () => <Typography size="sm" color="muted" text={labels.countLabel} classNames={["shrink-0"]} />,
                            ]} />
                        ),
                    ]} />
                ),
                () => listZone(),
            ]} />
        )
    }

    return (
        <Container
            identity={{ tier: "block", component: "CourseQa" }}
            size="md"
            padding={1}
            body={() => (
                <StackV gap={7} items={[
                    () => (
                        <PageHeader
                            breadcrumb={<LearnBreadcrumb current={labels.breadcrumbCurrent} />}
                            title={labels.title}
                            description={labels.description}
                        />
                    ),
                    () => (isInvitationEmpty ? (
                        <AsyncContentEmpty
                            icon={ChatsCircleIcon}
                            title={labels.emptyInvitationTitle}
                            description={labels.emptyInvitationHint}
                            action={() => (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    suffixIcon={ArrowRightIcon}
                                    label={labels.emptyInvitationCta}
                                    onPress={onGoToContent}
                                />
                            )}
                        />
                    ) : mainBody()),
                ]} />
            )}
        />
    )
}

export { _CourseQa }
