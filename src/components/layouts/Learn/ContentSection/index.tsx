"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Spacer } from "@heroui/react"
import { ContentCard } from "./ContentCard"
import { useQueryContentsSwr } from "@/hooks/singleton"
import { ContentCardSkeleton } from "./ContentCardSkeleton"
import { StarCiSkeleton } from "@/components/atomic"
import _ from "lodash"

/**
 * Learn tab “Content”: ordered module contents (title + body, optional thumbnail).
 */
export const ContentSection = () => {
    const t = useTranslations()
    const contents = useAppSelector((state) => state.content.entities)
    const count = useAppSelector((state) => state.content.count)
    const { isLoading } = useQueryContentsSwr()

    return (
        <div>
            {
                isLoading || !contents ? (
                    <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-foreground-500">
                        {t("content.count", { count: count ?? 0 })}
                    </div>
                )
            }
            <Spacer y={6} />
            {
                isLoading || !contents ? (
                    <div className="flex flex-col gap-3 w-full">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <ContentCardSkeleton key={index} />
                        ))}
                    </div>
                )
                    : (
                        <div className="flex flex-col gap-3 w-full">
                            {
                                _.cloneDeep(contents)?.sort(
                                    (prev, next) => prev.orderIndex - next.orderIndex
                                ).map((content) => (
                                    <ContentCard key={content.id} content={content} />
                                )
                                )
                            }
                        </div>
                    )
            }
        </div>
    )
}
