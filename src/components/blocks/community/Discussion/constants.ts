import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/** A reaction kind's type + i18n label key (glyph lives at `/reactions/<type>.svg`). */
export interface ReactionDescriptor {
    /** The reaction kind. */
    type: ReactionType
    /** i18n key under `discussion.reactions.*` for the accessible label. */
    labelKey: string
}

/** Ordered list of supported reactions (Facebook-style), driving the picker + summary. */
export const REACTIONS: ReadonlyArray<ReactionDescriptor> = [
    {
        type: ReactionType.Like,
        labelKey: "discussion.reactions.like",
    },
    {
        type: ReactionType.Love,
        labelKey: "discussion.reactions.love",
    },
    {
        type: ReactionType.Haha,
        labelKey: "discussion.reactions.haha",
    },
    {
        type: ReactionType.Wow,
        labelKey: "discussion.reactions.wow",
    },
    {
        type: ReactionType.Sad,
        labelKey: "discussion.reactions.sad",
    },
    {
        type: ReactionType.Angry,
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
