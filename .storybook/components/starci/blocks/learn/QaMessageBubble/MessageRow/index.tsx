import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { QaChatBubble } from "@sb-components/starci/blocks/learn/QaChatBubble/QaChatBubble"
import { QaReactionBar, type QaReactionType } from "@sb-components/starci/blocks/learn/QaReactionBar/QaReactionBar"
import { type QaMessageBubbleAnswer } from "../types"

/** One bubble + author line, with no interactive controls — used for the top answer's OWN rendering and for every read-only reply beneath it. */
interface MessageRowInteractive {
    canAccept: boolean
    onAcceptAnswer: (accepted: boolean) => void
    onReact: (type: QaReactionType | null) => void
}
interface MessageRowProps {
    answer: QaMessageBubbleAnswer
    currentUserId: string | null
    interactive: MessageRowInteractive | null
}
export const MessageRow = ({
    answer,
    currentUserId,
    interactive,
}: MessageRowProps) => {
    const isMine = currentUserId != null && currentUserId === answer.author.id
    const displayName = isMine ? "You" : answer.author.displayName

    const authorRow = (
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
                            () => <Avatar src={answer.author.avatarUrl} name={answer.author.displayName} seed={answer.author.id} size="sm" />,
                            () => <Typography size="xs" weight="medium" text={displayName} />,
                        ]}
                    />
                ),
                () => <Typography size="xs" color="muted" text={answer.createdTimeAgo} />,
                ...(answer.isAcceptedAnswer ? [() => <Chip tone="success" text="Accepted answer" />] : []),
            ]}
        />
    )

    const reactionRow = interactive ? (
        <StackH
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
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
            <div className="max-w-[92%]">
                <StackV gap={2} principle="title-subtitle"
                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                    align={isMine ? "end" : undefined} classNames={["min-w-0"]} items={[() => bubbleBody]}  />
            </div>
        </div>
    )
}
