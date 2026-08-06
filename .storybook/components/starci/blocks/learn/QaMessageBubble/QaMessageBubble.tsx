import { Skeleton as HeroSkeleton } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { MessageRow } from "./MessageRow"
import {
    type QaMessageBubbleAnswer,
    type QaMessageBubbleProps,
} from "./types"

export type {
    QaMessageBubbleAuthor,
    QaMessageBubbleAnswer,
    QaMessageBubbleProps,
} from "./types"

/**
 * BLOCK — `QaMessageBubble`: one answer (plus its flattened replies) in a Q&A
 * conversation — author line, chat bubble body, an accept toggle (asker
 * only, top-level only), a reaction bar, and every reply beneath it,
 * read-only (see the component's own file header for why).
 */

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
                    principle="separator-dot"
                    explain="Places a middle-dot separator between short meta peers so the items read as one inline list."
                    align="center"
                    items={[
                        () => (
                            <StackH
                                gap={2}
                                principle="icon-text"
                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                align="center"
                                items={[
                                    () => <Avatar isSkeleton size="sm" />,
                                    () => <HeroSkeleton className="h-3 w-16 rounded" />,
                                ]}
                            />
                        ),
                        () => <HeroSkeleton className="h-3 w-10 rounded" />,
                    ]}
                />
                <HeroSkeleton className="h-16 w-full rounded-2xl" />
            </>
        )
        return (
            <div className="max-w-[92%]">
                <StackV gap={2} isSkeleton={isSkeleton} items={[() => skeletonBody]} />
            </div>
        )
    }
    // `answer` is REQUIRED whenever `isSkeleton` is false (the discriminated union
    // above, already guaranteed by the early return) — `!` only satisfies narrowing
    // across the destructure, it never actually fires.
    const realAnswer = answer!

    const replyRows = (realAnswer.replies ?? []).map((reply: QaMessageBubbleAnswer) => (
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
            <StackV gap={2} isSkeleton={isSkeleton} items={[() => threadBody]} />
        </div>
    )
}

export { QaMessageBubble }
