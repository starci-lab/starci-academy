"use client"

import React, { useState } from "react"
import { Card, Chip, Link, Spinner, Typography } from "@heroui/react"
import {
    ChatCircleIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { CommentComposer } from "@/components/features/community/Discussion/CommentComposer"
import { CommentItem } from "@/components/features/community/Discussion/CommentItem"
import { useQuestionAnswers } from "./hooks/useQuestionAnswers"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link QuestionRow}. */
export interface QuestionRowProps extends WithClassNames<undefined> {
    /** The question to render. */
    question: CourseQuestionNode
    /** Current viewer id (drives owner-only edit/delete on answers); null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the answer composer avatar; null when signed out. */
    currentUser: { username: string, avatar?: string } | null
    /** Called after an answer is posted/edited/deleted — bumps the parent roll-up's aggregates. */
    onAnswered?: () => void
}

/**
 * One course-Q&A row: the question body (markdown, clamped), the asker (avatar +
 * name + founder badge + relative time), a scope tag — either a lesson tag linking
 * back to the source lesson (the course funnel — every item is a door into a lesson)
 * or, for a course-general "hỏi chung khóa" question, a static "Chung" tag — a
 * status chip (answered — success, + founder-answered badge — vs unanswered — muted),
 * and an expandable answer thread: click the reply count to load + view existing
 * answers (reusing {@link CommentItem} — full owner edit/delete/react/reply-to-reply,
 * exactly like the per-lesson discussion) and post a new one right here, with no need
 * to leave the roll-up (this is the ONLY place to answer a course-general question,
 * since it has no lesson page of its own).
 *
 * @param props - {@link QuestionRowProps}
 */
export const QuestionRow = ({ question, currentUserId, currentUser, onAnswered, className }: QuestionRowProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // display id (slug) builds the lesson route the tag links to
    const displayId = useAppSelector((state) => state.course.displayId)

    const displayName = question.author.displayName || question.author.username

    // answer-thread toggle; the answers themselves are gated on `expanded` inside
    // the facade hook, so opening the thread the first time is what triggers the fetch
    const [expanded, setExpanded] = useState(false)
    const {
        answers,
        isLoadingAnswers,
        answerRepliesByParent,
        onReply,
        onEdit,
        onDelete,
        onReactComment,
        onLoadReplies,
    } = useQuestionAnswers(question.id, expanded, onAnswered)

    /** Toggle the answer thread. */
    const toggleExpanded = () => {
        setExpanded((prev) => !prev)
    }

    /**
     * Route to the source lesson — the funnel back into the course content. A no-op
     * for a course-general question (no `contentId`/`moduleId` to route to).
     */
    const goToLesson = () => {
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
    }

    return (
        <Card className={className}>
            <div className="flex flex-col gap-3">
                {/* asker: avatar + name (+ founder badge) + relative time — the
                    cell itself is pure-presentational, so the whole row is wrapped
                    in a real anchor here to make it pressable (→ profile) */}
                <Link
                    href={pathConfig().locale(locale).profile(question.author.username).build()}
                    className="flex min-w-0 items-center text-foreground no-underline"
                >
                    <UserCell
                        username={question.author.username}
                        displayName={displayName}
                        avatar={question.author.avatar}
                        trailing={(
                            <div className="flex items-center gap-1">
                                {question.isFounderAuthor ? (
                                    <SealCheckIcon
                                        weight="fill"
                                        aria-label={t("courseQa.founderBadge")}
                                        className="size-3.5 shrink-0 text-accent-soft-foreground"
                                    />
                                ) : null}
                                <Typography type="body-xs" color="muted">
                                    {getTimeAgoLabel(getTimeAgoMessage(question.createdAt), t)}
                                </Typography>
                            </div>
                        )}
                    />
                </Link>

                {/* question body — markdown, compact, clamped to 2 lines */}
                <MarkdownContent
                    markdown={question.body}
                    className="[&_p]:m-0 [&_p]:line-clamp-2"
                />

                {/* meta row: lesson tag (funnel link) OR "Chung" tag + status + answer toggle */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* lesson tag — links back into the course content (the funnel); a
                        course-general question ("hỏi chung khóa") has no lesson to link
                        to, so it gets a static, non-clickable "Chung" tag instead */}
                    {question.contentId ? (
                        <Link
                            onPress={goToLesson}
                            className="cursor-pointer no-underline"
                        >
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

                    {/* status — answered (success + optional founder badge) vs unanswered (muted) */}
                    {question.replyCount > 0 ? (
                        <Chip size="sm" variant="soft" color="success" className="gap-1">
                            {question.answeredByFounder ? (
                                <SealCheckIcon
                                    weight="fill"
                                    aria-hidden
                                    className="size-3.5 shrink-0"
                                />
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

                    {/* answer-thread toggle — the only entry point to answer a
                        course-general question (it has no lesson page of its own) */}
                    <Link
                        className="flex cursor-pointer items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
                        onPress={toggleExpanded}
                    >
                        <ChatCircleIcon aria-hidden className="size-4" />
                        {question.replyCount > 0
                            ? t("courseQa.replyCount", { count: question.replyCount })
                            : t("discussion.reply")}
                    </Link>
                </div>

                {/* answer thread — existing answers (full CommentItem tree: owner
                    edit/delete/react/reply-to-reply) + a composer to post a new one */}
                {expanded ? (
                    <div className="flex flex-col gap-3 border-t border-default pt-3">
                        {isLoadingAnswers ? (
                            <div className="flex justify-center py-2">
                                <Spinner size="sm" />
                            </div>
                        ) : answers.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {answers.map((answer) => (
                                    <CommentItem
                                        key={answer.id}
                                        comment={answer}
                                        currentUserId={currentUserId}
                                        depth={0}
                                        repliesByParent={answerRepliesByParent}
                                        onReply={(parentId, body) => { void onReply(parentId, body) }}
                                        onEdit={(commentId, body) => { void onEdit(commentId, body) }}
                                        onDelete={(commentId) => { void onDelete(commentId) }}
                                        onReactComment={(commentId, type) => { void onReactComment(commentId, type) }}
                                        onLoadReplies={onLoadReplies}
                                    />
                                ))}
                            </div>
                        ) : null}
                        <CommentComposer
                            placeholder={t("discussion.replyPlaceholder")}
                            submitLabel={t("discussion.reply")}
                            currentUser={currentUser}
                            onSubmit={(body) => { void onReply(question.id, body) }}
                        />
                    </div>
                ) : null}
            </div>
        </Card>
    )
}
