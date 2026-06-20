"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    Accordion,
    Button,
    Input,
    Label,
    ScrollShadow,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    PlayIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyCourseOutlineSwr,
} from "@/hooks"
import {
    AsyncContent,
    ContentMapRow,
    ProgressMeter,
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
    ContentMapSkeleton,
} from "./ContentMapSkeleton"

/** Props for {@link ContentMap}. */
export type ContentMapProps = WithClassNames<undefined>

/**
 * Filter modules + their lessons by a lower-cased query (module title match keeps
 * all its lessons; otherwise only matching lessons survive). Empty query → unchanged.
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
 * Content-map rail — the lean docs-style course navigation tree shown to the left
 * while reading: per module an accordion header with a thin read-progress bar, and
 * per lesson a compact row (read marker + title + minutes, premium lock). The
 * active lesson is highlighted and its module auto-expanded. Reads the active
 * course/lesson from Redux and the progress-overlaid tree from `myCourseOutline`.
 *
 * Positioning (sticky / width / scroll) is supplied by the caller via `className`
 * so the same rail serves the desktop left rail and the mobile drawer.
 *
 * @param props - {@link ContentMap}
 */
export const ContentMap = ({ className }: ContentMapProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseId = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    const activeContentId = useAppSelector((state) => state.content.id)

    const outlineSwr = useQueryMyCourseOutlineSwr(courseId ?? null)
    const outline = outlineSwr.data

    const [search, setSearch] = useState("")
    const query = search.trim().toLowerCase()
    const modules = useMemo(
        () => (outline ? filterModules(outline.modules, query) : []),
        [outline, query],
    )

    /** Module owning the active lesson — expanded on first paint. */
    const activeModuleId = useMemo(() => {
        if (!outline || !activeContentId) {
            return undefined
        }
        return outline.modules.find((module) =>
            module.lessons.some((lesson) => lesson.id === activeContentId))?.id
    }, [outline, activeContentId])

    /**
     * Expanded modules (controlled) — only the open module shows its read-progress
     * bar; collapsed ones show a compact "n/m" count instead, so the rail carries one
     * bar at a time, not one per module. The active lesson's module auto-opens; a
     * search opens every matching module so hits are visible.
     */
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
    useEffect(() => {
        if (!activeModuleId) {
            return
        }
        setExpandedKeys((prev) => prev.has(activeModuleId) ? prev : new Set(prev).add(activeModuleId))
    }, [activeModuleId])
    useEffect(() => {
        if (query) {
            setExpandedKeys(new Set(modules.map((module) => module.id)))
        }
    }, [query, modules])

    /** Aggregate course progress for the rail header (read lessons / %). */
    const progress = outline?.progress
    const currentTask = outline?.currentTask

    /**
     * Route for the "continue" button from `currentTask`. Lessons route straight to
     * their content; challenges route to the owning lesson's challenges tab. Milestone
     * tasks have no rail route yet → null (button hidden).
     */
    const continueHref = useMemo(() => {
        if (!outline || !currentTask || !displayId) {
            return null
        }
        const base = (moduleId: string, contentId: string) =>
            pathConfig().locale(locale).course(displayId).learn().module(moduleId).content(contentId).build()
        if (currentTask.kind === "lesson") {
            const owner = outline.modules.find((module) =>
                module.lessons.some((lesson) => lesson.id === currentTask.id))
            return owner ? base(owner.id, currentTask.id) : null
        }
        if (currentTask.kind === "challenge") {
            for (const module of outline.modules) {
                const lesson = module.lessons.find((item) =>
                    item.challenges.some((challenge) => challenge.id === currentTask.id))
                if (lesson) {
                    return `${base(module.id, lesson.id)}?tab=challenges`
                }
            }
        }
        return null
    }, [outline, currentTask, displayId, locale])

    /** Jump to the viewer's current task. */
    const onContinue = useCallback(() => {
        if (continueHref) {
            router.push(continueHref)
        }
    }, [continueHref, router])

    /** Active lesson row — scrolled into view when the rail opens / lesson changes. */
    const activeRowRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        activeRowRef.current?.scrollIntoView({ block: "nearest" })
    }, [activeContentId, outline])

    /** Navigate to the chosen lesson within its module. */
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

    return (
        <div className={cn("flex min-h-0 min-w-0 flex-col gap-3 p-6", className)}>
            {/* course-progress header + "continue" — the rail's one primary action.
                The bar tracks content reading only (lessons read / total). */}
            {progress ? (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <Label>{t("courseContents.progress")}</Label>
                            <Typography type="body-xs" color="muted">
                                {t("courseContents.contentCount", {
                                    read: progress.lessonsRead,
                                    total: progress.lessonsTotal,
                                })}
                            </Typography>
                        </div>
                        <ProgressMeter value={progress.lessonsRead} max={progress.lessonsTotal} />
                    </div>
                    {continueHref ? (
                        <Button variant="primary" size="sm" onPress={onContinue} className="w-full">
                            <PlayIcon aria-hidden focusable="false" className="size-5" />
                            {t("courseContents.resume")}
                        </Button>
                    ) : null}
                </div>
            ) : null}

            {/* search filters the lesson collection client-side */}
            <TextField>
                <Input
                    aria-label={t("courseContents.searchAria")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("courseContents.searchPlaceholder")}
                />
            </TextField>

            {/* only the lesson list scrolls — soft fade + no raw scrollbar; the
                progress header and search above stay pinned */}
            <ScrollShadow hideScrollBar className="-mx-1 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-1">
                <AsyncContent
                    isLoading={!outlineSwr.data && !outlineSwr.error}
                    skeleton={<ContentMapSkeleton />}
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
                    {modules.length > 0 ? (
                        <Accordion
                            variant="default"
                            className="min-w-0 w-full"
                            expandedKeys={expandedKeys}
                            onExpandedChange={(keys) => setExpandedKeys(new Set([...keys].map(String)))}
                        >
                            {modules.map((module) => {
                                const readCount = module.lessons.filter((lesson) => lesson.isRead).length
                                const isExpanded = expandedKeys.has(module.id)
                                return (
                                    <Accordion.Item
                                        key={module.id}
                                        id={module.id}
                                        aria-label={module.title}
                                        className="min-w-0"
                                    >
                                        <Accordion.Heading className="min-w-0">
                                            <Accordion.Trigger className="min-w-0 w-full max-w-full px-0 py-2 hover:bg-transparent">
                                                {/* title owns the full width (truncate + native tooltip); the
                                                    count/bar sits on its own line below so long titles aren't squeezed */}
                                                <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
                                                    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                                        <Typography
                                                            type="body"
                                                            weight="semibold"
                                                            truncate
                                                            title={module.title}
                                                            className="w-full min-w-0"
                                                        >
                                                            {module.title}
                                                        </Typography>
                                                        {isExpanded ? (
                                                            <ProgressMeter value={readCount} max={module.lessons.length || 1} />
                                                        ) : (
                                                            <Typography type="body-xs" color="muted">
                                                                {t("courseContents.moduleLessons", {
                                                                    read: readCount,
                                                                    total: module.lessons.length,
                                                                })}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                    <Accordion.Indicator className="shrink-0" />
                                                </div>
                                            </Accordion.Trigger>
                                        </Accordion.Heading>
                                        <Accordion.Panel>
                                            <Accordion.Body className="px-0 pb-3">
                                                <div className="flex flex-col gap-0">
                                                    {module.lessons.map((lesson) => {
                                                        const isActive = lesson.id === activeContentId
                                                        return (
                                                            <div
                                                                key={lesson.id}
                                                                ref={isActive ? activeRowRef : undefined}
                                                            >
                                                                <ContentMapRow
                                                                    title={lesson.title}
                                                                    isActive={isActive}
                                                                    isRead={lesson.isRead}
                                                                    isPremium={lesson.isPremium}
                                                                    onPress={() => onSelectLesson(lesson.id, module.id)}
                                                                    meta={(
                                                                        <Typography type="body-xs" color="muted">
                                                                            {t("content.minutesShort", { minutes: lesson.minutesRead })}
                                                                        </Typography>
                                                                    )}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                )
                            })}
                        </Accordion>
                    ) : (
                        <Typography type="body-sm" color="muted" align="center">
                            {t("courseContents.noMatch")}
                        </Typography>
                    )}
                </AsyncContent>
            </ScrollShadow>
        </div>
    )
}

export default ContentMap
