"use client"

import React from "react"
import { Link, Typography, cn } from "@heroui/react"
import { BookOpenIcon, SparkleIcon, TargetIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { useContentAiChatScopeStore } from "@/hooks/zustand/contentAiChatScope/store"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ContentAiScopePill}. */
export type ContentAiScopePillProps = WithClassNames<undefined>

/**
 * What the next answer will be grounded on — the chat's IDENTITY, shown in the
 * panel header (rail + drawer) rather than above the composer.
 *
 * It sits in the header because the header used to repeat the same thing as a
 * plain title: the rail said "DevOps Mastery" up top and the pill said
 * "Cả khoá · DevOps Mastery" at the bottom. One surface, one identity — and
 * putting it where the title was keeps the scope SWITCH next to the name it
 * changes, instead of two screen-heights apart.
 *
 * A container by design (reads store + redux itself): the same pill renders in
 * two different hosts, and prop-drilling four values through both would drift.
 *
 * @param props - {@link ContentAiScopePillProps}
 * @see Story: .storybook/stories/features/learn/ContentAiChat/ContentAiScopePill.stories
 */
export const ContentAiScopePill = ({ className }: ContentAiScopePillProps) => {
    const t = useTranslations()
    const contentId = useAppSelector((state) => state.content.id)
    const contentTitle = useAppSelector((state) => state.content.entity?.title)
    const taskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const taskTitle = useAppSelector((state) => state.milestone.selectedTaskDetail?.title)
    const foundationId = useAppSelector((state) => state.foundation.foundationId)
    const foundationTitle = useAppSelector((state) => state.foundation.entity?.title)
    const courseTitle = useAppSelector((state) => state.course.entity?.title)
    const { prefersCourseScope, setPrefersCourseScope } = useContentAiChatScopeStore()

    // mirrors the scope rule in `ContentAiChat`: a lesson grounds on itself unless
    // widened; with no lesson open the surface falls to its next grounding
    // (capstone task → foundation → whole course)
    const scope = prefersCourseScope
        ? "course"
        : contentId
            ? "content"
            : taskId
                ? "task"
                : foundationId
                    ? "foundation"
                    : "course"
    const isCourseScope = scope === "course"
    // a task uses a distinct 🎯 icon; a lesson and a foundation (which reads like a
    // single lesson) share the 📖 book
    const NonCourseIcon = scope === "task" ? TargetIcon : BookOpenIcon
    // what the next answer grounds on, worded per scope
    const scopeTitle = scope === "course"
        ? t("contentAi.context.wholeCourse", { course: courseTitle ?? "" })
        : scope === "task"
            ? taskTitle
            : scope === "foundation"
                ? foundationTitle
                : contentTitle

    return (
        <div
            className={cn(
                "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-1.5",
                isCourseScope
                    ? "border-info bg-info-soft"
                    : "border-accent bg-accent-soft",
                className,
            )}
        >
            {isCourseScope ? (
                <SparkleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-info-soft-foreground" />
            ) : (
                <NonCourseIcon aria-hidden focusable="false" className="size-4 shrink-0 text-accent-soft-foreground" />
            )}
            <span className="flex min-w-0 flex-1 flex-col">
                <Typography type="body-xs" color="muted">
                    {t("contentAi.context.label")}
                </Typography>
                <Typography type="body-sm" className="truncate" weight="medium">
                    {scopeTitle}
                </Typography>
            </span>
            {/* only offered while a lesson EXISTS to widen from / narrow back to */}
            {contentId ? (
                <Link
                    onPress={() => setPrefersCourseScope(!prefersCourseScope)}
                    className="shrink-0 cursor-pointer text-xs font-medium text-accent-soft-foreground"
                >
                    {isCourseScope
                        ? t("contentAi.context.backToLesson")
                        : t("contentAi.context.askWholeCourse")}
                </Link>
            ) : null}
        </div>
    )
}
