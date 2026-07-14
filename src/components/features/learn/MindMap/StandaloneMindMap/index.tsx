"use client"

import React from "react"
import { Skeleton, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { MindMapCanvas } from "../MindMapCanvas"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Props for {@link StandaloneMindMap}. */
export type StandaloneMindMapProps = WithClassNames<undefined>

/**
 * Public, full-width mind-map screen mounted by the
 * `/[locale]/courses/[courseId]/mind-map` route (outside the authenticated
 * `learn` shell, so there is no left Sidebar and the canvas spans the full width).
 *
 * No authentication required: the course is loaded through the no-auth GraphQL
 * query in {@link useQueryCourseSwr}. The `[courseId]` route param is mirrored
 * into `course.displayId` by the global `useSyncReduxCourseId` effect, which is
 * what triggers the fetch here.
 *
 * Fills the viewport below the sticky `h-16` (4rem) navbar.
 * @param props - optional className (unused; layout fills the viewport)
 */
export const StandaloneMindMap = ({
    className,
}: StandaloneMindMapProps = {}) => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    // Hard refresh straight into this route has no other loader, so kick the fetch here.
    const { isLoading, error, mutate } = useQueryCourseSwr()

    return (
        <div className={cn("h-[calc(100dvh-4rem)] w-full", className)}>
            <AsyncContent
                isLoading={isLoading && !course}
                skeleton={<Skeleton className="h-full w-full" />}
                error={error}
                errorContent={{
                    title: t("courseLanding.errorTitle"),
                    onRetry: () => mutate(),
                    retryLabel: t("courseLanding.retry"),
                }}
            >
                <MindMapCanvas />
            </AsyncContent>
        </div>
    )
}
