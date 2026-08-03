import React, { useMemo, useState } from "react"
import { cn } from "@heroui/react"
import { PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { CourseQaComposer } from "@/components/starci/blocks/learn/CourseQaComposer"
import { QaConversationHeader } from "@/components/starci/blocks/learn/QaConversationHeader"
import { QaChatBubble } from "@/components/starci/blocks/learn/QaChatBubble"
import { QaReactionBar } from "@/components/starci/blocks/learn/QaReactionBar"
import { QaMessageBubble } from "@/components/starci/blocks/learn/QaMessageBubble"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@/components/composites/_slot"

/**
 * BLOCK — `QaQuestionThread`: ONE course-Q&A conversation — a collapsed social
 * inbox row that presses open into the full conversation (header, question
 * bubble, every answer, a bottom composer). See the component file header for
 * the full contract, the local-state judgement call, and the assumed-contract
 * risk on the four sibling blocks that did not exist yet when this was written.
 */

/** Reaction kinds a message in this thread can carry (mirrors backend `ReactionType`). */
export type QaReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

/** Minimal identity carried by whoever wrote the question or an answer. */
export interface QaQuestionThreadAuthor {
    /** Stable id — drives "is this the viewer's own message" checks. */
    id: string
    /** Display name, already resolved by the caller (falls back to username upstream). */
    displayName: string
    /** Avatar image url. Omitted → `Avatar`'s own generated/initials fallback chain. */
    avatarUrl?: string
}

/** Where a question was asked — drives the scope chip's own wording (§14d.1). */
export type QaQuestionThreadScope =
    | { kind: "lesson", lessonTitle: string }
    | { kind: "general" }

/** One answer — or, once flattened, one reply-to-a-reply — in the conversation. */
export interface QaThreadAnswer {
    /** Stable id — the React key, and what accept/react actions target. */
    id: string
    /** Answer body, as authored markdown. */
    body: string
    /** Who wrote this answer. */
    author: QaQuestionThreadAuthor
    /** Already-formatted relative time, e.g. "2 hours ago" — no i18n layer at this tier. */
    createdTimeAgo: string
    /** `true` → this is the asker's chosen answer; only ever true on a DIRECT (top-level) answer. */
    isAcceptedAnswer?: boolean
    /** Total reactions on this answer. */
    reactionCount: number
    /** The viewer's own reaction on this answer, or null. */
    myReaction: QaReactionType | null
    /** Already-loaded flattened replies to THIS answer — rendered as sibling bubbles, not indented. */
    replies?: ReadonlyArray<QaThreadAnswer>
}

/** The question this whole thread is about. */
export interface QaQuestionThreadQuestion {
    /** Question primary id. */
    id: string
    /** Who asked it. */
    author: QaQuestionThreadAuthor
    /** Already-formatted relative time, e.g. "2 hours ago". */
    createdTimeAgo: string
    /** `true` → a pin glyph rides beside the asker's name (founder moderation). */
    isPinned?: boolean
    /** `true` → the asker is the founder (drives the founder-author badge). */
    isFounderAuthor?: boolean
    /** Question body, as authored markdown. */
    body: string
    /** Which lesson (or "course-wide") this question belongs to. */
    scope: QaQuestionThreadScope
    /** Total answers (top-level + replies) — the SSOT count, independent of how many `answers` are loaded below. */
    replyCount: number
    /** `true` → at least one answer came from the course founder. */
    answeredByFounder?: boolean
    /** Total reactions on the question itself (the question is a comment too). */
    reactionCount: number
    /** The viewer's own reaction on the question, or null. */
    myReaction: QaReactionType | null
    /** Already-loaded top-level answers — this design-system block does no fetching (§13). */
    answers: ReadonlyArray<QaThreadAnswer>
}

/** The signed-in viewer's identity — pass-through shape, matches `src`'s real `QuestionRow` contract 1:1. */
export interface QaQuestionThreadViewer {
    username: string
    avatar?: string
}

/** Props for {@link QaQuestionThread}. */
export interface QaQuestionThreadProps {
    /** The question to render. */
    question: QaQuestionThreadQuestion
    /** Current viewer id — drives own-bubble alignment + accept-answer eligibility; null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the bottom composer's avatar; null when signed out. */
    currentUser: QaQuestionThreadViewer | null
    /** Called after a new answer is posted — bumps the parent roll-up's aggregates. */
    onAnswered?: () => void
    /**
     * `true` → the collapsed row draws its own shimmer mirror and stops accepting
     * presses (there is no real conversation to open yet). See the file header
     * for why this never reaches `SurfaceCard.Pressable`'s own generic flag.
     */
    isSkeleton?: boolean
}

/** The block's own scope → label vocabulary (§14d.1) — never handed in pre-formatted. */
const scopeLabel = (scope: QaQuestionThreadScope): string =>
    scope.kind === "lesson" ? `Lesson: ${scope.lessonTitle}` : "General"

/** The block's own status → label vocabulary (§14d.1). */
const statusLabel = (replyCount: number, answeredByFounder?: boolean): string => {
    if (replyCount <= 0) {
        return "Unanswered"
    }
    return answeredByFounder ? "Instructor answered" : "Answered"
}

/** Options controlling which chips {@link buildQuestionChips} builds. */
interface QaQuestionChipsOptions {
    /** `true` → both chips draw their shimmer mirror. */
    isSkeleton: boolean
    /**
     * `true` → a third, quiet reply-count fact rides beside the two chips. The
     * collapsed row needs it (no `QaConversationHeader` around to say it
     * elsewhere); the expanded question bubble does not, since the header above
     * it already carries the same count.
     */
    includeReplyCount: boolean
}

/**
 * The scope + status chip pair shared by the collapsed row and the expanded
 * question bubble — built ONCE so the two never drift on wording.
 */
const buildQuestionChips = (question: QaQuestionThreadQuestion, options: QaQuestionChipsOptions): Array<ComponentTypeWithSkeleton> => {
    const { isSkeleton, includeReplyCount } = options

    if (isSkeleton) {
        return [
            () => <Chip isSkeleton />,
            () => <Chip isSkeleton />,
        ]
    }

    const items: Array<ComponentTypeWithSkeleton> = [
        () => <Chip tone="default" text={scopeLabel(question.scope)} />,
        () => (
            <Chip
                tone={question.replyCount > 0 ? "success" : "default"}
                text={statusLabel(question.replyCount, question.answeredByFounder)}

            />
        ),
    ]

    if (includeReplyCount && question.replyCount > 0) {
        items.push(() => (
            <Typography
                size="xs"
                color="muted"
                text={`${question.replyCount} replies`}

            />
        ))
    }

    return items
}

/** Apply (or clear) a reaction pick against a `{count, myReaction}` pair, adjusting the count by exactly one. */
const applyReaction = (
    count: number,
    current: QaReactionType | null,
    next: QaReactionType | null,
): { count: number, myReaction: QaReactionType | null } => {
    if (current === next) {
        return { count, myReaction: current }
    }
    const delta = (next != null ? 1 : 0) - (current != null ? 1 : 0)
    return { count: Math.max(0, count + delta), myReaction: next }
}

/**
 * One course-Q&A conversation. See the file header for the full contract, the
 * assumed-sibling-contract risk, and the local-state judgement call.
 *
 * @param props - {@link QaQuestionThreadProps}
 */
const QaQuestionThread = ({
    question,
    currentUserId,
    currentUser,
    onAnswered,
    isSkeleton = false,
}: QaQuestionThreadProps) => {
    // Collapsed ⇄ Expanded is a real TOGGLE local to this instance, exactly like
    // `src`'s own `QuestionRow` (see file header) — never lifted to a prop.
    const [isExpanded, setIsExpanded] = useState(false)

    // Seeded ONCE from props — correct because this block is instantiated once per
    // question (`key={question.id}` at the call site remounts it on real data
    // change), same assumption `src`'s `QuestionRow` makes for its own local state.
    const [answers, setAnswers] = useState<ReadonlyArray<QaThreadAnswer>>(question.answers)
    const [questionReaction, setQuestionReaction] = useState({ count: question.reactionCount, myReaction: question.myReaction })
    const [draft, setDraft] = useState("")

    const isMineQuestion = currentUserId != null && currentUserId === question.author.id
    const askerDisplayName = isMineQuestion ? "You" : question.author.displayName

    // Distinct answerers → the "who joined in" avatar group in the header.
    const participants = useMemo<Array<QaQuestionThreadAuthor>>(() => {
        const seen = new Set<string>()
        const list: Array<QaQuestionThreadAuthor> = []
        for (const answer of answers) {
            if (!seen.has(answer.author.id)) {
                seen.add(answer.author.id)
                list.push(answer.author)
            }
        }
        return list
    }, [answers])

    const onReactQuestion = (type: QaReactionType | null) => {
        setQuestionReaction((prev) => applyReaction(prev.count, prev.myReaction, type))
    }

    const onReactAnswer = (answerId: string, type: QaReactionType | null) => {
        setAnswers((prev) => prev.map((answer) => {
            if (answer.id !== answerId) {
                return answer
            }
            const { count, myReaction } = applyReaction(answer.reactionCount, answer.myReaction, type)
            return { ...answer, reactionCount: count, myReaction }
        }))
    }

    const onAcceptAnswer = (answerId: string, accepted: boolean) => {
        setAnswers((prev) => prev.map((answer) => (answer.id === answerId ? { ...answer, isAcceptedAnswer: accepted } : answer)))
    }

    const canSubmitAnswer = draft.trim().length > 0 && currentUserId != null && currentUser != null

    const onSubmitAnswer = () => {
        if (!canSubmitAnswer || currentUserId == null || currentUser == null) {
            return
        }
        const newAnswer: QaThreadAnswer = {
            id: `local-${answers.length}-${Date.now()}`,
            body: draft.trim(),
            author: { id: currentUserId, displayName: currentUser.username, avatarUrl: currentUser.avatar },
            createdTimeAgo: "Just now",
            reactionCount: 0,
            myReaction: null,
        }
        setAnswers((prev) => [...prev, newAnswer])
        setDraft("")
        onAnswered?.()
    }

    // ── LEAF — Collapsed: a private social inbox row, the whole row pressable ──
    if (!isExpanded) {
        const askerNameRow = (
            <StackH
                gap={3}
                principles={["identity"]}
                at="sm"
                align="center"
                isSkeleton={isSkeleton}

                items={[
                    () =>
                        isSkeleton ? (
                            <Typography size="xs" weight="medium" isSkeleton classNames={["w-1/4"]} />
                        ) : (
                            <>
                                {question.isPinned ? (
                                    <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                ) : null}
                                <Typography size="xs" weight="medium" text={askerDisplayName} />
                                {question.isFounderAuthor ? (
                                    <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                ) : null}
                                <Typography size="xs" color="muted" text={`· ${question.createdTimeAgo}`} />
                            </>
                        ),
                ]}
            />
        )

        const questionPreview = isSkeleton ? (
            <StackV
                gap={2}
                isSkeleton={isSkeleton}

                items={[
                    () => <Typography size="sm" isSkeleton classNames={["w-full"]} />,
                    () => <Typography size="sm" isSkeleton classNames={["w-2/3"]} />,
                ]}
            />
        ) : (
            <div className="[&_p]:m-0 [&_p]:line-clamp-2">
                <MarkdownContent
                    source={question.body}
                    measure="compact"

                />
            </div>
        )

        const previewColumn = (
            <StackV
                gap={2}
                classNames={["min-w-0", "flex-1"]}
                isSkeleton={isSkeleton}

                items={[
                    () => askerNameRow,
                    () => questionPreview,
                    () => (
                        <Cluster
                            gap={3}
                            items={buildQuestionChips(question, { isSkeleton, includeReplyCount: true })}

                        />
                    ),
                ]}
            />
        )

        const collapsedRow = (
            <StackH
                gap={4}
                principles={["content-row"]}
                align="start"
                isSkeleton={isSkeleton}

                items={[
                    () => (
                        <div>
                            <Avatar
                                src={question.author.avatarUrl}
                                name={question.author.displayName}
                                seed={question.author.id}
                                size="sm"
                                isSkeleton={isSkeleton}

                            />
                        </div>
                    ),
                    () => previewColumn,
                    ...(!isSkeleton ? [() => (
                        <span
                            aria-hidden
                            className={cn("size-2 shrink-0 rounded-full", question.replyCount > 0 ? "bg-success" : "bg-warning")}
                        />
                    )] : []),
                ]}
            />
        )

        return (
            <div>
                <div>
                    <SurfaceCard
                        onPress={() => setIsExpanded(true)}
                        isDisabled={isSkeleton}

                        body={() => collapsedRow}
                    />
                </div>
            </div>
        )
    }

    // ── LEAF — Expanded: the full conversation ─────────────────────────────────
    const questionMetaRow = (
        <StackH
            gap={3}
            principles={["identity"]}
            at="sm"
            align="center"
            isSkeleton={isSkeleton}

            items={[
                ({ isSkeleton }: SkeletonProps) => <Typography size="xs" weight="medium" isSkeleton={isSkeleton} text={askerDisplayName} />,
                ...(question.isFounderAuthor ? [() => (
                    <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                )] : []),
                ...(question.isPinned ? [() => (
                    <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                )] : []),
                ({ isSkeleton }: SkeletonProps) => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={question.createdTimeAgo} />,
            ]}
        />
    )

    const questionFooterRow = (
        <StackH
            gap={3}
            principles={["flex-action"]}
            at="sm"
            align="center"
            isSkeleton={isSkeleton}

            items={[
                () => (
                    <Cluster
                        gap={3}
                        items={buildQuestionChips(question, { isSkeleton: false, includeReplyCount: false })}

                    />
                ),
                ({ isSkeleton }: SkeletonProps) => (
                    <QaReactionBar
                        count={questionReaction.count}
                        myReaction={questionReaction.myReaction}
                        onReact={onReactQuestion}
                        isSkeleton={isSkeleton}

                    />
                ),
            ]}
        />
    )

    // the question itself, as the first bubble of the conversation
    const questionBubble = (
        <div className={cn("flex w-full", isMineQuestion ? "justify-end" : "justify-start")}>
            <div className="max-w-[92%]">
                <StackV
                    gap={2}
                    principles={["title-subtitle"]}
                    align={isMineQuestion ? "end" : "stretch"}
                    classNames={["min-w-0"]}
                    isSkeleton={isSkeleton}

                    items={[
                        () => questionMetaRow,
                        ({ isSkeleton }: SkeletonProps) => (
                            <QaChatBubble role={isMineQuestion ? "user" : "assistant"} isSkeleton={isSkeleton}>
                                <div className="[&_p]:m-0">
                                    <MarkdownContent
                                        source={question.body}
                                        measure="compact"

                                    />
                                </div>
                            </QaChatBubble>
                        ),
                        () => questionFooterRow,
                    ]}
                />
            </div>
        </div>
    )

    // answers — QaMessageBubble recurses internally for flattened reply-to-reply
    const answerRows = answers.length === 0 ? (
        <Typography
            size="sm"
            color="muted"
            text="No answers yet — be the first."

        />
    ) : (
        answers.map((answer) => (
            <QaMessageBubble
                key={answer.id}
                answer={answer}
                currentUserId={currentUserId}
                canAccept={isMineQuestion}
                onAcceptAnswer={(accepted: boolean) => onAcceptAnswer(answer.id, accepted)}
                onReact={(type: QaReactionType | null) => onReactAnswer(answer.id, type)}

            />
        ))
    )

    const conversationBody = (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}

            items={[
                () => questionBubble,
                () => answerRows,
            ]}
        />
    )

    const threadPanel = (
        <StackV
            gap={6}
            isSkeleton={isSkeleton}

            items={[
                ({ isSkeleton }: SkeletonProps) => (
                    <QaConversationHeader
                        asker={{
                            id: question.author.id,
                            displayName: question.author.displayName,
                            avatarUrl: question.author.avatarUrl,
                        }}
                        isFounderAsker={question.isFounderAuthor}
                        participants={participants}
                        replyCount={question.replyCount}
                        onCollapse={() => setIsExpanded(false)}
                        isSkeleton={isSkeleton}

                    />
                ),
                () => conversationBody,
                // bottom composer — the only way to answer a course-general question
                ({ isSkeleton }: SkeletonProps) => (
                    <CourseQaComposer
                        mode="plain"
                        currentUser={currentUser ? { name: currentUser.username, avatarSrc: currentUser.avatar } : undefined}
                        value={draft}
                        onValueChange={setDraft}
                        onSubmit={onSubmitAnswer}
                        placeholder="Write your answer…"
                        submitLabel="Send"
                        isSkeleton={isSkeleton}

                    />
                ),
            ]}
        />
    )

    return (
        <div>
            <SurfaceCard body={() => threadPanel} />
        </div>
    )
}

export { QaQuestionThread }
