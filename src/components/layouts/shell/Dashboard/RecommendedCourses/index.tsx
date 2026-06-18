"use client"

import React, {
    useMemo,
} from "react"
import {
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
    Compass as CompassIcon,
} from "@gravity-ui/icons"
import {
    useQueryCoursesSwr,
    useQueryMyCoursesSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Max number of recommended courses shown. */
const RECOMMEND_LIMIT = 3

/** Props for {@link RecommendedCourses}. */
export type RecommendedCoursesProps = WithClassNames<undefined>

/**
 * "Courses for you" discovery card on the explore tab — courses the viewer has
 * **not** joined yet, so the explore stream offers a genuine next step instead of
 * mirroring the social feed. Enrolled courses are excluded by title (the rail's
 * leaf query exposes labels, not ids). Self-fetches its own leaf queries; hides
 * itself when there is nothing new to recommend.
 * @param props - optional className for the root element.
 */
export const RecommendedCourses = ({
    className,
}: RecommendedCoursesProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data: coursesData } = useQueryCoursesSwr()
    const { data: myCourses } = useQueryMyCoursesSwr()

    /** Courses not already joined (matched by title), capped at the limit. */
    const recommended = useMemo(
        () => {
            const all = coursesData?.courses?.data?.data ?? []
            const enrolled = new Set(
                (myCourses ?? []).map((course) => course.label.trim().toLowerCase()),
            )
            return all
                .filter((course) => !enrolled.has(course.title.trim().toLowerCase()))
                .slice(0, RECOMMEND_LIMIT)
        },
        [
            coursesData,
            myCourses,
        ],
    )

    // everything already joined (or nothing loaded) → hide the card
    if (recommended.length === 0) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-3 rounded-large bg-default/40 p-3", className)}>
            <div className="flex items-center gap-1.5">
                <CompassIcon className="size-4 shrink-0 text-accent" />
                <span className="text-base font-semibold text-foreground">
                    {t("dashboard.recommended.title")}
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                {recommended.map((course) => (
                    <button
                        key={course.displayId}
                        type="button"
                        onClick={() => router.push(
                            pathConfig().locale(locale).course(course.displayId).build(),
                        )}
                        className="flex items-center gap-3 rounded-medium px-2 py-1.5 text-left hover:bg-default/60"
                    >
                        {course.coverImageUrl ? (
                            <img
                                src={course.coverImageUrl}
                                alt={course.title}
                                className="size-9 shrink-0 rounded-medium object-cover"
                            />
                        ) : null}
                        <div className="flex min-w-0 flex-1 flex-col gap-0">
                            <span className="truncate text-sm font-semibold text-foreground">
                                {course.title}
                            </span>
                            {course.description ? (
                                <span className="truncate text-xs text-muted">
                                    {course.description}
                                </span>
                            ) : null}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
