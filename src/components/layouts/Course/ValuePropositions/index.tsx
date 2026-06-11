"use client"

import { SealCheck as SealCheckIcon } from "@gravity-ui/icons"
import React, { useMemo } from "react"
import { Skeleton } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks"
import _ from "lodash"


/**
 * Course value propositions list container.
 *
 * Pulls the value proposition lines from redux + the load flag from SWR, sorts
 * them by display order, and renders a skeleton while loading. `"use client"`
 * for the redux selector and the interactive HeroUI `Skeleton`.
 */
export const ValuePropositions = () => {
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading } = useQueryCourseSwr()
    const valuePropositions = useMemo(() => {
        return _.cloneDeep(course?.valuePropositions ?? []).sort(
            (prev, next) => prev.sortIndex - next.sortIndex)
    }, [course])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 text-muted">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 shrink-0" />
                    <Skeleton className="h-4 flex-1 max-w-[90%]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 shrink-0" />
                    <Skeleton className="h-4 flex-1 max-w-[75%]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 shrink-0" />
                    <Skeleton className="h-4 flex-1 max-w-[85%]" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 text-muted">
            {valuePropositions.map((valueProposition) => (
                <div key={valueProposition.id} className="flex items-start gap-2">
                    <SealCheckIcon
                        width={20} height={20}
                        className="mt-0.5 shrink-0 text-muted"
                    />
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: valueProposition.text }}
                    />
                </div>
            ))}
        </div>
    )
}
