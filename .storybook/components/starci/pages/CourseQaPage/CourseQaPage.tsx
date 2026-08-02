import React, { useState } from "react"
import { CourseQaHeader, type CourseQaHeaderCrumb } from "@sb-components/starci/blocks/learn/CourseQaHeader/CourseQaHeader"
import { CourseQaInvite } from "@sb-components/starci/blocks/learn/CourseQaInvite/CourseQaInvite"
import { CourseQaEngagementStrip } from "@sb-components/starci/blocks/learn/CourseQaEngagementStrip/CourseQaEngagementStrip"
import { CourseQaComposer, type CourseQaComposerUser } from "@sb-components/starci/blocks/learn/CourseQaComposer/CourseQaComposer"
import { CourseQaToolbar, type CourseQaFilter } from "@sb-components/starci/blocks/learn/CourseQaToolbar/CourseQaToolbar"
import { CourseQaQuestionList, type CourseQaQuestionItem, type CourseQaCurrentUser } from "@sb-components/starci/blocks/learn/CourseQaQuestionList/CourseQaQuestionList"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseQaPage` — the course-wide Q&A roll-up: every top-level learner question
 * across the course's lessons, with a filter/search toolbar and pagination. It
 * composes blocks in frames and hands each typed data, drawing no shape of its own.
 *
 * Owns one branch, `isInvitationEmpty` — a true zero (only under the `all`/`engagement`
 * filters, which don't narrow by answered-status) earns the whole-page invitation;
 * every narrower empty is the question list's own empty leaf. Defines its own
 * `CourseQaViewer` type and adapts it into each block's user shape, and holds the
 * composer's draft text as screen-local state (`onAskQuestion` fires the finished body).
 */

/** The signed-in viewer, in this screen's own vocabulary. Adapted into each composed block's own shape below. */
export interface CourseQaViewer {
    /** Display name — seeds both the composer avatar and (future) the question list's "own question" swap. */
    displayName: string
    /** Avatar image URL. Omitted → each composed atom falls back per its own chain. */
    avatarUrl?: string
}

/** Fixed board-wide copy for the "nobody has ever asked anything" invitation — see file header. */
const INVITE_TITLE = "No questions yet"
const INVITE_HINT = "Browse the course content, then come back to ask the first question."
const INVITE_CTA = "Browse course content"

/** Fixed accessible names — board-wide, never course-specific (see file header). */
const FILTER_ARIA_LABEL = "Question filter"
const PAGER_ARIA_LABEL = "Question list navigation"

/** Props for {@link CourseQaPage}. */
export interface CourseQaPageProps {
    /** Breadcrumb trail as data. */
    breadcrumbItems?: Array<CourseQaHeaderCrumb>
    /** Page title, e.g. "Q&A". */
    title: string
    /** One-sentence description of what this Q&A board is for. */
    description?: string
    /** Learners enrolled in the course. Omitted → the engagement strip drops that line entirely (real numbers only). */
    enrollmentCount?: number
    /** Total questions on the board — feeds the engagement strip and (see file header) the toolbar's result count. */
    totalQuestions: number
    /** Of {@link CourseQaPageProps.totalQuestions}, how many have at least one answer. */
    answeredQuestions: number

    /** Which status/scope filter is active. */
    filter: CourseQaFilter
    /** Fired with the filter the reader picked. */
    onFilterChange: (filter: CourseQaFilter) => void
    /** Current text in the search field. */
    searchValue: string
    /** Fired with the new query on every keystroke. */
    onSearchChange: (value: string) => void

    /** The signed-in viewer. `null` → composer draws no avatar and the list's "own question" swap never fires. */
    currentUser: CourseQaViewer | null
    /** Signed-in viewer's id — drives the "own question" swap one layer down. `null` when signed out. */
    currentUserId: string | null

    /** The current page's questions, in display order. */
    questions: ReadonlyArray<CourseQaQuestionItem>
    /** 1-based current page. */
    page: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the reader picked. */
    onPageChange: (page: number) => void

    /** Fired when the reader submits a new course-general question, with the finished body text. */
    onAskQuestion: (body: string) => void
    /** Fired after an answer is posted/edited/deleted anywhere in the list. */
    onAnswered?: () => void
    /** Fired from the invitation's one way forward — back into the course content. */
    onGoToContent: () => void

    /**
     * `true` → every block that can mirror itself does, and the invitation
     * branch is skipped in favour of the populated shape (see file header).
     */
    isSkeleton?: boolean
}

/**
 * The course Q&A roll-up screen. See the file header for the function list,
 * the ported `isInvitationEmpty` branch, and the judgement calls on the
 * shared result count / list async lifecycle / viewer shape / composer draft.
 *
 * @param props - {@link CourseQaPageProps}
 */
const CourseQaPage = ({
    breadcrumbItems,
    title,
    description,
    enrollmentCount,
    totalQuestions,
    answeredQuestions,
    filter,
    onFilterChange,
    searchValue,
    onSearchChange,
    currentUser,
    currentUserId,
    questions,
    page,
    totalPages,
    onPageChange,
    onAskQuestion,
    onAnswered,
    onGoToContent,
    isSkeleton = false,
}: CourseQaPageProps) => {
    // Screen-local UI state for the composer's in-progress keystrokes — see
    // file header for why this is not a prop pair on this screen's contract.
    const [draft, setDraft] = useState("")

    // Ported verbatim from `src`'s `CourseQa/index.tsx` — see file header.
    const hasQuery = (filter !== "all" && filter !== "engagement") || searchValue.trim().length > 0
    const isInvitationEmpty = !isSkeleton && questions.length === 0 && !hasQuery

    const composerUser: CourseQaComposerUser | undefined = currentUser
        ? { name: currentUser.displayName, avatarSrc: currentUser.avatarUrl }
        : undefined
    const listCurrentUser: CourseQaCurrentUser | null = currentUser
        ? { username: currentUser.displayName, avatar: currentUser.avatarUrl }
        : null

    const handleAskQuestion = () => {
        onAskQuestion(draft)
        setDraft("")
    }

    const questionSection = (
        <>
            <CourseQaEngagementStrip

                enrollmentCount={enrollmentCount}
                totalQuestions={totalQuestions}
                answeredQuestions={answeredQuestions}
                isSkeleton={isSkeleton}

            />
            <CourseQaComposer

                mode="collapsible"
                currentUser={composerUser}
                value={draft}
                onValueChange={setDraft}
                placeholder="Ask a question about this course…"
                onSubmit={handleAskQuestion}
                isSkeleton={isSkeleton}

            />
            <CourseQaToolbar

                filter={filter}
                onFilterChange={onFilterChange}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                resultCount={totalQuestions}
                filterAriaLabel={FILTER_ARIA_LABEL}
                isSkeleton={isSkeleton}

            />
            <CourseQaQuestionList

                questions={questions}
                isLoading={isSkeleton}
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                currentUserId={currentUserId}
                currentUser={listCurrentUser}
                onAnswered={onAnswered}
                pagerAriaLabel={PAGER_ARIA_LABEL}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const courseQaSections = (
        <>
            <CourseQaHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            {isInvitationEmpty ? (
                <CourseQaInvite

                    title={INVITE_TITLE}
                    hint={INVITE_HINT}
                    ctaLabel={INVITE_CTA}
                    onGoToContent={onGoToContent}
                    isSkeleton={isSkeleton}

                />
            ) : (
                <StackV gap={6} items={[() => questionSection]} />
            )}
        </>
    )

    const courseQaBody = <StackV gap={6} items={[() => courseQaSections]} />

    return <Container size="md" padding={6} body={courseQaBody} />
}

export { CourseQaPage }
