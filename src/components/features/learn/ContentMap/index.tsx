"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Accordion,
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
        <div className={cn("flex flex-col gap-3 p-3", className)}>
            {/* search filters the lesson collection client-side */}
            <TextField>
                <Input
                    aria-label={t("courseContents.searchAria")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("courseContents.searchPlaceholder")}
                />
            </TextField>

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
                        defaultExpandedKeys={activeModuleId ? new Set([activeModuleId]) : undefined}
                    >
                        {modules.map((module) => {
                            const readCount = module.lessons.filter((lesson) => lesson.isRead).length
                            return (
                                <Accordion.Item key={module.id} id={module.id} aria-label={module.title}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger>
                                            <div className="flex w-full flex-col gap-2">
                                                <div className="flex w-full items-center justify-between gap-2">
                                                    <Typography type="body-sm" weight="semibold" truncate>
                                                        {module.title}
                                                    </Typography>
                                                    <Accordion.Indicator />
                                                </div>
                                                <ProgressMeter value={readCount} max={module.lessons.length || 1} />
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            <div className="flex flex-col gap-0">
                                                {module.lessons.map((lesson) => (
                                                    <ContentMapRow
                                                        key={lesson.id}
                                                        title={lesson.title}
                                                        isActive={lesson.id === activeContentId}
                                                        isRead={lesson.isRead}
                                                        isPremium={lesson.isPremium}
                                                        onPress={() => onSelectLesson(lesson.id, module.id)}
                                                        meta={(
                                                            <Typography type="body-xs" color="muted">
                                                                {t("content.minutesShort", { minutes: lesson.minutesRead })}
                                                            </Typography>
                                                        )}
                                                    />
                                                ))}
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
        </div>
    )
}

export default ContentMap
