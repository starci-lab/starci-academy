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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `CourseQaPage`: the course-wide Q&A roll-up (`src`'s
 * `CourseQa/index.tsx`) — every top-level learner question across the course's
 * lessons, with a filter/search toolbar and pagination.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * SIX FUNCTIONS, in the order the reader meets them: what this board is · the
 * "you're not learning alone" honest readout · ask a new question · filter/search the
 * board · the questions themselves, paged.
 *
 * ⭐ THE SCREEN OWNS EXACTLY ONE BRANCH, THE SAME WAY `ContentPage` OWNS ITS
 * `!isLocked` BRANCH: `isInvitationEmpty`. Ported VERBATIM from `src`'s own
 * boolean (`CourseQa/index.tsx`), because the logic is genuinely subtle and
 * worth keeping exact rather than re-deriving:
 *
 *     hasQuery = (filter !== "all" && filter !== "engagement") || search.length > 0
 *     isInvitationEmpty = questions.length === 0 && !hasQuery
 *
 * A default `unanswered`-filtered zero does NOT mean "nobody has ever asked
 * anything" — it can just as easily mean "every question already has an
 * answer". Only `all`/`engagement` (which do not narrow by answered-status)
 * proves the TRUE zero that earns the whole-page invitation; every other
 * empty result is a narrower "nothing matches this filter/search" miss that
 * `CourseQaQuestionList` already renders as its own `Empty` leaf one layer
 * down (see that block's file header for the same "empty ≠ empty" distinction
 * made explicit). `isSkeleton` short-circuits the branch to `false` so a
 * loading screen always mirrors the POPULATED shape, never the invitation.
 *
 * ⚠️ JUDGEMENT CALL — no separate "matched result count" prop exists on this
 * contract, so `CourseQaToolbar`'s `resultCount` reads the same
 * `totalQuestions` that also feeds `CourseQaEngagementStrip`. In the live
 * feature these can diverge once a filter narrows the set; a future revision
 * that grows a dedicated filtered-count field should split them, but with one
 * number on hand today, reusing it is the honest simplification rather than
 * inventing a second value nobody hands in (§B3).
 *
 * ⚠️ JUDGEMENT CALL — `CourseQaQuestionList`'s OWN async lifecycle
 * (`isLoading`/`error`/`onRetry`) is a separate concern from this screen's
 * `isSkeleton` per that block's own ★5 note ("both converge on one
 * `AsyncContent.isLoading` computation"). This contract carries only the one
 * combined flag, so `isSkeleton` is wired straight into the list's `isLoading`
 * and no `error`/`onRetry` reaches it — a real per-fetch failure surface for
 * THIS list is out of scope for this pass, the same restraint `ContentPage`
 * already documents for its own narrower slice of a bigger feature.
 *
 * ⭐ TWO DIFFERENT "CURRENT USER" SHAPES, ONE SCREEN-OWNED TYPE.
 * `CourseQaComposer` wants `{ name, avatarSrc }`; `CourseQaQuestionList` wants
 * `{ username, avatar }` (its own field names are pass-through plumbing for a
 * future `QaQuestionThread` swap — see that block's ★2/★6). Neither shape is
 * "the" domain user, so this screen defines its own {@link CourseQaViewer} and
 * adapts it into each block's own vocabulary rather than picking one sibling's
 * shape and forcing the other to match it.
 *
 * ⭐ THE COMPOSER'S DRAFT TEXT IS SCREEN-LOCAL UI STATE, NOT A PROP PAIR.
 * `CourseQaComposer` is a fully controlled text field (`value`/`onValueChange`,
 * §4 contract every `Input.*` atom shares) and this contract's own
 * `onAskQuestion` fires with the finished `body: string` — exactly `src`'s own
 * `onSubmitQuestion(body: string)` shape. Something has to hold the in-progress
 * keystrokes between "empty" and "submitted", and since the caller only cares
 * about the FINISHED body (not every keystroke), this screen owns that one
 * `useState` itself rather than growing the prop surface with a pair nobody
 * outside this screen needs to see — the same kind of screen-local chrome
 * `CourseQaComposer` itself already keeps for its own collapse/expand toggle.
 *
 * ⚠️ SCOPE OF THIS PASS — `filterAriaLabel`/`pagerAriaLabel` are fixed,
 * board-wide accessible names (they never vary per course, unlike
 * `LeaderboardPage`'s `categoryAriaLabel`), so this screen owns them as
 * constants rather than threading two more props for strings that can never
 * change call to call. Same reasoning for the invitation's copy
 * (`INVITE_TITLE`/`INVITE_HINT`/`INVITE_CTA`): `src`'s own `courseQa.empty.*`
 * keys are static, course-independent copy — this screen's own fixed
 * vocabulary (§14d.1), the same way `CourseQaToolbar` owns its filter-label
 * table and `CourseQaQuestionList` owns its empty/error copy without either
 * being threaded in as a prop.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
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
                <StackV gap={6} body={questionSection} />
            )}
        </>
    )

    const courseQaBody = <StackV gap={6} body={courseQaSections} />

    return <Container size="md" padding={6} body={courseQaBody} />
}

export { CourseQaPage }
