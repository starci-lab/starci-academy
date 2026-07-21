"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Chip, Link, Spinner, cn } from "@heroui/react"
import { PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { AvatarGroupUser } from "@/components/blocks/identity/AvatarGroup"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { Composer } from "@/components/blocks/feed/Composer"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { ReactionBar } from "@/components/features/community/Discussion/ReactionBar"
import { QaInboxRow } from "../QaInboxRow"
import { QaConversationHeader } from "../QaConversationHeader"
import { QaMessageBubble } from "../QaMessageBubble"
import { useQuestionAnswers } from "./hooks/useQuestionAnswers"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link QuestionRow}. */
export interface QuestionRowProps extends WithClassNames<undefined> {
    /** The question to render. */
    question: CourseQuestionNode
    /** Current viewer id (drives own-bubble alignment + owner-only actions); null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the answer composer avatar; null when signed out. */
    currentUser: { username: string, avatar?: string } | null
    /** Called after an answer is posted/edited/deleted — bumps the parent roll-up's aggregates. */
    onAnswered?: () => void
}

/**
 * One course-Q&A conversation. Collapsed, it is a social {@link QaInboxRow} (asker,
 * preview, scope tag, answered/unanswered status, reply count, status dot). Pressing
 * it expands the FULL conversation inline: a {@link QaConversationHeader} (asker +
 * who-joined-in avatar group), the question itself rendered as the first chat bubble
 * (with its lesson-funnel tag + status), then every answer as a {@link QaMessageBubble}
 * — the viewer's own messages align right, peers + founder align left — and a
 * bottom {@link Composer} to add an answer. This is the ONLY place to answer a
 * course-general question (it has no lesson page of its own).
 *
 * Owns the expand state + the answer thread's data/persistence (via
 * {@link useQuestionAnswers}, gated on `expanded` so nothing fetches until opened).
 *
 * @param props - {@link QuestionRowProps}
 */
export const QuestionRow = ({ question, currentUserId, currentUser, onAnswered, className }: QuestionRowProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // display id (slug) builds the lesson route the question's tag links to
    const displayId = useAppSelector((state) => state.course.displayId)

    // answer-thread toggle; the answers are gated on `expanded` inside the facade hook,
    // so opening the conversation the first time is what triggers the fetch
    const [expanded, setExpanded] = useState(false)
    // draft + in-flight guard for the bottom "add an answer" composer
    const [answerDraft, setAnswerDraft] = useState("")
    const [isPostingAnswer, setIsPostingAnswer] = useState(false)

    const {
        answers,
        isLoadingAnswers,
        answerRepliesByParent,
        onReply,
        onEdit,
        onDelete,
        onReactComment,
        onReactQuestion,
        onAcceptAnswer,
        onLoadReplies,
    } = useQuestionAnswers(question.id, expanded, onAnswered)

    const isMineQuestion = currentUserId !== null && currentUserId === question.author.id
    const questionName = isMineQuestion ? t("courseQa.you") : (question.author.displayName || question.author.username)

    // follow the asker — local optimistic state seeded from the server flag; only the
    // viewer's own toggle mutates it, so no re-sync on list refetch is needed
    const { trigger: triggerSetFollow, isMutating: isFollowPending } = useMutateSetFollowSwr()
    const [isFollowingAsker, setIsFollowingAsker] = useState(question.author.isFollowedByMe)
    // never follow yourself; hide the control when signed out or on your own question
    const canFollowAsker = currentUserId !== null && currentUserId !== question.author.id
    const onToggleFollow = useCallback(async () => {
        const next = !isFollowingAsker
        const result = await triggerSetFollow({ userId: question.author.id, follow: next })
        // commit only on a confirmed success (mirrors the league board's follow flow)
        if (result?.data?.setFollow?.success) {
            setIsFollowingAsker(next)
        }
    }, [isFollowingAsker, triggerSetFollow, question.author.id])

    // distinct answerers → the "who joined in" avatar group in the header
    const participants = useMemo<Array<AvatarGroupUser>>(() => {
        const seen = new Set<string>()
        const list: Array<AvatarGroupUser> = []
        for (const answer of answers) {
            if (!seen.has(answer.author.id)) {
                seen.add(answer.author.id)
                list.push({ username: answer.author.username, avatar: answer.author.avatar })
            }
        }
        return list
    }, [answers])

    /**
     * Route to the source lesson — the funnel back into the course content. A no-op
     * for a course-general question (no `contentId`/`moduleId` to route to).
     */
    const goToLesson = useCallback(() => {
        if (!displayId || !question.contentId || !question.moduleId) {
            return
        }
        router.push(
            pathConfig()
                .locale(locale)
                .course(displayId)
                .learn()
                .module(question.moduleId)
                .content(question.contentId)
                .build(),
        )
    }, [displayId, locale, router, question.contentId, question.moduleId])

    /** Post a new top-level answer via the bottom composer, then clear the draft. */
    const submitAnswer = useCallback(async () => {
        const body = answerDraft.trim()
        if (!body) {
            return
        }
        setIsPostingAnswer(true)
        try {
            await onReply(question.id, body)
            setAnswerDraft("")
        } finally {
            setIsPostingAnswer(false)
        }
    }, [answerDraft, onReply, question.id])

    // collapsed — a flush social inbox row inside the parent's SurfaceListCard
    if (!expanded) {
        return (
            <QaInboxRow
                className={className}
                question={question}
                onOpen={() => setExpanded(true)}
            />
        )
    }

    // expanded — the full conversation, rendered inline in place of the row
    return (
        <div className={cn("flex flex-col gap-4 p-3", className)}>
            <QaConversationHeader
                asker={question.author}
                isFounderAsker={question.isFounderAuthor}
                participants={participants}
                replyCount={question.replyCount}
                onCollapse={() => setExpanded(false)}
                canFollow={canFollowAsker}
                isFollowing={isFollowingAsker}
                onToggleFollow={() => { void onToggleFollow() }}
                isFollowPending={isFollowPending}
            />

            <div className="flex flex-col gap-4">
                {/* the question itself, as the first bubble of the conversation */}
                <div className={cn("flex w-full", isMineQuestion ? "justify-end" : "justify-start")}>
                    <div className={cn("flex min-w-0 max-w-[92%] flex-col gap-1", isMineQuestion && "items-end")}>
                        <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-muted">
                            <span className="font-medium text-foreground">{questionName}</span>
                            {question.isFounderAuthor ? (
                                <span className="inline-flex items-center gap-1 text-accent-soft-foreground">
                                    <SealCheckIcon weight="fill" aria-hidden className="size-3.5 shrink-0" />
                                    {t("courseQa.founderBadge")}
                                </span>
                            ) : null}
                            {question.isPinned ? (
                                <span className="inline-flex items-center gap-1 text-accent-soft-foreground">
                                    <PushPinIcon weight="fill" aria-hidden className="size-3.5 shrink-0" />
                                    {t("courseQa.pinned")}
                                </span>
                            ) : null}
                            <span>{getTimeAgoLabel(getTimeAgoMessage(question.createdAt), t)}</span>
                        </div>

                        <ChatBubble role={isMineQuestion ? "user" : "assistant"}>
                            <MarkdownContent markdown={question.body} className="text-sm [&_p]:m-0" />
                        </ChatBubble>

                        {/* lesson-funnel tag (course content) + answered/unanswered status */}
                        <div className={cn("flex flex-wrap items-center gap-2 px-1", isMineQuestion && "flex-row-reverse")}>
                            {question.contentId ? (
                                <Link onPress={goToLesson} className="cursor-pointer no-underline">
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        className="bg-default text-muted transition-colors hover:text-foreground"
                                    >
                                        {t("courseQa.lessonTag", { title: question.contentTitle ?? "" })}
                                    </Chip>
                                </Link>
                            ) : (
                                <Chip size="sm" variant="soft" className="bg-default text-muted">
                                    {t("courseQa.generalTag")}
                                </Chip>
                            )}
                            {question.replyCount > 0 ? (
                                <Chip size="sm" variant="soft" color="success" className="gap-1">
                                    {question.answeredByFounder ? (
                                        <SealCheckIcon weight="fill" aria-hidden className="size-3.5 shrink-0" />
                                    ) : null}
                                    {question.answeredByFounder
                                        ? t("courseQa.answeredByFounder")
                                        : t("courseQa.statusAnswered")}
                                </Chip>
                            ) : (
                                <Chip size="sm" variant="soft" className="bg-default text-muted">
                                    {t("courseQa.statusUnanswered")}
                                </Chip>
                            )}
                            {/* react to the question itself (6-emotion) — the question is a comment */}
                            <ReactionBar
                                summary={question.reactions}
                                onReact={(type) => { void onReactQuestion(type) }}
                            />
                        </div>
                    </div>
                </div>

                {/* answers — each a chat bubble; own messages right, peers + founder left */}
                {isLoadingAnswers && answers.length === 0 ? (
                    <div className="flex justify-center py-2">
                        <Spinner size="sm" />
                    </div>
                ) : (
                    answers.map((answer) => (
                        <QaMessageBubble
                            key={answer.id}
                            comment={answer}
                            currentUserId={currentUserId}
                            currentUser={currentUser}
                            repliesByParent={answerRepliesByParent}
                            // only the asker may accept, and only a DIRECT answer (this map)
                            canAccept={isMineQuestion}
                            onAcceptAnswer={(commentId, accepted) => { void onAcceptAnswer(commentId, accepted) }}
                            onReply={(parentId, body) => { void onReply(parentId, body) }}
                            onEdit={(commentId, body) => { void onEdit(commentId, body) }}
                            onDelete={(commentId) => { void onDelete(commentId) }}
                            onReactComment={(commentId, type) => { void onReactComment(commentId, type) }}
                            onLoadReplies={onLoadReplies}
                        />
                    ))
                )}
            </div>

            {/* bottom composer — add an answer as a chat message */}
            <Composer
                value={answerDraft}
                onChange={setAnswerDraft}
                onSubmit={() => { void submitAnswer() }}
                isSubmitting={isPostingAnswer}
                avatarSrc={currentUser?.avatar}
                placeholder={t("discussion.replyPlaceholder")}
                submitLabel={t("discussion.reply")}
            />
        </div>
    )
}
