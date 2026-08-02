import { CheckCircleIcon } from "@phosphor-icons/react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { QaChatBubble } from "@sb-components/starci/blocks/learn/QaChatBubble/QaChatBubble"
import { QaReactionBar, type QaReactionType } from "@sb-components/starci/blocks/learn/QaReactionBar/QaReactionBar"

/**
 * `QaMessageBubble` — one answer in a `QaQuestionThread`: author line,
 * {@link QaChatBubble} body, an accept-answer toggle (asker only, top-level
 * answers only), a {@link QaReactionBar}, and — recursing internally — every
 * flattened reply to this answer as a sibling bubble beneath it. Replies are
 * read-only (no accept/react controls), since the thread threads
 * `onReact`/`onAcceptAnswer` only for top-level answers.
 */

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

/** One bubble + author line, with no interactive controls — used for the top answer's OWN rendering and for every read-only reply beneath it. */
const MessageRow = ({
    answer,
    currentUserId,
    interactive,
}: {
    answer: QaMessageBubbleAnswer
    currentUserId: string | null
    interactive: { canAccept: boolean, onAcceptAnswer: (accepted: boolean) => void, onReact: (type: QaReactionType | null) => void } | null
}) => {
    const isMine = currentUserId != null && currentUserId === answer.author.id
    const displayName = isMine ? "You" : answer.author.displayName

    const authorRow = (
        <StackH
            gap={2}
            align="center"

            items={[
                () => <Avatar src={answer.author.avatarUrl} name={answer.author.displayName} seed={answer.author.id} size="sm" />,
                () => <Typography size="xs" weight="medium" text={displayName} />,
                () => <Typography size="xs" color="muted" text={answer.createdTimeAgo} />,
                ...(answer.isAcceptedAnswer ? [() => <Chip tone="success" text="Accepted answer" />] : []),
            ]}
        />
    )

    const reactionRow = interactive ? (
        <StackH
            gap={3}
            align="center"

            items={[
                () => (
                    <QaReactionBar
                        count={answer.reactionCount}
                        myReaction={answer.myReaction}
                        onReact={interactive.onReact}

                    />
                ),
                ...(interactive.canAccept ? [() => (
                    <Button
                        variant={answer.isAcceptedAnswer ? "secondary" : "ghost"}
                        size="sm"
                        prefixIcon={CheckCircleIcon}
                        label={answer.isAcceptedAnswer ? "Unaccept" : "Mark as the correct answer"}
                        onPress={() => interactive.onAcceptAnswer(!answer.isAcceptedAnswer)}

                    />
                )] : []),
            ]}
        />
    ) : null

    const bubbleBody = (
        <>
            {authorRow}

            <QaChatBubble role={isMine ? "user" : "assistant"}>
                <div className="[&_p]:m-0">
                    <MarkdownContent source={answer.body} measure="compact" />
                </div>
            </QaChatBubble>

            {reactionRow}
        </>
    )

    return (
        <div className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}>
            <StackV gap={2} className={cn("min-w-0 max-w-[92%]", isMine && "items-end")} items={[() => bubbleBody]} />
        </div>
    )
}

/**
 * One answer (plus its flattened replies) in a `QaQuestionThread` conversation.
 *
 * @param props - {@link QaMessageBubbleProps}
 */
const QaMessageBubble = ({
    answer,
    currentUserId,
    canAccept,
    onAcceptAnswer,
    onReact,
    isSkeleton = false,
}: QaMessageBubbleProps) => {
    if (isSkeleton) {
        const skeletonBody = (
            <>
                <StackH
                    gap={2}
                    align="center"

                    items={[
                        () => <Avatar isSkeleton size="sm" />,
                        () => <HeroSkeleton className="h-3 w-16 rounded" />,
                        () => <HeroSkeleton className="h-3 w-10 rounded" />,
                    ]}
                />
                <HeroSkeleton className="h-16 w-full rounded-2xl" />
            </>
        )
        return (
            <div>
                <StackV gap={2} className="max-w-[92%]" items={[() => skeletonBody]} />
            </div>
        )
    }
    // `answer` is REQUIRED whenever `isSkeleton` is false (the discriminated union
    // above, already guaranteed by the early return) — `!` only satisfies narrowing
    // across the destructure, it never actually fires.
    const realAnswer = answer!

    const replyRows = (realAnswer.replies ?? []).map((reply) => (
        <div key={reply.id} className="pl-8">
            <MessageRow answer={reply} currentUserId={currentUserId} interactive={null} />
        </div>
    ))

    const threadBody = (
        <>
            <MessageRow
                answer={realAnswer}
                currentUserId={currentUserId}

                interactive={{ canAccept, onAcceptAnswer, onReact }}
            />
            {replyRows}
        </>
    )

    return (
        <div>
            <StackV gap={2} items={[() => threadBody]} />
        </div>
    )
}

export { QaMessageBubble }
