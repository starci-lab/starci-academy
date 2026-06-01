import { ReactionType } from "@/modules/api"

/** A reaction kind's emoji + Twemoji codepoint + i18n label key. */
export interface ReactionDescriptor {
    /** The reaction kind. */
    type: ReactionType
    /** Native emoji glyph (fallback / alt text). */
    emoji: string
    /** Twemoji asset codepoint (filename without extension), e.g. `1f44d`. */
    codepoint: string
    /** i18n key under `discussion.reactions.*` for the accessible label. */
    labelKey: string
}

/** Ordered list of supported reactions (Facebook-style), driving the picker + summary. */
export const REACTIONS: ReadonlyArray<ReactionDescriptor> = [
    {
        type: ReactionType.Like,
        emoji: "👍",
        codepoint: "1f44d",
        labelKey: "discussion.reactions.like",
    },
    {
        type: ReactionType.Love,
        emoji: "❤️",
        codepoint: "2764",
        labelKey: "discussion.reactions.love",
    },
    {
        type: ReactionType.Haha,
        emoji: "😂",
        codepoint: "1f602",
        labelKey: "discussion.reactions.haha",
    },
    {
        type: ReactionType.Wow,
        emoji: "😮",
        codepoint: "1f62e",
        labelKey: "discussion.reactions.wow",
    },
    {
        type: ReactionType.Sad,
        emoji: "😢",
        codepoint: "1f622",
        labelKey: "discussion.reactions.sad",
    },
    {
        type: ReactionType.Angry,
        emoji: "😡",
        codepoint: "1f621",
        labelKey: "discussion.reactions.angry",
    },
]

/** Quick lookup from reaction type → descriptor. */
export const REACTION_BY_TYPE: Record<ReactionType, ReactionDescriptor> = REACTIONS.reduce(
    (acc, descriptor) => {
        acc[descriptor.type] = descriptor
        return acc
    },
    {} as Record<ReactionType, ReactionDescriptor>,
)

/**
 * Builds the Twemoji SVG asset URL for a reaction codepoint. Twemoji gives consistent,
 * Facebook-like colour emoji across every OS (the native font renders differ per platform).
 * @param codepoint - The reaction's Twemoji codepoint (see {@link ReactionDescriptor}).
 * @returns A CDN URL to the emoji's SVG.
 */
export const twemojiUrl = (codepoint: string): string =>
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codepoint}.svg`
