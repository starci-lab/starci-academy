"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Accordion,
    Button,
    Input,
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
    ListRow,
    ProgressMeter,
    StatusChip,
} from "@/components/blocks"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
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
 * Course learn home — the focused "continue learning" hub for `/learn`. A single
 * reading column: TIER-1 breadcrumb → TIER-2 header (course title + one honest
 * completion meter + the single primary "Continue" action) → TIER-3 the content
 * index (module → lesson → challenge tree, the current module expanded). The other
 * learn surfaces (leaderboard, flashcards, practice…) live behind the sidebar — this
 * page deliberately does NOT duplicate them. Reads the active course id/displayId
 * from Redux, fetches `myCourseOutline`, and lets each lesson row open the reader.
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

    /**
     * The pointer the "Tiếp tục học" action resumes. CONTENT-FIRST: the next unread
     * lesson / uncompleted challenge (`nextContentTask`), so the content home never
     * sends a learner with unread lessons into the capstone. Only once all content is
     * done (`nextContentTask` null) does it fall back to the capstone task — the one
     * moment the personal project is the natural next step.
     */
    const resumePointer = useMemo(
        () => outline?.nextContentTask ?? outline?.currentTask ?? null,
        [outline],
    )

    /** Whether the resume target is the capstone (all content done) rather than content. */
    const isCapstoneResume = resumePointer?.kind === "milestoneTask"

    /** Resume href for the active pointer (null when nothing is resolvable). */
    const resumeHref = useMemo(
        () => (outline && resumePointer
            ? resolveResumeHref(resumePointer, outline.modules, locale, displayId)
            : null),
        [outline, resumePointer, locale, displayId],
    )

    /** Title of the resume target (walk the tree by id) for the continue card. */
    const resumeTitle = useMemo(() => {
        if (!outline || !resumePointer) {
            return null
        }
        if (resumePointer.kind === "milestoneTask") {
            for (const milestone of outline.milestones) {
                const task = milestone.tasks.find((entry) => entry.id === resumePointer.id)
                if (task) {
                    return task.title
                }
            }
            return null
        }
        for (const module of outline.modules) {
            if (resumePointer.kind === "lesson") {
                const lesson = module.lessons.find((entry) => entry.id === resumePointer.id)
                if (lesson) {
                    return lesson.title
                }
                continue
            }
            for (const lesson of module.lessons) {
                const challenge = lesson.challenges.find((entry) => entry.id === resumePointer.id)
                if (challenge) {
                    return challenge.title
                }
            }
        }
        return null
    }, [outline, resumePointer])

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
                skeleton={<CourseContentsSkeleton className="mx-auto max-w-3xl" />}
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
                    <div className="mx-auto flex max-w-3xl flex-col gap-6">
                        {/* region A — identity + the one primary action (continue), a gap-3 cluster;
                            the outer gap-6 sets it apart from the browse region below. */}
                        <div className="flex flex-col gap-3">
                            <LearnBreadcrumb />
                            <Typography type="h3" weight="bold">
                                {courseTitle ?? outline.course.title}
                            </Typography>

                            {/* continue + progress — flat (no card frame), the honest unified meter */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 flex-col gap-0">
                                        <Typography type="body-xs" color="muted">
                                            {resumeHref
                                                ? (isCapstoneResume
                                                    ? t("courseContents.capstoneEyebrow")
                                                    : t("courseContents.continueEyebrow"))
                                                : t("courseContents.allDone")}
                                        </Typography>
                                        {resumeHref && resumeTitle ? (
                                            <Typography type="body" weight="semibold" truncate title={resumeTitle}>
                                                {resumeTitle}
                                            </Typography>
                                        ) : null}
                                    </div>
                                    {resumeHref ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="shrink-0"
                                            onPress={onResume}
                                        >
                                            <PlayIcon aria-hidden focusable="false" className="size-5" />
                                            {isCapstoneResume
                                                ? t("courseContents.resumeCapstone")
                                                : t("courseContents.resume")}
                                        </Button>
                                    ) : null}
                                </div>
                                <ProgressMeter
                                    value={outline.progress.completionPercent}
                                    max={100}
                                    label={t("courseContents.completion")}
                                    showValue
                                />
                                <Typography type="body-xs" color="muted">
                                    {[
                                        t("courseContents.lessonsStat", {
                                            read: outline.progress.lessonsRead,
                                            total: outline.progress.lessonsTotal,
                                        }),
                                        t("courseContents.challengesStat", {
                                            done: outline.progress.challengesCompleted,
                                            total: outline.progress.challengesTotal,
                                        }),
                                        ...(outline.progress.tasksTotal > 0
                                            ? [t("courseContents.tasksStat", {
                                                done: outline.progress.tasksCompleted,
                                                total: outline.progress.tasksTotal,
                                            })]
                                            : []),
                                    ].join(" · ")}
                                </Typography>
                            </div>
                        </div>

                        {/* region B — browse: search + content index, a gap-3 cluster */}
                        <div className="flex flex-col gap-3">
                            {/* search over the lesson collection */}
                            <TextField variant="secondary">
                                <Input
                                    aria-label={t("courseContents.searchAria")}
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={t("courseContents.searchPlaceholder")}
                                />
                            </TextField>

                            {/* tier-3 content index: module → lesson → challenge tree */}
                            {modules.length > 0 ? (
                                <Accordion
                                    variant="surface"
                                    defaultExpandedKeys={initialExpandedModuleId
                                        ? new Set([initialExpandedModuleId])
                                        : undefined}
                                >
                                    {modules.map((module) => (
                                        <Accordion.Item key={module.id} id={module.id} aria-label={module.title}>
                                            <Accordion.Heading className="min-w-0">
                                                <Accordion.Trigger className="min-w-0 w-full">
                                                    <div className="flex w-full min-w-0 items-center justify-between gap-3">
                                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                                            <Typography
                                                                type="body-sm"
                                                                weight="semibold"
                                                                truncate
                                                                title={module.title}
                                                            >
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
                        </div>
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}
