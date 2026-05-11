"use client"

import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { useQueryPublicContentSwr } from "@/hooks/singleton"
import { Skeleton } from "@heroui/react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { ClockIcon } from "@phosphor-icons/react"
import _ from "lodash"

const PublicContentPage = () => {
    const queryPublicContentSwr = useQueryPublicContentSwr()
    const content = useAppSelector((state) => state.publicContent.entity)

    const isLoading = queryPublicContentSwr.isLoading || !content
    const error = queryPublicContentSwr.error

    const references = useMemo(
        () => _.cloneDeep(content?.references ?? []).sort((a, b) => a.orderIndex - b.orderIndex),
        [content?.references],
    )

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <Skeleton className="h-8 w-3/4 rounded-2xl" />
                <div className="h-4" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full mt-2" />
                <div className="h-6" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        )
    }

    if (error || !content) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center">
                    <div className="text-lg font-semibold text-danger">
                        {error?.message ?? "Content not found."}
                    </div>
                    <div className="mt-2 text-sm text-muted">
                        This content may be premium or no longer available.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <div className="h-2" />
                <p className="text-sm text-muted">{content.description}</p>
                <div className="h-3" />
                <div className="flex items-center gap-2 text-sm text-muted">
                    <ClockIcon className="size-4" />
                    <span>{content.minutesRead} min read</span>
                </div>
            </div>

            {/* Body */}
            <div className="text-sm text-muted overflow-x-auto">
                <MarkdownContent markdown={content.body || "No content."} />
            </div>

            {/* References */}
            {references.length > 0 && (
                <>
                    <div className="h-6" />
                    <ReferenceLinks
                        references={references}
                        titleKey="reference.title"
                    />
                </>
            )}
        </div>
    )
}

export default PublicContentPage
