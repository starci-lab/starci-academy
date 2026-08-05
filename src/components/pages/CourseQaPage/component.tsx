import React, { useState } from "react"
import { CourseQaHeader, type CourseQaHeaderCrumb } from "@/components/starci/blocks/learn/CourseQaHeader"
import { CourseQaInvite } from "@/components/starci/blocks/learn/CourseQaInvite"
import { CourseQaEngagementStrip } from "@/components/starci/blocks/learn/CourseQaEngagementStrip"
import { CourseQaComposer, type CourseQaComposerUser } from "@/components/starci/blocks/learn/CourseQaComposer"
import { CourseQaToolbar, type CourseQaFilter } from "@/components/starci/blocks/learn/CourseQaToolbar"
import { CourseQaQuestionList, type CourseQaCurrentUser } from "@/components/starci/blocks/learn/CourseQaQuestionList"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `CourseQaPage` — the screen for the course-wide Q&A roll-up. A screen owns a
 * list of functions: it calls blocks, places them in frames, and hands each
 * typed data. Six functions, in reading order: what this board is · the
 * "you're not learning alone" readout · ask a new question · filter/search the
 * board · the questions themselves, paged. The screen owns one branch,
 * `isInvitationEmpty`: only `all`/`engagement` with no search proves a true
 * zero (the `Invitation` leaf); every other empty result is
 * `CourseQaQuestionList`'s own `Empty` leaf one layer down.
 *
 * src twin of `.storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx` —
 * presentational half; the connected {@link CourseQaPage} (`index.tsx`) owns the fetch,
 * routing, and i18n and renders this through `@/components/*` block twins.
 */

/** The signed-in viewer, in this screen's own vocabulary. Adapted into each composed block's own shape below. */
export interface CourseQaViewer {
    /** Display name — seeds both the composer avatar and (future) the question list's "own question" swap. */
    displayName: string
    /** Avatar image URL. Omitted → each composed atom falls back per its own chain. */
    avatarUrl?: string
}

/** All display text, already localized by the connected {@link CourseQaPage}; a story passes i18n keys. */
export interface CourseQaPageLabels {
    /** "Nobody has ever asked anything" invitation heading. */
    inviteTitle: string
    /** Invitation body — nudges the reader into the course content first. */
    inviteHint: string
    /** Invitation's one way forward, into the course content. */
    inviteCta: string
    /** Accessible name for the toolbar's filter tab row. */
    filterAriaLabel: string
    /** Accessible name for the toolbar's search field. */
    searchAriaLabel: string
    /** Accessible name for the question list's pager `<nav>`. */
    pagerAriaLabel: string
    /** Composer placeholder for a course-general question. */
    composerPlaceholder: string
}

/** Props for {@link _CourseQaPage}. */
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
    questions: ReadonlyArray<CourseQuestionNode>
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

    /** All display text — see {@link CourseQaPageLabels}. */
    labels: CourseQaPageLabels

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
const _CourseQaPage = ({
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
    labels,
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

    const onSubmit = () => {
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
                placeholder={labels.composerPlaceholder}
                onSubmit={onSubmit}
                isSkeleton={isSkeleton}

            />
            <CourseQaToolbar

                filter={filter}
                onFilterChange={onFilterChange}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                resultCount={totalQuestions}
                filterAriaLabel={labels.filterAriaLabel}
                searchAriaLabel={labels.searchAriaLabel}
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
                pagerAriaLabel={labels.pagerAriaLabel}
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

                    title={labels.inviteTitle}
                    hint={labels.inviteHint}
                    ctaLabel={labels.inviteCta}
                    onGoToContent={onGoToContent}
                    isSkeleton={isSkeleton}

                />
            ) : (
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => questionSection]} />
            )}
        </>
    )

    const courseQaBody = <StackV gap={6} isSkeleton={isSkeleton} items={[() => courseQaSections]} />

    return (
        <Container
            size="md"
            padding={6}
            body={() => courseQaBody}
            identity={{ tier: "page", component: "CourseQaPage" }}
        />
    )
}

export { _CourseQaPage }
