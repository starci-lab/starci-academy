import { type QaReactionType } from "@sb-components/starci/blocks/learn/QaReactionBar/QaReactionBar"

/** Minimal identity carried by whoever wrote an answer. */
export interface QaMessageBubbleAuthor {
    id: string
    displayName: string
    avatarUrl?: string
}

/** One answer — or, flattened, one reply-to-a-reply. Mirrors `QaQuestionThread`'s `QaThreadAnswer` (kept local, see that file's ASSUMED CONTRACTS note). */
export interface QaMessageBubbleAnswer {
    id: string
    body: string
    author: QaMessageBubbleAuthor
    createdTimeAgo: string
    isAcceptedAnswer?: boolean
    reactionCount: number
    myReaction: QaReactionType | null
    replies?: ReadonlyArray<QaMessageBubbleAnswer>
}

/** Props {@link QaMessageBubble} carries regardless of loading state. */
interface QaMessageBubbleOwnProps {
    /** Current viewer id — drives own-bubble alignment (`null` when signed out). */
    currentUserId: string | null
    /** `true` → the viewer is the question's asker, so the accept toggle can render. Ignored on a reply (replies are never acceptable). */
    canAccept: boolean
    /** Accept/un-accept THIS answer. Only called from the top-level bubble — see file header. */
    onAcceptAnswer: (accepted: boolean) => void
    /** React/un-react to THIS answer. Only called from the top-level bubble — see file header. */
    onReact: (type: QaReactionType | null) => void
}

/**
 * Props for {@link QaMessageBubble}. `answer` is REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer bubble has no real answer to show yet.
 */
export type QaMessageBubbleProps = QaMessageBubbleOwnProps &
    (
        | { isSkeleton: true; answer?: QaMessageBubbleAnswer }
        | { isSkeleton?: false; answer: QaMessageBubbleAnswer }
    )
