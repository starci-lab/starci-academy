"use client"

import React, {
    useMemo,
} from "react"
import {
    Accordion,
    Chip,
    Label,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CheckCircleIcon,
    CircleIcon,
    FlagIcon,
    LockIcon,
    PuzzlePieceIcon,
} from "@phosphor-icons/react"
import {
    useQueryMyCourseOutlineSwr,
} from "@/hooks"
import {
    AsyncContent,
    DifficultyChip,
    EmptyContent,
    LabeledCard,
    ListRow,
    Skeleton,
    StatusChip,
} from "@/components/blocks"
import {
    fromGlobalId,
} from "@/modules/utils"
import type {
    MyCourseOutlineModule,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useSelectedCourse,
} from "../hooks/useSelectedCourse"
import {
    isAttempted,
    toDifficulty,
    toStatusTone,
} from "./map"

/** Props for {@link CourseOutline}. */
export interface CourseOutlineProps extends WithClassNames<undefined> {
    /**
     * Lower-cased trimmed search query. Modules are kept when their title matches
     * or any of their lessons match; their lesson list is filtered to matches.
     */
    search?: string
}

/** Number of placeholder accordion modules shown while the outline loads. */
const SKELETON_MODULE_COUNT = 3

/** Number of placeholder lesson rows shown per skeleton module. */
const SKELETON_LESSON_COUNT = 3

/**
 * Filter modules + their lessons by a search query. A module survives when its
 * own title matches OR it has at least one matching lesson; surviving modules keep
 * only their matching lessons (or all of them when the module title itself
 * matched). Empty query → unchanged.
 *
 * @param modules - The course's modules.
 * @param query - Lower-cased trimmed search query.
 * @returns The filtered modules.
 */
const filterModules = (
    modules: Array<MyCourseOutlineModule>,
    query: string,
): Array<MyCourseOutlineModule> => {
    if (!query) {
        return modules
    }
    const result: Array<MyCourseOutlineModule> = []
    for (const module of modules) {
        const moduleMatches = module.title.toLowerCase().includes(query)
        const lessons = moduleMatches
            ? module.lessons
            : module.lessons.filter((lesson) => lesson.title.toLowerCase().includes(query))
        if (moduleMatches || lessons.length > 0) {
            result.push({ ...module, lessons })
        }
    }
    return result
}

/**
 * Course "Theo chương" view: the full curriculum of ONE enrolled course as a
 * module → lesson → challenge accordion tree (with read flags + challenge/task
 * progress overlaid) plus the milestone/task tree. Reads the selected course
 * globalId from `?course=`, decodes it to the raw id, fetches `myCourseOutline`,
 * and filters the tree by the shared `search`. Owns no header / back link / overall
 * progress — its parent ({@link import("../CourseDetail").CourseDetail}) does.
 *
 * @param props - {@link CourseOutlineProps}
 */
export const CourseOutline = ({
    search = "",
    className,
}: CourseOutlineProps) => {
    const t = useTranslations()
    const { selectedCourse } = useSelectedCourse()

    // decode the selected course globalId (CourseEntity:<id>) → raw id for the query
    const rawCourseId = selectedCourse ? fromGlobalId(selectedCourse)?.id ?? null : null
    const outlineSwr = useQueryMyCourseOutlineSwr(rawCourseId)
    const outline = outlineSwr.data

    const query = search.trim().toLowerCase()
    const modules = useMemo(
        () => (outline ? filterModules(outline.modules, query) : []),
        [outline, query],
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <AsyncContent
                isLoading={!outlineSwr.data && !outlineSwr.error}
                skeleton={(
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: SKELETON_MODULE_COUNT }).map((_unused, moduleIndex) => (
                            <div key={moduleIndex} className="flex flex-col gap-3">
                                <Skeleton.Typography type="body-sm" width="1/3" />
                                {Array.from({ length: SKELETON_LESSON_COUNT }).map((_lessonUnused, lessonIndex) => (
                                    <Skeleton.ListRow key={lessonIndex} withTrailing />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                isEmpty={!outline}
                emptyContent={{
                    title: t("profileSettings.learning.outline.empty"),
                }}
                error={!outlineSwr.data ? outlineSwr.error : undefined}
                errorContent={{
                    title: t("profileSettings.learning.outline.error"),
                    onRetry: () => { void outlineSwr.mutate() },
                    retryLabel: t("profileSettings.learning.loadMore"),
                }}
            >
                {outline ? (
                    <div className="flex flex-col gap-6">
                        {/* Modules → lessons → challenges (filtered by search) */}
                        {modules.length > 0 ? (
                            <Accordion variant="surface">
                                {modules.map((module) => (
                                    <Accordion.Item key={module.id} aria-label={module.title}>
                                        <Accordion.Heading>
                                            <Accordion.Trigger>
                                                <div className="flex w-full items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Typography type="body-sm" weight="semibold" truncate>
                                                            {module.title}
                                                        </Typography>
                                                        {module.isPremium ? (
                                                            <LockIcon
                                                                aria-label={t("profileSettings.learning.outline.premium")}
                                                                focusable="false"
                                                                className="size-5 text-muted"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <Typography type="body-xs" color="muted">
                                                            {t("profileSettings.learning.outline.lessonCount", {
                                                                count: module.lessons.length,
                                                            })}
                                                        </Typography>
                                                        <Accordion.Indicator />
                                                    </div>
                                                </div>
                                            </Accordion.Trigger>
                                        </Accordion.Heading>
                                        <Accordion.Panel>
                                            <Accordion.Body>
                                                <div className="flex flex-col gap-2">
                                                    {module.lessons.map((lesson) => (
                                                        <div key={lesson.id} className="flex flex-col gap-2">
                                                            <ListRow
                                                                title={lesson.title}
                                                                subtitle={t("content.minutesRead", {
                                                                    minutes: lesson.minutesRead,
                                                                })}
                                                                meta={(
                                                                    <>
                                                                        {lesson.difficulty ? (
                                                                            <DifficultyChip difficulty={toDifficulty(lesson.difficulty)} />
                                                                        ) : null}
                                                                        {lesson.isPremium ? (
                                                                            <LockIcon
                                                                                aria-label={t("profileSettings.learning.outline.premium")}
                                                                                focusable="false"
                                                                                className="size-5 text-muted"
                                                                            />
                                                                        ) : null}
                                                                        {lesson.isRead ? (
                                                                            <CheckCircleIcon
                                                                                aria-label={t("profileSettings.learning.outline.read")}
                                                                                focusable="false"
                                                                                className="size-5 text-success"
                                                                            />
                                                                        ) : (
                                                                            <CircleIcon
                                                                                aria-label={t("profileSettings.learning.outline.unread")}
                                                                                focusable="false"
                                                                                className="size-5 text-muted"
                                                                            />
                                                                        )}
                                                                    </>
                                                                )}
                                                            />
                                                            {lesson.challenges.length > 0 ? (
                                                                <div className="flex flex-col gap-2 pl-6">
                                                                    {lesson.challenges.map((challenge) => (
                                                                        <ListRow
                                                                            key={challenge.id}
                                                                            leading={(
                                                                                <PuzzlePieceIcon
                                                                                    aria-hidden
                                                                                    focusable="false"
                                                                                    className="size-5 text-muted"
                                                                                />
                                                                            )}
                                                                            title={challenge.title}
                                                                            meta={(
                                                                                <>
                                                                                    <DifficultyChip difficulty={toDifficulty(challenge.difficulty)} />
                                                                                    <StatusChip tone={toStatusTone(challenge.status)}>
                                                                                        {t(`profileSettings.learning.outline.status.${challenge.status}`)}
                                                                                    </StatusChip>
                                                                                    {isAttempted(challenge.status) ? (
                                                                                        <Typography type="body-xs" color="muted">
                                                                                            {`${challenge.lastScore}/${challenge.maxScore}`}
                                                                                        </Typography>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        ) : (
                            // tree empty under the current search
                            <EmptyContent title={t("profileSettings.learning.outline.noMatch")} />
                        )}

                        {/* Milestones → tasks (capstone / "Dự án") — hidden while searching */}
                        {!query && outline.milestones.length > 0 ? (
                            <LabeledCard
                                label={t("profileSettings.learning.outline.milestones")}
                                icon={<FlagIcon aria-hidden focusable="false" className="size-5" />}
                            >
                                <div className="flex flex-col gap-4">
                                    {outline.milestones.map((milestone) => (
                                        <div key={milestone.id} className="flex flex-col gap-2">
                                            <Label>{milestone.title}</Label>
                                            <div className="flex flex-col gap-2">
                                                {milestone.tasks.map((task) => (
                                                    <ListRow
                                                        key={task.id}
                                                        title={task.title}
                                                        meta={(
                                                            <>
                                                                {task.type ? (
                                                                    <Chip size="sm" variant="soft">
                                                                        <Chip.Label>
                                                                            {t(`profileSettings.learning.outline.taskType.${task.type}`)}
                                                                        </Chip.Label>
                                                                    </Chip>
                                                                ) : null}
                                                                <Typography type="body-xs" color="muted">
                                                                    {`${task.lastScore}/${task.maxScore}`}
                                                                </Typography>
                                                                {task.completed ? (
                                                                    <CheckCircleIcon
                                                                        aria-label={t("profileSettings.learning.outline.done")}
                                                                        focusable="false"
                                                                        className="size-5 text-success"
                                                                    />
                                                                ) : (
                                                                    <CircleIcon
                                                                        aria-label={t("profileSettings.learning.outline.notDone")}
                                                                        focusable="false"
                                                                        className="size-5 text-muted"
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </LabeledCard>
                        ) : null}
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}
