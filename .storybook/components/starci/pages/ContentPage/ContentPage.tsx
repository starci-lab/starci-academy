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
 * `ContentPage` — the screen for reading one lesson. It composes blocks in frames and
 * hands each typed data, drawing no shape of its own.
 *
 * Seven functions in reader order: what this lesson is, how to view it, read it, react
 * to it, what else to read, discuss it, step to the next one. The footer cluster
 * (reaction, related reading, discussion, pager) appears only on an open lesson —
 * under the paywall the reader has one decision to make. A mobile/tablet practice
 * nudge mounts when the lesson has challenges and hides above `@app-lg` via CSS. The
 * sandbox/challenges/AI-lab tab bodies are their own blocks, not built here.
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
}: ContentPageProps) => {
    const lessonFooter = (
        <>
            <ContentReaction

                myReaction={myReaction}
                counts={reactionCounts}
                viewCount={viewCount}
                onReact={onReact}
                isSkeleton={isSkeleton}

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

                    className="@app-lg:hidden"
                    isHighlight
                    eyebrow="Up next · Practice this lesson"
                    title={`Do this lesson's ${challengeCount} challenges`}
                    description="Apply what you just learned. Challenges are graded automatically and count toward your progress."
                    ctaLabel="Start challenges"
                    onPress={() => onModeChange("challenges")}

                />
            ) : null}
            <ContentRelatedList

                items={relatedItems}
                label={relatedLabel}
                isSkeleton={isSkeleton}

            />
            <ContentDiscussion

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

            />
            <ContentPager

                previous={previous}
                next={next}
                ariaLabel={pagerAriaLabel}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const readingSection = (
        <>
            <ContentModeNav

                modes={modes}
                mode={mode}
                onModeChange={onModeChange}
                languages={languages}
                language={language}
                onLanguageChange={onLanguageChange}
                languageAriaLabel={languageAriaLabel}
                ariaLabel={tabsAriaLabel}

            />
            <ContentArticle

                body={body}
                isLocked={isLocked}
                offer={offer}
                hintText={hintText}
                isSkeleton={isSkeleton}

            />
            {/* A reader stopped by the paywall has ONE decision in front of them. Four more
                things to do underneath would compete with it, so the whole footer waits
                until the lesson is actually open. */}
            {!isLocked ? (
                <StackV gap={6} body={lessonFooter} />
            ) : null}
        </>
    )

    const contentSections = (
        <>
            <ContentHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isRead={isRead}
                minutesRead={minutesRead}
                challengeCount={challengeCount}
                outcomes={outcomes}
                isSkeleton={isSkeleton}

            />
            {/* ModeNav↔Article↔(reaction cluster) sit CLOSER together than the identity/outcomes
                block above (teacher 2026-07-29, deliberate — a chosen tightening, not a copy of
                `src`'s uniform `gap-6`): they are all "reading this lesson", one continuous
                surface, not separate regions. */}
            <StackV gap={4} body={readingSection} />
        </>
    )

    const contentBody = <StackV gap={6} body={contentSections} />

    return <Container size="md" padding={6} body={contentBody} />
}

export { ContentPage }
