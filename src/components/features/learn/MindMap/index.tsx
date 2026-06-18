"use client"

import React from "react"
import { Skeleton, cn } from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryCourseSwr,
} from "@/hooks"

import { MindMapCanvas } from "./MindMapCanvas"
import {
    MindMapBreadcrumbs,
} from "./MindMapBreadcrumbs"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MindMap}. */
export type MindMapProps = WithClassNames<undefined>

/**
 * Course mind-map feature container for the authenticated learn shell.
 *
 * Triggers the course fetch for hard refreshes, renders the breadcrumb trail,
 * then mounts the {@link MindMapCanvas}. Mounted by the
 * `/[locale]/courses/[courseId]/learn/mind-map` route.
 *
 * Client component: relies on redux selectors and the i18n hook.
 * @param props - optional className for the root element
 */
export const MindMap = ({
    className,
}: MindMapProps = {}) => {
    const course = useAppSelector((state) => state.course.entity)
    // Trigger the course fetch on this route (the /modules layout does it elsewhere, but a hard
    // refresh straight into /mind-map has no other loader, so the canvas would stay empty).
    const { isLoading } = useQueryCourseSwr()

    return (
        // fill the viewport below the sticky h-16 navbar; breadcrumb is fixed, canvas takes the rest
        <div className={cn("flex h-[calc(100dvh-4rem)] flex-col", className)}>
            <div className="shrink-0 p-3">
                <MindMapBreadcrumbs />
            </div>
            {/* full-bleed canvas: only a top border separates it from the breadcrumb, no side/bottom gaps */}
            <div className="min-h-0 flex-1 border-t">
                {!course && isLoading ? (
                    <Skeleton className="h-full w-full" />
                ) : (
                    <MindMapCanvas />
                )}
            </div>
        </div>
    )
}
