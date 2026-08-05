import React from "react"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"
import { QaQuestionThread } from "@/components/blocks/learn/QaQuestionThread"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Pagination } from "@/components/atoms/navigation/Pagination"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { StackV, StackH } from "@/components/frames/Stack"

/**
 * `CourseQaQuestionList` — the course-wide Q&A roll-up region: the async
 * lifecycle (loading → error → search-empty → content) around a flush divide-y
 * question list plus a pager. The Content leaf renders one `QaQuestionThread`
 * per question — collapsed until pressed, then the full conversation inline.
 * Four leaves: `Loading`, `Error`, `Empty` (filter matched
 * nothing; true zero-ever is `CourseQaInvite` a layer up), `Content`.
 */

/** One asker — plain data, the row builds the avatar + name from it. */
export interface CourseQaQuestionAuthor {
    /** Stable id — used to detect "this is the viewer's own question". */
    id: string
    /** Display name (or username fallback), already resolved by the caller. */
    displayName: string
    /** Avatar image; absent → the atom's own generated/initials fallback chain. */
    avatarUrl?: string
}

/** Where a question was asked — drives the scope chip's own label (§14d.1). */
export type CourseQaQuestionScope =
    | { kind: "lesson", lessonTitle: string }
    | { kind: "general" }

/** One question row — plain DATA; the block builds the wording/chips/dot. */
export interface CourseQaQuestionItem {
    /** Stable id — the React key, and how "own question" is detected. */
    id: string
    /** Who asked it. */
    author: CourseQaQuestionAuthor
    /** Already-formatted relative time, e.g. "2 hours ago" (no i18n layer at this tier). */
    createdTimeAgo: string
    /** `true` → a pin glyph rides beside the asker's name. */
    isPinned?: boolean
    /** `true` → a founder-verified glyph rides beside the asker's name. */
    isFounderAuthor?: boolean
    /** One/two-line preview of the question body. */
    preview: string
    /** Which lesson (or "general/course-wide") this question belongs to. */
    scope: CourseQaQuestionScope
    /** How many answers this question has. `0` ⇒ unanswered. */
    replyCount: number
    /** `true` → the (at least one) answer came from the course founder. */
    answeredByFounder?: boolean
}

/** The signed-in viewer's own identity — threaded through for the `QaQuestionThread` swap (★2/★6). */
export interface CourseQaCurrentUser {
    username: string
    avatar?: string
}

/** Props for {@link CourseQaQuestionList}. */
export interface CourseQaQuestionListProps {
    /** The current page's questions, in display order. */
    questions: ReadonlyArray<CourseQuestionNode>
    /** `true` while this list's own fetch is in flight (feeds the Loading leaf). */
    isLoading: boolean
    /** Truthy → the fetch failed (feeds the Error leaf, outranks loading/empty). */
    error?: unknown
    /** Retry the failed fetch. Omit → the error message carries no action. */
    onRetry?: () => void
    /** 1-based current page. */
    page: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the viewer picked. */
    onPageChange: (page: number) => void
    /** Signed-in viewer's id (drives the "You" swap, ★6); `null` when signed out. */
    currentUserId: string | null
    /** Signed-in viewer's identity — pass-through for the `QaQuestionThread` swap (★2). */
    currentUser: CourseQaCurrentUser | null
    /** Fired after an answer is posted/edited/deleted — pass-through for the `QaQuestionThread` swap (★2). */
    onAnswered?: () => void
    /** Accessible name for the pager region (★4). */
    pagerAriaLabel: string
    /** External skeleton override, distinct from `isLoading` (★5). */
    isSkeleton?: boolean
}

/** How many placeholder rows mirror the list while the first page loads — matches `CourseQaSkeleton.tsx`. */
const SKELETON_ROW_COUNT = 4

const ERROR_TITLE = "Couldn't load the question list"
const RETRY_LABEL = "Retry"
const EMPTY_TITLE = "No questions match the current filter"
const EMPTY_DESCRIPTION = "Try a different filter or search term."

/**
 * One placeholder row for the Loading branch — avatar + 2 text bars +
 * chip-pill row + status dot, ported verbatim from the real
 * `CourseQaSkeleton.tsx` shape (★1).
 *
 * `align="start"` on the outer row (instead of the real file's `mt-2` on the
 * dot) top-aligns all three children without a child pushing its own margin
 * (§10a — the padding gate only allows a parent's `gap`/surface `padding` to
 * own a seam).
 */
const SkeletonQuestionRow = () => {
    const previewLines = (
        <>
            <Typography size="sm" isSkeleton classNames={["w-full"]} />
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} />
        </>
    )

    const chipRow = (
        <>
            <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
            <Chip isSkeleton />
        </>
    )

    const textColumn = (
        <>
            {/* asker + time line */}
            <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
            {/* two-line preview */}
            <StackV gap={2} items={[() => previewLines]} />
            {/* chip-pill row — ONE chip (status, the classification axis) + the scope
                as a plain shimmer bar, matching the real row's own text-inline treatment
                (eslint `starci-fe/no-adjacent-chip`, ★7 below). */}
            <StackH gap={3} items={[() => chipRow]} />
        </>
    )

    return (
        <StackH
            gap={4}
            principles={["content-row"]}
            align="start"

            items={[
                () => (
                    <div className="shrink-0">
                        <Avatar isSkeleton size="sm" />
                    </div>
                ),
                () => <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[() => textColumn]} />,
                // status dot — no home atom (★3), same escape hatch `Pagination` uses for its own shimmer squares
                () => <HeroSkeleton className="size-2 shrink-0 rounded-full" />,
            ]}
        />
    )
}


/** The Loading branch's rows — see ★1 for why these are NOT `SurfaceCardList.isSkeleton`. */
const skeletonItems = (): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: () => <SkeletonQuestionRow />,
    }))

/** The Content branch's real rows — each a {@link QuestionPreviewRow} (★2 gap stand-in). */
const questionItems = (
    questions: ReadonlyArray<CourseQuestionNode>,
    currentUserId: string | null,
    currentUser: CourseQaCurrentUser | null,
    onAnswered?: () => void,
): Array<SurfaceCardListItem> =>
    questions.map((question) => ({
        key: question.id,
        content: () => (
            <QaQuestionThread
                question={question}
                currentUserId={currentUserId}
                currentUser={currentUser}
                onAnswered={onAnswered}
            />
        ),
    }))

/**
 * The course-wide Q&A roll-up list. See the file header for the full contract,
 * the GAP note on `QaQuestionThread` (★2), and the remaining judgement calls.
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
}: CourseQaQuestionListProps) => {
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
        <div>
            <AsyncContent
                // ★5 — an external override (`isSkeleton`) converges on the same Loading
                // branch as the list's own fetch flag (`isLoading`).
                isLoading={isSkeleton || isLoading}
                skeleton={() => (
                    <SurfaceCardList
                        items={skeletonItems()}

                    />
                )}
                isEmpty={questions.length === 0}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}

                content={() => (
                    <StackV
                        gap={4}

                        items={[
                            () => (
                                <SurfaceCardList
                                    items={questionItems(questions, currentUserId, currentUser, onAnswered)}

                                />
                            ),
                            ...(totalPages > 1
                                ? [
                                    // ★4 — `Pagination` hard-codes its own aria-label; a wrapping
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
        </div>
    )
}

export { CourseQaQuestionList }
