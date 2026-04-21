"use client"

import React, { useMemo } from "react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Skeleton, cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import _ from "lodash"
import { useQueryContentSwr } from "@/hooks/singleton"

export type ContentBodyProps = WithClassNames<undefined>

export const ContentBody = ({ className }: ContentBodyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)
    const isLoading = queryContentSwr.isLoading || !content
    const references = useMemo(() => _.cloneDeep(content?.references ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex), [content?.references])

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-[18px] my-[17px]"/>
                <div className="my-3" />
                <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
            </>
        )
    }

    return (
        <div className={cn("text-sm text-muted", className)}>
            <MarkdownContent markdown={content?.body || t("content.empty")} />
            <div className="h-6" />
            <ReferenceLinks
                references={references}
                titleKey="reference.title"
            />
        </div>
    )
}
