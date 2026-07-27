import React from "react"
import { ContentArticle, type ContentArticleOffer } from "@sb-components/blocks/learn/ContentArticle/ContentArticle"
import { ContentDiscussion, type ContentComment } from "@sb-components/blocks/learn/ContentDiscussion/ContentDiscussion"
import { ContentHeader, type ContentHeaderCrumb, type ContentHeaderOutcome } from "@sb-components/blocks/learn/ContentHeader/ContentHeader"
import { ContentPager, type ContentPagerNeighbour } from "@sb-components/blocks/learn/ContentPager/ContentPager"
import { ContentReaction } from "@sb-components/blocks/learn/ContentReaction/ContentReaction"
import { ContentRelatedList, type ContentRelatedItem } from "@sb-components/blocks/learn/ContentRelatedList/ContentRelatedList"
import { ContentTabBar, type ContentMode, type ContentTabBarMode } from "@sb-components/blocks/learn/ContentTabBar/ContentTabBar"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `ContentScreen`: read one lesson.
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
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContentScreen}. */
export interface ContentScreenProps {
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
    modes: Array<ContentTabBarMode>
    /** Which mode is being looked at. */
    mode: ContentMode
    /** Fired with the mode the reader picked. */
    onModeChange: (mode: ContentMode) => void

    /** The lesson, as authored markdown. */
    body: string
    /** `true` → the reader has not bought the course. */
    isLocked?: boolean
    /** The offer shown under a locked lesson. */
    offer?: ContentArticleOffer
    /** One-time tip about selecting a passage to ask AI. */
    hintText?: string

    /** How many people reacted to this lesson. */
    reactionCount?: number
    /** How many people opened it. */
    viewCount?: number
    /** `true` → this reader already reacted. */
    hasReacted?: boolean
    /** Fired when the reader reacts or takes it back. */
    onReact: () => void

    /** Related lessons; empty → that block draws nothing. */
    relatedItems: Array<ContentRelatedItem>
    /** Label for the related-reading section. */
    relatedLabel: string

    /** Label for the discussion section. */
    discussionLabel: string
    /** The comments, newest first. */
    comments: Array<ContentComment>
    /** Current composer text. */
    draft: string
    /** Fired as the reader types. */
    onDraftChange: (value: string) => void
    /** Fired when the reader posts. */
    onSubmitComment: () => void

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
 * @param props - {@link ContentScreenProps}
 */
const ContentScreen = ({
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
    body,
    isLocked = false,
    offer,
    hintText,
    reactionCount,
    viewCount,
    hasReacted,
    onReact,
    relatedItems,
    relatedLabel,
    discussionLabel,
    comments,
    draft,
    onDraftChange,
    onSubmitComment,
    previous,
    next,
    pagerAriaLabel,
    tabsAriaLabel,
    isSkeleton = false,
    showAnatomy = false,
}: ContentScreenProps) => (
    <Container size="md" padding="roomy">
        <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
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
            <ContentTabBar
                anatPart="ContentTabBar"
                modes={modes}
                mode={mode}
                onModeChange={onModeChange}
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
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <ContentReaction
                        anatPart="ContentReaction"
                        reactionCount={reactionCount}
                        viewCount={viewCount}
                        hasReacted={hasReacted}
                        onReact={onReact}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
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
                        comments={comments}
                        draft={draft}
                        onDraftChange={onDraftChange}
                        onSubmit={onSubmitComment}
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
                </StackV>
            ) : null}
        </StackV>
    </Container>
)

export { ContentScreen }
