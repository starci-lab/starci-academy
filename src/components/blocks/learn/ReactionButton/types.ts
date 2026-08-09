/** The six reactions, in the fixed display order real `src` uses. */
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

/** One reaction kind's fixed vocabulary — the block's own table (§14d.1), never caller-supplied. */
interface ReactionDescriptor {
    type: ReactionType
    /** Accessible + summary label, matches `src/messages/vi.json`'s `discussion.reactions.*`. */
    label: string
}

/** Public export `REACTIONS` for this module. */
export const REACTIONS: ReadonlyArray<ReactionDescriptor> = [
    { type: "like", label: "Like" },
    { type: "love", label: "Love" },
    { type: "haha", label: "Haha" },
    { type: "wow", label: "Wow" },
    { type: "sad", label: "Sad" },
    { type: "angry", label: "Angry" },
]

/** Public export `REACTION_BY_TYPE` for this module. */
export const REACTION_BY_TYPE: Record<ReactionType, ReactionDescriptor> = REACTIONS.reduce(
    (acc, descriptor) => { acc[descriptor.type] = descriptor; return acc },
    {} as Record<ReactionType, ReactionDescriptor>,
)

/** How many times each reaction was picked — one entry per emotion actually present. */
export interface ReactionCount {
    type: ReactionType
    count: number
}

/** Props for {@link ReactionButton}. */
export interface ReactionButtonProps {
    /** The viewer's own reaction, or `null`/omitted if they haven't reacted. */
    myReaction?: ReactionType | null
    /** Per-emotion counts. Empty/omitted → the summary is not drawn at all. */
    counts?: ReadonlyArray<ReactionCount>
    /** Fired with the picked emotion, or `null` to remove the current one. */
    onReact: (type: ReactionType | null) => void
    /** `true` → the reaction is in flight. The trigger owns the busy affordance. */
    isPending?: boolean
    /** `true` → the trigger + summary switch to their own shimmer. */
    isSkeleton?: boolean
}
