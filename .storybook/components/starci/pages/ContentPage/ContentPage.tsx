import React from "react"
import { ContentArticle, type ContentArticleOffer } from "@sb-components/starci/blocks/learn/ContentArticle/ContentArticle"
import { ContentDiscussion } from "@sb-components/starci/blocks/learn/ContentDiscussion/ContentDiscussion"
import type { ContentCommentNode } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"
import type { ContentCommentComposerViewer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { ContentHeader, type ContentHeaderCrumb, type ContentHeaderOutcome } from "@sb-components/starci/blocks/learn/ContentHeader/ContentHeader"
import { ContentPager, type ContentPagerNeighbour } from "@sb-components/starci/blocks/learn/ContentPager/ContentPager"
import { ContentReaction, type ReactionType as ContentReactionType, type ContentReactionCount } from "@sb-components/starci/blocks/learn/ContentReaction/ContentReaction"
import { ContentRelatedList, type ContentRelatedItem } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { ContentModeNav, type ContentLanguage, type ContentMode, type ContentModeOption } from "@sb-components/starci/blocks/learn/ContentModeNav/ContentModeNav"
import { MilestoneUpNextCard } from "@sb-components/starci/blocks/learn/MilestoneUpNextCard/MilestoneUpNextCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `ContentPage`: read one lesson.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * SEVEN FUNCTIONS, in the order the reader meets them: what this lesson is · how
 * to look at it · read it · say how it landed · what else to read · talk about it
 * · step to the next one.
 *
 * ⭐ THE FOOTER IS CONDITIONAL, AND THE CONDITION IS THE POINT. Reaction,
 * related reading, discussion and the pager only appear on an OPEN lesson. A
 * reader who has hit the paywall has one decision in front of them, and four
 * more things to do underneath would compete with it.
 *
 * SCOPE OF THIS PASS: the reading mode. The tab row offers sandbox, challenges
 * and AI lab because a lesson really has them, but their bodies are their own
 * blocks and are not built yet — the screen does not fake them with a frame and
 * a div, because a stub that renders is worse than an absence that does not
 * (§B3).
 *
 * ⚠️ `ContentHeader` is what the screen calls for identity, NOT `CourseBrief`:
 * the two are siblings, and the one that knows about read state, reading time
 * and learning outcomes is the lesson one.
 *
 * ⭐ MOBILE/TABLET-ONLY PRACTICE NUDGE — CSS, NOT A SEPARATE COMPONENT (teacher
 * 2026-07-28, corrected off an earlier namespace attempt). Right after
 * `ContentReaction`, `MilestoneUpNextCard` (reused: its shape is domain-generic
 * even though its name says "milestone") always MOUNTS when the lesson has
 * challenges, and hides itself above `@app-lg` via `className="@app-lg:hidden"`
 * — the exact mechanism `src`'s own `UpNextCard` uses at
 * `LessonReader/index.tsx:386-398`. On desktop the right rail's own "Practice this
 * lesson" already surfaces this, so the card would be a duplicate CTA there;
 * CSS removes it from view rather than the screen needing a second component
 * tree to not-render it. One screen, one render — see this file's story for
 * how to actually SEE it (narrow the `@container` the render sits in).
 *
 * ⚠️ `isHighlight={false}` ON PURPOSE. `MilestoneUpNextCard`'s DEFAULT (`true`)
 * paints the light-streak highlight it needs at its ORIGINAL call site (the
 * one focal action on a milestone result screen) — real `src`'s `UpNextCard`
 * here is a PLAIN, unaccented card (its `SectionCard` never passes `accent`).
 * Caught by comparing this render against the live app (teacher, 2026-07-28):
 * reusing the block does not mean reusing every one of its callers' defaults.
 *
 * ⚠️ COPY VERIFIED AGAINST REAL i18n (teacher, 2026-07-28: "too much invented copy" — an
 * earlier pass invented eyebrow/description/ctaLabel instead of reading them).
 * Real keys: `src/messages/vi.json:1581-1590` (`content.upNext.*`), consumed at
 * `LessonReader/index.tsx:390-395`. Only `title` had been copied correctly;
 * the other three are now the real strings, not invented ones.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContentPage}. */
export interface ContentPageProps {
    /** Breadcrumb trail as data. */
    breadcrumbItems?: Array<ContentHeaderCrumb>
    /** Lesson title. */
    title: string
    /** One-sentence summary of the lesson. */
    description?: string
    /** `true` → the learner has finished this lesson. */
    isRead?: boolean
    /** Estimated reading time in minutes. */
    minutesRead?: number
    /** How many challenges hang off this lesson. */
    challengeCount?: number
    /** The "what you'll learn" lines. */
    outcomes?: Array<ContentHeaderOutcome>

    /** Modes this lesson offers, in display order. */
    modes: Array<ContentModeOption>
    /** Which mode is being looked at. */
    mode: ContentMode
    /** Fired with the mode the reader picked. */
    onModeChange: (mode: ContentMode) => void
    /**
     * The FULL fixed language catalog, each carrying its own `isDisabled` for a
     * language this lesson has no body in — see `ContentModeNav`'s own prop
     * doc. Fewer than two AVAILABLE entries → the tab row's right-hand group
     * is not drawn at all.
     */
    languages?: Array<ContentLanguage>
    /** Which language is being read. */
    language?: string
    /** Fired with the language the reader picked. */
    onLanguageChange?: (language: string) => void
    /** Accessible name for the language group. */
    languageAriaLabel?: string

    /** The lesson, as authored markdown. */
    body: string
    /** `true` → the reader has not bought the course. */
    isLocked?: boolean
    /** The offer shown under a locked lesson. */
    offer?: ContentArticleOffer
    /** One-time tip about selecting a passage to ask AI. */
    hintText?: string

    /** The reader's own reaction, or `null`/omitted if they haven't reacted. */
    myReaction?: ContentReactionType | null
    /** Per-emotion reaction counts. Empty/omitted → the summary is not drawn. */
    reactionCounts?: ReadonlyArray<ContentReactionCount>
    /** How many people opened it. */
    viewCount?: number
    /** Fired with the picked emotion, or `null` to remove the current one. */
    onReact: (type: ContentReactionType | null) => void

    /** Related lessons; empty → that block draws nothing. */
    relatedItems: Array<ContentRelatedItem>
    /** Label for the related-reading section. */
    relatedLabel: string

    /** Label for the discussion section. */
    discussionLabel: string
    /** Current viewer id — drives owner-only edit/delete down the comment tree; null when signed out. */
    currentUserId: string | null
    /** Current viewer identity for the discussion composer's avatar; null when signed out. */
    currentUser?: ContentCommentComposerViewer | null
    /** Top-level comments, newest first. EMPTY → the discussion draws an invitation instead. */
    comments: Array<ContentCommentNode>
    /** Total top-level comment count. */
    commentsTotal: number
    /** Replies keyed by parent comment id (lazily populated by the caller). */
    repliesByParent: Record<string, ReadonlyArray<ContentCommentNode>>
    /** Post a new top-level comment. */
    onSubmitComment: (body: string) => void
    /** Post a reply under a comment. */
    onReply: (parentId: string, body: string) => void
    /** Edit an existing comment. */
    onEditComment: (commentId: string, body: string) => void
    /** Delete a comment. */
    onDeleteComment: (commentId: string) => void
    /** React (or un-react) to a comment. */
    onReactComment: (commentId: string, type: ContentReactionType | null) => void
    /** Lazily load a parent's replies. */
    onLoadReplies: (parentId: string) => void
    /** `true` → more top-level comment pages remain to load. */
    hasMoreComments?: boolean
    /** `true` → the next comment page is currently loading. */
    isLoadingMoreComments?: boolean
    /** Load the next page of top-level comments. */
    onLoadMoreComments?: () => void
    /** Set → the comment list could not be loaded; the message replaces the list only. */
    discussionErrorMessage?: string

    /** The lesson before this one. */
    previous?: ContentPagerNeighbour
    /** The lesson after this one. */
    next?: ContentPagerNeighbour
    /** Accessible name for the pager pair. */
    pagerAriaLabel: string
    /** Accessible name for the mode row. */
    tabsAriaLabel: string

    /**
     * `true` → every block that can mirror itself does. The tab row deliberately
     * does not: it is known before any request and hiding it would take away the
     * one control that was ready.
     */
    isSkeleton?: boolean
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The lesson reading screen. See the file header for the function list and the
 * scope of this pass.
 *
 * @param props - {@link ContentPageProps}
 */
const ContentPage = ({
    breadcrumbItems,
    title,
    description,
    isRead,
    minutesRead,
    challengeCount,
    outcomes,
    modes,
    mode,
    onModeChange,
    languages,
    language,
    onLanguageChange,
    languageAriaLabel,
    body,
    isLocked = false,
    offer,
    hintText,
    myReaction,
    reactionCounts,
    viewCount,
    onReact,
    relatedItems,
    relatedLabel,
    discussionLabel,
    currentUserId,
    currentUser,
    comments,
    commentsTotal,
    repliesByParent,
    onSubmitComment,
    onReply,
    onEditComment,
    onDeleteComment,
    onReactComment,
    onLoadReplies,
    hasMoreComments = false,
    isLoadingMoreComments = false,
    onLoadMoreComments,
    discussionErrorMessage,
    previous,
    next,
    pagerAriaLabel,
    tabsAriaLabel,
    isSkeleton = false,
    showAnatomy = false,
}: ContentPageProps) => {
    const lessonFooter = (
        <>
            <ContentReaction
                anatPart="ContentReaction"
                myReaction={myReaction}
                counts={reactionCounts}
                viewCount={viewCount}
                onReact={onReact}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            {/* MOBILE/TABLET-ONLY, via CSS not a second component tree: on desktop
            the right rail's own "Practice this lesson" already surfaces this, so
            `@app-lg:hidden` removes it from view above that width rather than
            the screen mounting two different trees. Mode/challenge gate mirrors
            `src`'s `UpNextCard` exactly; `isHighlight` does NOT (teacher 2026-07-29,
            deliberate — `src`'s own card is unaccented here, but this nudge is
            the one focal action a mobile reader sees after the reaction bar). */}
            {!isSkeleton && mode === "content" && (challengeCount ?? 0) > 0 ? (
                <MilestoneUpNextCard
                    anatPart="MilestoneUpNextCard"
                    className="@app-lg:hidden"
                    isHighlight
                    eyebrow="Up next · Practice this lesson"
                    title={`Do this lesson's ${challengeCount} challenges`}
                    description="Apply what you just learned. Challenges are graded automatically and count toward your progress."
                    ctaLabel="Start challenges"
                    onPress={() => onModeChange("challenges")}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            <ContentRelatedList
                anatPart="ContentRelatedList"
                items={relatedItems}
                label={relatedLabel}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <ContentDiscussion
                anatPart="ContentDiscussion"
                label={discussionLabel}
                currentUserId={currentUserId}
                currentUser={currentUser}
                comments={comments}
                total={commentsTotal}
                repliesByParent={repliesByParent}
                onSubmitComment={onSubmitComment}
                onReply={onReply}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onReactComment={onReactComment}
                onLoadReplies={onLoadReplies}
                hasMore={hasMoreComments}
                isLoadingMore={isLoadingMoreComments}
                onLoadMore={onLoadMoreComments}
                errorMessage={discussionErrorMessage}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <ContentPager
                anatPart="ContentPager"
                previous={previous}
                next={next}
                ariaLabel={pagerAriaLabel}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const readingSection = (
        <>
            <ContentModeNav
                anatPart="ContentModeNav"
                modes={modes}
                mode={mode}
                onModeChange={onModeChange}
                languages={languages}
                language={language}
                onLanguageChange={onLanguageChange}
                languageAriaLabel={languageAriaLabel}
                ariaLabel={tabsAriaLabel}
                showAnatomy={showAnatomy}
            />
            <ContentArticle
                anatPart="ContentArticle"
                body={body}
                isLocked={isLocked}
                offer={offer}
                hintText={hintText}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            {/* A reader stopped by the paywall has ONE decision in front of them. Four more
                things to do underneath would compete with it, so the whole footer waits
                until the lesson is actually open. */}
            {!isLocked ? (
                <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={lessonFooter} />
            ) : null}
        </>
    )

    const contentSections = (
        <>
            <ContentHeader
                anatPart="ContentHeader"
                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isRead={isRead}
                minutesRead={minutesRead}
                challengeCount={challengeCount}
                outcomes={outcomes}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            {/* ModeNav↔Article↔(reaction cluster) sit CLOSER together than the identity/outcomes
                block above (teacher 2026-07-29, deliberate — a chosen tightening, not a copy of
                `src`'s uniform `gap-6`): they are all "reading this lesson", one continuous
                surface, not separate regions. */}
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={readingSection} />
        </>
    )

    const contentBody = <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={contentSections} />

    return <Container size="md" padding={6} body={contentBody} />
}

export { ContentPage }
