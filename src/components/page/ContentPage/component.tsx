import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import {
    ContentHeader,
    type ContentHeaderCrumb,
    type ContentHeaderOutcome,
} from "@/components/starci/blocks/learn/ContentHeader"
import {
    ContentModeNav,
    type ContentLanguage,
    type ContentMode,
    type ContentModeOption,
} from "@/components/starci/blocks/learn/ContentModeNav"
import {
    ContentArticle,
    type ContentArticleOffer,
} from "@/components/starci/blocks/learn/ContentArticle"
import {
    ContentReaction,
    type ReactionType as ContentReactionType,
    type ContentReactionCount,
} from "@/components/starci/blocks/learn/ContentReaction"
import { MilestoneUpNextCard } from "@/components/starci/blocks/learn/MilestoneUpNextCard"
import {
    ContentRelatedList,
    type ContentRelatedItem,
} from "@/components/starci/blocks/learn/ContentRelatedList"
import { ContentDiscussion } from "@/components/starci/blocks/learn/ContentDiscussion"
import type { ContentCommentNode } from "@/components/starci/blocks/learn/ContentCommentThread"
import type { ContentCommentComposerViewer } from "@/components/starci/blocks/learn/ContentCommentComposer"
import {
    ContentPager,
    type ContentPagerNeighbour,
} from "@/components/starci/blocks/learn/ContentPager"

/**
 * `_ContentPage` — the SRC TWIN of `.storybook/components/starci/pages/
 * ContentPage/ContentPage.tsx`. Presentational: typed props, already
 * resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * A screen owns a list of functions: it calls blocks, places them in frames,
 * and hands each typed data. Seven functions, in reading order: what this
 * lesson is · how to look at it · read it · say how it landed · what else to
 * read · talk about it · step to the next one. The footer (reaction, related
 * reading, discussion, pager) is conditional — it appears only on an open
 * lesson; a reader stopped by the paywall sees one decision (the `Locked`
 * leaf). The sandbox / challenges / AI lab tab bodies are their own
 * not-yet-built blocks and are deliberately left unrendered rather than
 * stubbed.
 *
 * On top of the pure blueprint composition, this presentational file also
 * carries the real async lifecycle (error → skeleton → empty → content) —
 * the same extension `_ModulePage`/`_ContentArticle` already make, since a
 * static storybook blueprint has no fetch to fail but a real page does.
 */

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type {
    ContentHeaderCrumb,
    ContentHeaderOutcome,
    ContentLanguage,
    ContentMode,
    ContentModeOption,
    ContentArticleOffer,
    ContentReactionType,
    ContentReactionCount,
    ContentRelatedItem,
    ContentCommentNode,
    ContentCommentComposerViewer,
    ContentPagerNeighbour,
}

/** The mobile/tablet-only "practice this lesson" nudge — omitted → the block never mounts. */
export interface ContentPageUpNext {
    /** Small label above the title, e.g. "Up next · Practice this lesson". */
    eyebrow: string
    /** Nudge title, e.g. "Do this lesson's 3 challenges". */
    title: string
    /** One line describing what the challenges ask for. */
    description: string
    /** CTA label, e.g. "Start challenges". */
    ctaLabel: string
    /** Switch the reader into the Challenges mode. */
    onPress: () => void
}

/** Props for {@link _ContentPage}. */
export interface ContentPageProps {
    /** `true` while the lesson fetch is running (no cache yet). */
    isLoading?: boolean
    /** Set once loading finishes with no result → the error branch. */
    error?: unknown
    /** Retry the failed fetch. */
    onRetry?: () => void
    /** `true` (after loading) → no lesson found → the empty state. */
    isEmpty?: boolean
    /** Empty-state title, e.g. "Lesson not found". */
    emptyTitle: string
    /** Error-state title, e.g. "Couldn't load this lesson". */
    errorTitle: string
    /** Error-state retry button label. */
    retryLabel: string

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
    /** Accessible name for the mode row. */
    tabsAriaLabel: string

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

    /**
     * The mobile/tablet-only practice nudge; the connected file decides WHEN it
     * qualifies (mode === "content" && challengeCount > 0) and only then hands
     * this over — omitted → the block never mounts, on any viewport.
     */
    upNext?: ContentPageUpNext

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
}

/**
 * The lesson reading screen. See the file header for the function list and
 * the async-lifecycle extension over the pure blueprint.
 *
 * @param props - {@link ContentPageProps}
 */
export const _ContentPage = ({
    isLoading = false,
    error,
    onRetry,
    isEmpty = false,
    emptyTitle,
    errorTitle,
    retryLabel,
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
    tabsAriaLabel,
    body,
    isLocked = false,
    offer,
    hintText,
    myReaction,
    reactionCounts,
    viewCount,
    onReact,
    upNext,
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
}: ContentPageProps) => {
    // ONE tree — the resting state is this SAME spine with `isSkeleton` threaded into every
    // shimmer-capable part, never a hand-mirrored copy. `spine(true)` is the loading branch,
    // `spine(false)` the content branch; they cannot drift because they are the same code.
    const spine = (isSkeleton: boolean) => (
        <Container
            size="md"
            padding={6}
            body={() => (
                <StackV
                    gap={6}
                    items={[
                        // 1. identity — trail, title, description, meta, "what you'll learn".
                        () => (
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
                        ),
                        // 2. reading section — how to view it, then the lesson itself. Tighter
                        // gap than the cluster seam above: mode nav + article are ONE continuous
                        // reading surface, not two separate regions.
                        () => (
                            <StackV
                                gap={4}
                                items={[
                                    () => (
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
                                    ),
                                    () => (
                                        <ContentArticle
                                            body={body}
                                            isLocked={isLocked}
                                            offer={offer}
                                            hintText={hintText}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        // 3. lesson footer — react, up-next (mobile), related, discuss, pager.
                        // A locked lesson has ONE decision in front of it (buy), so the whole
                        // cluster waits until the lesson is actually open.
                        ...(!isLocked ? [() => (
                            <StackV
                                gap={6}
                                items={[
                                    () => (
                                        <ContentReaction
                                            myReaction={myReaction}
                                            counts={reactionCounts}
                                            viewCount={viewCount}
                                            onReact={onReact}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    // MOBILE/TABLET-ONLY via CSS: on desktop the right rail's own
                                    // "Practice this lesson" already surfaces this, so `@app-lg:hidden`
                                    // removes it above that width rather than mounting a 2nd tree.
                                    ...(!isSkeleton && mode === "content" && upNext ? [() => (
                                        <MilestoneUpNextCard
                                            className="@app-lg:hidden"
                                            isHighlight
                                            eyebrow={upNext.eyebrow}
                                            title={upNext.title}
                                            description={upNext.description}
                                            ctaLabel={upNext.ctaLabel}
                                            onPress={upNext.onPress}
                                        />
                                    )] : []),
                                    () => (
                                        <ContentRelatedList
                                            items={relatedItems}
                                            label={relatedLabel}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    () => (
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
                                    ),
                                    () => (
                                        <ContentPager
                                            previous={previous}
                                            next={next}
                                            ariaLabel={pagerAriaLabel}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                ]}
                            />
                        )] : []),
                    ]}
                />
            )}
        />
    )

    // error → skeleton → empty → content (BLOCK-8): the empty and error surfaces are the shared
    // `AsyncContent*` frames dropped in as their own states; otherwise the ONE spine renders, with
    // `isLoading` flowing in as the co-located shimmer flag (loading-and-skeleton.md §6).
    const inner = error
        ? <AsyncContentError title={errorTitle} onRetry={onRetry} retryLabel={retryLabel} />
        : (!isLoading && isEmpty)
            ? <AsyncContentEmpty title={emptyTitle} />
            : spine(isLoading)

    return (
        <div data-tier="page" data-component="ContentPage">
            {inner}
        </div>
    )
}
