import React from "react"
import { PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { type CourseQaQuestionItem, type CourseQaQuestionScope } from "../types"

/** The block's own scope→label vocabulary (§14d.1) — never handed in pre-formatted. */
const scopeLabel = (scope: CourseQaQuestionScope): string =>
    scope.kind === "lesson" ? `Lesson: ${scope.lessonTitle}` : "General"

/** The block's own status→label vocabulary (§14d.1). */
const statusLabel = (replyCount: number, answeredByFounder?: boolean): string => {
    if (replyCount <= 0) {
        return "Not answered yet"
    }
    return answeredByFounder ? "Instructor answered" : "Answered"
}

/** Props for {@link QuestionPreviewRow}. */
interface QuestionPreviewRowProps {
    question: CourseQaQuestionItem
    currentUserId: string | null
}

/**
 * TEMPORARY GAP STAND-IN for the not-yet-built `QaQuestionThread` block — see
 * the file header's GAP note (*2). Renders the COLLAPSED look only (real data,
 * real atoms), no expand/reply behaviour: pressing does nothing, because
 * inventing a fake "open the thread" affordance here would be worse than
 * honestly having none yet.
 */
export const QuestionPreviewRow = ({ question, currentUserId }: QuestionPreviewRowProps) => {
    const isMine = currentUserId != null && currentUserId === question.author.id
    const isAnswered = question.replyCount > 0
    const askerName = isMine ? "You" : question.author.displayName

    // ONE chip for the row's classification axis (status — the thing worth scanning
    // the list for); the scope rides as plain muted text beside it instead of a
    // second chip (eslint `starci-fe/no-adjacent-chip`, *7).
    const chips: Array<ComponentTypeWithSkeleton> = [
        () => <Typography size="xs" color="muted" text={scopeLabel(question.scope)} />,
        () => (
            <Chip
                tone={isAnswered ? "success" : "default"}
                text={statusLabel(question.replyCount, question.answeredByFounder)}

            />
        ),
    ]
    if (isAnswered) {
        // no icon here — §5a.2: a chat-bubble needs an ASSOCIATION step to read as
        // "replies" (not a universal symbol like check/locklock), and the text already carries
        // the fact on its own (same fix already applied to QaQuestionThread/QaConversationHeader).
        chips.push(() => (
            <Typography size="xs" color="muted" text={`${question.replyCount} replies`} />
        ))
    }

    const nameLine = (
        <>
            {question.isPinned ? (
                <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
            ) : null}
            <Typography size="xs" weight="medium" text={askerName} />
            {question.isFounderAuthor ? (
                <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
            ) : null}
            <Typography size="xs" color="muted" text={`· ${question.createdTimeAgo}`} />
        </>
    )

    const textColumn = (
        <>
            <StackH gap={2} items={[() => nameLine]} />
            <Typography size="sm" lineClamp={2} text={question.preview} />
            <Cluster gap={3} items={chips} />
        </>
    )

    return (
        <StackH
            gap={4}
            principles="content-row"
            align="start"

            items={[
                () => (
                    <div className="shrink-0">
                        <Avatar
                            src={question.author.avatarUrl}
                            name={question.author.displayName}
                            seed={question.author.id}
                            size="sm"

                        />
                    </div>
                ),
                () => <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[() => textColumn]} />,
                () => (
                    <span
                        aria-hidden
                        className={`size-2 shrink-0 rounded-full ${isAnswered ? "bg-success" : "bg-warning"}`}
                    />
                ),
            ]}
        />
    )
}
