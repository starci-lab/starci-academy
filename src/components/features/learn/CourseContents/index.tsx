"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Accordion,
    Button,
    Card,
    CardContent,
    Chip,
    Input,
    Label,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    CheckCircleIcon,
    CircleIcon,
    FlagIcon,
    LockIcon,
    PlayIcon,
    PuzzlePieceIcon,
} from "@phosphor-icons/react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyCourseOutlineSwr,
} from "@/hooks"
import {
    AsyncContent,
    DifficultyChip,
    LabeledCard,
    ListRow,
    ProgressMeter,
    StatusChip,
} from "@/components/blocks"
import type {
    MyCourseOutlineModule,
} from "@/modules/api"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    isAttempted,
    resolveResumeHref,
    toDifficulty,
    toStatusTone,
} from "./map"
import {
    CourseContentsSkeleton,
} from "./CourseContentsSkeleton"

/** Props for {@link CourseContents}. */
export type CourseContentsProps = WithClassNames<undefined>

/**
 * Filter modules + their lessons by a lower-cased query. A module survives when
 * its own title matches OR it has at least one matching lesson; surviving modules
 * keep only their matching lessons (or all when the module title itself matched).
 * Empty query → unchanged.
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
 * Course contents index — the docs-style "chỉ mục" landing for `/learn`: a
 * progress header (overall completion + a resume action pointing at the viewer's
 * current task) over the full module → lesson → challenge tree (read flags,
 * difficulty, minutes, premium locks overlaid) plus the capstone milestone/task
 * tree. Reads the active course id/displayId from Redux, fetches `myCourseOutline`,
 * and lets each lesson row navigate into the reader.
 *
 * @param props - {@link CourseContents}
 */
export const CourseContents = ({ className }: CourseContentsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseId = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    const courseTitle = useAppSelector((state) => state.course.entity?.title)

    const outlineSwr = useQueryMyCourseOutlineSwr(courseId ?? null)
    const outline = outlineSwr.data

    const [search, setSearch] = useState("")
    const query = search.trim().toLowerCase()
    const modules = useMemo(
        () => (outline ? filterModules(outline.modules, query) : []),
        [outline, query],
    )

    /** Resume target for the "Tiếp tục" action (null when nothing is resolvable). */
    const resumeHref = useMemo(
        () => (outline ? resolveResumeHref(outline.currentTask, outline.modules, locale, displayId) : null),
        [outline, locale, displayId],
    )

    /** Module id to expand on first paint: the one owning the current task, else the first. */
    const initialExpandedModuleId = useMemo(() => {
        if (!outline) {
            return undefined
        }
        const current = outline.currentTask
        if (current) {
            const owning = outline.modules.find((module) =>
                module.lessons.some((lesson) =>
                    lesson.id === current.id
                    || lesson.challenges.some((challenge) => challenge.id === current.id)))
            if (owning) {
                return owning.id
            }
        }
        return outline.modules[0]?.id
    }, [outline])

    /** Navigate into the reader for the chosen lesson. */
    const onSelectLesson = useCallback(
        (lessonId: string, moduleId: string) => {
            if (!displayId) {
                return
            }
            router.push(
                pathConfig().locale(locale).course(displayId).learn().module(moduleId).content(lessonId).build(),
            )
        },
        [router, locale, displayId],
    )

    /** Open the resume target. */
    const onResume = useCallback(() => {
        if (resumeHref) {
            router.push(resumeHref)
        }
    }, [router, resumeHref])

    return (
        <div className={cn("p-3", className)}>
            <AsyncContent
                isLoading={!outlineSwr.data && !outlineSwr.error}
                skeleton={<CourseContentsSkeleton />}
                isEmpty={!outline}
                emptyContent={{
                    title: t("courseContents.empty"),
                }}
                error={!outlineSwr.data ? outlineSwr.error : undefined}
                errorContent={{
                    title: t("courseContents.error"),
                    onRetry: () => { void outlineSwr.mutate() },
                    retryLabel: t("courseContents.retry"),
                }}
            >
                {outline ? (
                    <div className="flex flex-col gap-6">
                        {/* progress header: title + completion meter + counts + resume */}
                        <div className="flex flex-col gap-3">
                            <Typography type="h3" weight="bold">
                                {courseTitle ?? outline.course.title}
                            </Typography>
                            <Card>
                                <CardContent className="flex flex-col gap-4">
                                    <ProgressMeter
                                        value={outline.progress.completionPercent}
                                        label={t("courseContents.completion")}
                                        showValue
                                    />
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Typography type="body-sm" color="muted">
                                            {t("courseContents.lessonsStat", {
                                                read: outline.progress.lessonsRead,
                                                total: outline.progress.lessonsTotal,
                                            })}
                                        </Typography>
                                        <Typography type="body-sm" color="muted">
                                            {t("courseContents.challengesStat", {
                                                done: outline.progress.challengesCompleted,
                                                total: outline.progress.challengesTotal,
                                            })}
                                        </Typography>
                                        <Typography type="body-sm" color="muted">
                                            {t("courseContents.tasksStat", {
                                                done: outline.progress.tasksCompleted,
                                                total: outline.progress.tasksTotal,
                                            })}
                                        </Typography>
                                    </div>
                                    {resumeHref ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="self-start"
                                            onPress={onResume}
                                        >
                                            <PlayIcon aria-hidden focusable="false" className="size-5" />
                                            {t("courseContents.resume")}
                                        </Button>
                                    ) : (
                                        <Typography type="body-sm" color="muted">
                                            {t("courseContents.allDone")}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* search over the lesson collection */}
                        <TextField>
                            <Input
                                aria-label={t("courseContents.searchAria")}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t("courseContents.searchPlaceholder")}
                            />
                        </TextField>

                        {/* module → lesson → challenge tree */}
                        {modules.length > 0 ? (
                            <Accordion
                                variant="surface"
                                defaultExpandedKeys={initialExpandedModuleId
                                    ? new Set([initialExpandedModuleId])
                                    : undefined}
                            >
                                {modules.map((module) => (
                                    <Accordion.Item key={module.id} id={module.id} aria-label={module.title}>
                                        <Accordion.Heading>
                                            <Accordion.Trigger>
                                                <div className="flex w-full items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Typography type="body-sm" weight="semibold" truncate>
                                                            {module.title}
                                                        </Typography>
                                                        {module.isPremium ? (
                                                            <LockIcon
                                                                aria-label={t("courseContents.premium")}
                                                                focusable="false"
                                                                className="size-5 text-muted"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <Typography type="body-xs" color="muted">
                                                            {t("courseContents.lessonCount", {
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
                                                                onPress={() => onSelectLesson(lesson.id, module.id)}
                                                                meta={(
                                                                    <>
                                                                        {lesson.difficulty ? (
                                                                            <DifficultyChip difficulty={toDifficulty(lesson.difficulty)} />
                                                                        ) : null}
                                                                        {lesson.isPremium ? (
                                                                            <LockIcon
                                                                                aria-label={t("courseContents.premium")}
                                                                                focusable="false"
                                                                                className="size-5 text-muted"
                                                                            />
                                                                        ) : null}
                                                                        {lesson.isRead ? (
                                                                            <CheckCircleIcon
                                                                                aria-label={t("courseContents.read")}
                                                                                focusable="false"
                                                                                className="size-5 text-success"
                                                                            />
                                                                        ) : (
                                                                            <CircleIcon
                                                                                aria-label={t("courseContents.unread")}
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
                                                                                        {t(`courseContents.status.${challenge.status}`)}
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
                            <Typography type="body-sm" color="muted" align="center">
                                {t("courseContents.noMatch")}
                            </Typography>
                        )}

                        {/* capstone milestones → tasks (hidden while searching) */}
                        {!query && outline.milestones.length > 0 ? (
                            <LabeledCard
                                label={t("courseContents.milestones")}
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
                                                                            {t(`courseContents.taskType.${task.type}`)}
                                                                        </Chip.Label>
                                                                    </Chip>
                                                                ) : null}
                                                                <Typography type="body-xs" color="muted">
                                                                    {`${task.lastScore}/${task.maxScore}`}
                                                                </Typography>
                                                                {task.completed ? (
                                                                    <CheckCircleIcon
                                                                        aria-label={t("courseContents.done")}
                                                                        focusable="false"
                                                                        className="size-5 text-success"
                                                                    />
                                                                ) : (
                                                                    <CircleIcon
                                                                        aria-label={t("courseContents.notDone")}
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
