import React from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { QuestionPreviewRow } from "./QuestionPreviewRow"
import { SkeletonQuestionRow } from "./SkeletonQuestionRow"
import { type CourseQaQuestionItem } from "./types"

export type {
    CourseQaQuestionAuthor,
    CourseQaQuestionScope,
    CourseQaQuestionItem,
    CourseQaCurrentUser,
    CourseQaQuestionListProps,
} from "./types"

/**
 * `CourseQaQuestionList` — the course-wide Q&A roll-up region: the async
 * lifecycle (loading → error → search-empty → content) around a flush divide-y
 * question list plus a pager. The Content leaf renders `QuestionPreviewRow`, a
 * marked collapsed-look stand-in with real data, until the real per-question
 * thread block lands. Four leaves: `Loading`, `Error`, `Empty` (filter matched
 * nothing; true zero-ever is `CourseQaInvite` a layer up), `Content`.
 */

/** How many placeholder rows mirror the list while the first page loads — matches `CourseQaSkeleton.tsx`. */
const SKELETON_ROW_COUNT = 4

const ERROR_TITLE = "Couldn't load the question list"
const RETRY_LABEL = "Retry"
const EMPTY_TITLE = "No questions match the current filter"
const EMPTY_DESCRIPTION = "Try a different filter or search term."

/** The Loading branch's rows — see *1 for why these are NOT `SurfaceCardList.isSkeleton`. */
const skeletonItems = (): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: () => <SkeletonQuestionRow />,
    }))

/** The Content branch's real rows — each a {@link QuestionPreviewRow} (*2 gap stand-in). */
const questionItems = (
    questions: ReadonlyArray<CourseQaQuestionItem>,
    currentUserId: string | null,
): Array<SurfaceCardListItem> =>
    questions.map((question) => ({
        key: question.id,
        content: () => <QuestionPreviewRow question={question} currentUserId={currentUserId} />,
    }))

/**
 * The course-wide Q&A roll-up list. See the file header for the full contract,
 * the GAP note on `QaQuestionThread` (*2), and the remaining judgement calls.
 *
 * @param props - {@link CourseQaQuestionListProps}
 */
const CourseQaQuestionList = ({
    questions,
    isLoading,
    error,
    onRetry,
    page,
    totalPages,
    onPageChange,
    currentUserId,
    currentUser,
    onAnswered,
    pagerAriaLabel,
    isSkeleton = false,
}: import("./types").CourseQaQuestionListProps) => {
    // `currentUser`/`onAnswered` are pure pass-through for the future `QaQuestionThread`
    // swap (*2/GAP) — `QuestionPreviewRow` (today's stand-in) does not consume them.
    void currentUser
    void onAnswered

    const emptyContent: AsyncContentEmptyProps = {
        icon: MagnifyingGlassIcon,
        title: EMPTY_TITLE,
        description: EMPTY_DESCRIPTION,

    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel: RETRY_LABEL,

    }

    return (
        <AsyncContent
            // *5 — an external override (`isSkeleton`) converges on the same Loading
            // branch as the list's own fetch flag (`isLoading`).
            isLoading={isSkeleton || isLoading}
            skeleton={() => (
                <SurfaceCardList
                    identity={{ tier: "block", component: "CourseQaQuestionList" }}
                    items={skeletonItems()}
                />
            )}
            isEmpty={questions.length === 0}
            emptyContent={emptyContent}
            error={error}
            errorContent={errorContent}
            content={() => (
                <StackV
                    identity={{ tier: "block", component: "CourseQaQuestionList" }}
                    principle="sibling-stack"
                    explain="Question list and pager are same-kind peers in the roll-up column — not group-boundary, because they are repeating list sections rather than nested groups."
                    items={[
                        () => (
                            <SurfaceCardList
                                items={questionItems(questions, currentUserId)}
                            />
                        ),
                        ...(totalPages > 1
                            ? [
                                // *4 — `Pagination` hard-codes its own aria-label; a wrapping
                                // <nav> is how the caller's `pagerAriaLabel` still names the region.
                                () => (
                                    <nav aria-label={pagerAriaLabel}>
                                        <Pagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={onPageChange}
                                        />
                                    </nav>
                                ),
                            ]
                            : []),
                    ]}
                />
            )}
        />
    )
}

export { CourseQaQuestionList }
