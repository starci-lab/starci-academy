import { PricingPhase as SbPricingPhase } from "@/components/starci/blocks/commerce/PhaseScarcityNote"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { ReactionType, type CommentNode, type ReactionCount } from "@/modules/api/graphql/queries/types/discussion"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import type { Difficulty } from "@/components/blocks/chips/DifficultyChip"
import type { ReactionType as ContentReactionType, ContentReactionCount } from "@/components/starci/blocks/learn/ContentReaction"
import type { ContentCommentNode } from "@/components/starci/blocks/learn/ContentCommentThread"

/**
 * Real-data -> storybook-block conversions shared by more than one page. Lives at the
 * PAGE TIER ROOT (not inside any one page's own folder) because these are shared
 * vocabulary, not a single page's private helper: `toArticle*`/`toRealReactionType` are
 * used by both `ContentPage` (the lesson reader) and `ModulePage` (the paywall offer it
 * reuses), and `toDifficulty` is used by both `CourseContents` and `ModulePage` — a page
 * reaching into a SIBLING page's folder for its mappers is the smell this file removes.
 * Same convention as `composites/_slot.ts` and `frames/_principles.ts` — an
 * underscore-prefixed shared module at the tier root.
 *
 * The blocks under `@/components/starci/blocks/learn/*` define their own small
 * vocabularies (a `ReactionType` string union, a `PricingPhase` enum) that carry the SAME
 * meaning as this app's real GraphQL enums but are a different nominal type (and, for
 * `PricingPhase.EarlyBird`, a different string literal: `"earlyBird"` vs `"early_bird"`)
 * — so a plain cast is either unsafe or wrong, and each needs its own tiny mapping
 * function instead.
 */

/**
 * Normalize a raw difficulty string (lessons: beginner | intermediate |
 * advanced; challenges: easy | medium | hard | insane) into the `DifficultyChip`
 * enum. Unknown / null values fall back to `beginner`.
 *
 * @param raw - The backend difficulty string, possibly null.
 * @returns The matching {@link Difficulty}.
 */
export const toDifficulty = (raw: string | null): Difficulty => {
    switch (raw) {
    case "intermediate":
    case "medium":
        return "intermediate"
    case "advanced":
    case "hard":
        return "advanced"
    case "insane":
    case "expert":
        return "insane"
    case "beginner":
    case "easy":
    default:
        return "beginner"
    }
}

/** Real `ReactionType` enum -> the sb block's own `"like" | "love" | ...` string union (same values). */
export const toArticleReactionType = (type: ReactionType): ContentReactionType => type as unknown as ContentReactionType

/** The sb block's reaction string union -> the real `ReactionType` enum sent to the API. */
export const toRealReactionType = (type: ContentReactionType | null): ReactionType | null =>
    type === null ? null : (type as unknown as ReactionType)

/** Real per-emotion counts -> the sb block's own `ContentReactionCount` shape. */
export const toArticleReactionCounts = (
    counts: ReadonlyArray<ReactionCount> | undefined,
): ReadonlyArray<ContentReactionCount> =>
    (counts ?? []).map((count) => ({ type: toArticleReactionType(count.type), count: count.count }))

/** Real course pricing-phase enum -> `PhaseScarcityNote`'s own enum (`EarlyBird` is spelled differently). */
export const toArticlePricingPhase = (phase: PricingPhase): SbPricingPhase => {
    switch (phase) {
    case PricingPhase.Pioneer:
        return SbPricingPhase.Pioneer
    case PricingPhase.EarlyBird:
        return SbPricingPhase.EarlyBird
    case PricingPhase.Regular:
    default:
        return SbPricingPhase.Regular
    }
}

/**
 * Real `CommentNode` (from `contentComments`/`createComment`/…) -> the sb
 * `ContentCommentThread` block's own `ContentCommentNode` shape. Needs `t` to
 * render `createdAt` as an already-localized relative time string, same as
 * `community/Discussion/CommentItem` does.
 */
export const toArticleComment = (
    comment: CommentNode,
    t: (key: string, values?: Record<string, number>) => string,
): ContentCommentNode => ({
    id: comment.id,
    author: {
        id: comment.author.id,
        username: comment.author.username,
        avatarUrl: comment.author.avatar ?? undefined,
    },
    createdTimeAgo: getTimeAgoLabel(getTimeAgoMessage(comment.createdAt), t),
    isFounderAuthor: comment.isFounderAuthor,
    isEdited: Boolean(comment.editedAt),
    isDeleted: comment.isDeleted,
    body: comment.body,
    replyCount: comment.replyCount,
    myReaction: comment.reactions.myReaction === null ? null : toArticleReactionType(comment.reactions.myReaction),
    reactionCounts: toArticleReactionCounts(comment.reactions.counts),
})
