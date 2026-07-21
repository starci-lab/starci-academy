"use client"

import React from "react"
import { Chip, cn } from "@heroui/react"
import {
    ChatCircleIcon,
    PushPinIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { CourseQuestionNode } from "@/modules/api/graphql/queries/types/course-questions"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link QaInboxRow}. */
export interface QaInboxRowProps extends WithClassNames<undefined> {
    /** The question to preview. */
    question: CourseQuestionNode
    /** Open the full conversation (expands the thread inline). */
    onOpen: () => void
}

/**
 * One collapsed row in the course-Q&A social inbox: the asker (avatar + name +
 * founder badge + relative time), a two-line preview of the question, a scope tag
 * (a static "Bài: …" / "Chung" tag), an answered/unanswered status badge, the reply
 * count, and a status dot for scanning the list at a glance. The WHOLE row is a
 * single press target that opens the conversation — the lesson-funnel link lives on
 * the question bubble inside the opened thread, so the collapsed row stays a clean,
 * unambiguous button (no nested interactive controls).
 *
 * Presentational: all data arrives via props; opening is delegated to `onOpen`.
 *
 * @param props - {@link QaInboxRowProps}
 */
export const QaInboxRow = ({ question, onOpen, className }: QaInboxRowProps) => {
    const t = useTranslations()
    const displayName = question.author.displayName || question.author.username
    const isAnswered = question.replyCount > 0

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpen()
                }
            }}
            className={cn(
                "flex w-full cursor-pointer items-start gap-3 p-3 text-left outline-none transition-colors hover:bg-default focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                className,
            )}
        >
            <UserAvatar
                size="sm"
                username={question.author.username}
                avatar={question.author.avatar}
                seed={question.author.username}
                className="shrink-0"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* asker + relative time */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    {question.isPinned ? (
                        <PushPinIcon
                            weight="fill"
                            aria-label={t("courseQa.pinned")}
                            className="size-3.5 shrink-0 text-accent-soft-foreground"
                        />
                    ) : null}
                    <span className="font-medium text-foreground">{displayName}</span>
                    {question.isFounderAuthor ? (
                        <SealCheckIcon
                            weight="fill"
                            aria-label={t("courseQa.founderBadge")}
                            className="size-3.5 shrink-0 text-accent-soft-foreground"
                        />
                    ) : null}
                    <span>· {getTimeAgoLabel(getTimeAgoMessage(question.createdAt), t)}</span>
                </div>

                {/* two-line preview */}
                <MarkdownContent
                    markdown={question.body}
                    className="text-sm text-foreground [&_p]:m-0 [&_p]:line-clamp-2"
                />

                {/* scope tag + status + reply count */}
                <div className="flex flex-wrap items-center gap-2">
                    <Chip size="sm" variant="soft" className="bg-default text-muted">
                        {question.contentId
                            ? t("courseQa.lessonTag", { title: question.contentTitle ?? "" })
                            : t("courseQa.generalTag")}
                    </Chip>

                    {isAnswered ? (
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

                    {isAnswered ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <ChatCircleIcon aria-hidden className="size-4" />
                            {t("courseQa.replyCount", { count: question.replyCount })}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* status dot — scan the list without opening each thread */}
            <span
                aria-hidden
                className={cn(
                    "mt-2 size-2 shrink-0 rounded-full",
                    isAnswered ? "bg-success" : "bg-warning",
                )}
            />
        </div>
    )
}
