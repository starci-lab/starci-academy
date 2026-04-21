"use client"
import React, { useEffect, useMemo, useState } from "react"
import {
    Skeleton,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks/singleton"
import { MarkdownContent } from "@/components/reuseable"

export const Learn = () => {
    const t = useTranslations()
    const module = useAppSelector((state) => state.module.entity)
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading: isCourseLoading } = useQueryCourseSwr()
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
    const isLoading = isCourseLoading || isModuleLoading || !module || !course
    const sortedContents = useMemo(
        () => [...(module?.contents ?? [])].sort((a, b) => a.orderIndex - b.orderIndex),
        [module?.contents],
    )
    const selectedContent = useMemo(
        () => sortedContents.find((content) => content.id === selectedContentId) ?? sortedContents[0],
        [sortedContents, selectedContentId],
    )

    useEffect(() => {
        if (!sortedContents.length) {
            setSelectedContentId(null)
            return
        }
        setSelectedContentId(sortedContents[0].id)
    }, [module?.id, sortedContents])

    return (
        <div className="p-6">
            {isLoading ? (
                <Skeleton className="h-5 w-32" />
            ) : null}
            <div className="h-8" />
            {isLoading ? (
                <div className="space-y-3">
                    <Skeleton className="h-7 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="text-2xl font-bold">{selectedContent?.title || module?.title}</div>
                    <div className="rounded-3xl border border-divider p-4">
                        <MarkdownContent markdown={selectedContent?.body || t("content.empty")} />
                    </div>
                </div>
            )}
        </div>
    )
}
