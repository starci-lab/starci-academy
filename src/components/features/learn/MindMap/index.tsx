"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { MindMapWorkspace } from "./MindMapWorkspace"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Stage } from "@/components/frames/Stage"

/**
 * Course mind-map feature container for the authenticated learn shell.
 *
 * Triggers the course fetch for hard refreshes, then mounts the full-bleed
 * {@link MindMapWorkspace} (the authored keyword map). No breadcrumb / page chrome —
 * the canvas owns the whole viewport, which is what `Stage fill="viewport"` names.
 * Mounted by the `/[locale]/courses/[courseId]/learn/mind-map` route.
 *
 * Client component: relies on redux selectors.
 */
export const MindMap = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    // Trigger the course fetch on this route (the /modules layout does it elsewhere, but a hard
    // refresh straight into /mind-map has no other loader, so the canvas would stay empty).
    const { isLoading, error, mutate } = useQueryCourseSwr()

    // error beats a stale loading flag; first load with nothing in hand shimmers the canvas.
    const isSkeleton = isLoading && !course
    const canvas = () => {
        if (error) {
            return (
                <AsyncContentError
                    title={t("courseLanding.errorTitle")}
                    onRetry={() => mutate()}
                    retryLabel={t("courseLanding.retry")}
                />
            )
        }
        return isSkeleton ? <Skeleton className="h-full w-full" /> : <MindMapWorkspace />
    }

    return (
        <Stage
            identity={{ tier: "block", component: "MindMap" }}
            fill="viewport"
            canvas={canvas}
        />
    )
}
