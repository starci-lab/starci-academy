"use client"

import React, { useMemo } from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { StarCiSkeleton } from "@/components/atomic"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"
import _ from "lodash"
export const ValuePropositions = () => {
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading } = useQueryCourseSwr()
    const valuePropositions = useMemo(() => {
        return _.cloneDeep(course?.valuePropositions ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex)
    }, [course])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 text-foreground-500">
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[90%]" />
                </div>
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[75%]" />
                </div>
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[85%]" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 text-foreground-500">
            {valuePropositions.map((valueProposition) => (
                <div key={valueProposition.id} className="flex items-start gap-2">
                    <SealCheckIcon
                        size={20}
                        className="mt-0.5 shrink-0 text-foreground-500"
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
