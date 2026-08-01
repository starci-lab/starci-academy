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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QaMessageBubble`: ONE answer in a `QaQuestionThread` conversation —
 * author line, {@link QaChatBubble} body, an "accept this answer" toggle
 * (only for the asker, direct top-level answers only), a
 * {@link QaReactionBar}, and — recursing internally — every flattened reply
 * to THIS answer as a sibling bubble beneath it. Split out because
 * `QaQuestionThread`'s own file header names it as one of four siblings it
 * composes but does not itself build (§"ASSUMED CONTRACTS").
 *
 * ⭐ REPLIES ARE READ-ONLY, DOCUMENTED CUT: `QaQuestionThread`'s task brief
 * only threads `onReact`/`onAcceptAnswer` for the TOP-LEVEL answer (its
 * `answers.map` call passes them per top-level answer id, never per reply).
 * A reply therefore renders its bubble + author line with no accept/react
 * controls, rather than this block guessing a reply-targeting callback shape
 * nobody asked for. Widening that is a prop-shape change for
 * `QaQuestionThread`, not something to invent silently here.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it. */
    anatPart?: string
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
    showAnatomy,
    interactive,
}: {
    answer: QaMessageBubbleAnswer
    currentUserId: string | null
    showAnatomy: boolean
    interactive: { canAccept: boolean, onAcceptAnswer: (accepted: boolean) => void, onReact: (type: QaReactionType | null) => void } | null
}) => {
    const isMine = currentUserId != null && currentUserId === answer.author.id
    const displayName = isMine ? "You" : answer.author.displayName

    const authorRow = (
        <StackH
            gap={2}
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <Avatar src={answer.author.avatarUrl} name={answer.author.displayName} seed={answer.author.id} size="sm" showAnatomy={showAnatomy} />
                    <Typography size="xs" weight="medium" text={displayName} showAnatomy={showAnatomy} />
                    <Typography size="xs" color="muted" text={answer.createdTimeAgo} showAnatomy={showAnatomy} />
                    {answer.isAcceptedAnswer ? (
                        <Chip tone="success" text="Accepted answer" showAnatomy={showAnatomy} />
                    ) : null}
                </>
            }
        />
    )

    const reactionRow = interactive ? (
        <StackH
            gap={3}
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <QaReactionBar
                        count={answer.reactionCount}
                        myReaction={answer.myReaction}
                        onReact={interactive.onReact}
                        showAnatomy={showAnatomy}
                    />
                    {interactive.canAccept ? (
                        <Button
                            variant={answer.isAcceptedAnswer ? "secondary" : "ghost"}
                            size="sm"
                            prefixIcon={CheckCircleIcon}
                            label={answer.isAcceptedAnswer ? "Unaccept" : "Mark as the correct answer"}
                            onPress={() => interactive.onAcceptAnswer(!answer.isAcceptedAnswer)}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const bubbleBody = (
        <>
            {authorRow}

            <QaChatBubble role={isMine ? "user" : "assistant"} anatPart={showAnatomy ? "QaChatBubble" : undefined}>
                <div className="[&_p]:m-0">
                    <MarkdownContent source={answer.body} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
                </div>
            </QaChatBubble>

            {reactionRow}
        </>
    )

    return (
        <div className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}>
            <StackV gap={2} className={cn("min-w-0 max-w-[92%]", isMine && "items-end")} anatPart={showAnatomy ? "StackV" : undefined} body={bubbleBody} />
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
    showAnatomy = false,
    anatPart,
}: QaMessageBubbleProps) => {
    if (isSkeleton) {
        const skeletonBody = (
            <>
                <StackH
                    gap={2}
                    align="center"
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <>
                            <Avatar isSkeleton size="sm" showAnatomy={showAnatomy} />
                            <HeroSkeleton className="h-3 w-16 rounded" />
                            <HeroSkeleton className="h-3 w-10 rounded" />
                        </>
                    }
                />
                <HeroSkeleton className="h-16 w-full rounded-2xl" />
            </>
        )
        return (
            <div data-anat-part={anatPart}>
                <StackV gap={2} className="max-w-[92%]" anatPart={showAnatomy ? "StackV" : undefined} body={skeletonBody} />
            </div>
        )
    }
    // `answer` is REQUIRED whenever `isSkeleton` is false (the discriminated union
    // above, already guaranteed by the early return) — `!` only satisfies narrowing
    // across the destructure, it never actually fires.
    const realAnswer = answer!

    const replyRows = (realAnswer.replies ?? []).map((reply) => (
        <div key={reply.id} className="pl-8">
            <MessageRow answer={reply} currentUserId={currentUserId} showAnatomy={showAnatomy} interactive={null} />
        </div>
    ))

    const threadBody = (
        <>
            <MessageRow
                answer={realAnswer}
                currentUserId={currentUserId}
                showAnatomy={showAnatomy}
                interactive={{ canAccept, onAcceptAnswer, onReact }}
            />
            {replyRows}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <StackV gap={2} anatPart={showAnatomy ? "StackV" : undefined} body={threadBody} />
        </div>
    )
}

export { QaMessageBubble }
