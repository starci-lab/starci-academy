"use client"

import React from "react"
import { Chip, Skeleton } from "@heroui/react"
import { BookOpenIcon, BracketsCurlyIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import _ from "lodash"
import { useAppSelector } from "@/redux"
import { useQueryModuleSwr } from "@/hooks/singleton"
import { pathConfig } from "@/resources/path"
import { useRouter } from "next/navigation"
import { ContentCard } from "./ContentCard"
import { ContentCardSkeleton } from "./ContentCardSkeleton"
import { Empty } from "./Empty"

/**
 * Render module overview with preview bullets and content cards.
 */
export const Module = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const module = useAppSelector((state) => state.module.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isModuleLoading || !module
    const contents = useAppSelector((state) => state.content.entities)
    if (isLoading) {
        return (
            <div>
                <div className="h-3" />
                <div className="p-3">
                    <Skeleton className="h-6 my-1 w-3/4 rounded-full" />
                    <div className="h-2" />
                    <div className="flex flex-col">
                        <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                        <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
                    </div>
                    <div className="h-3" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="h-6" />
                    <div className="font-semibold text-base">{t("module.pathIntroduction")}</div>
                    <div className="h-3" />
                    <div className="text-sm text-start w-full gap-3 flex flex-col text-muted">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="h-6" />
                    <div className="font-semibold text-base">{t("content.tabs.content")}</div>
                    <div className="h-3" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2"> 
                        {
                            Array.from({ length: 3 }).map((_, index) => (
                                <ContentCardSkeleton key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="h-3" />
            <div className="p-3">
                <div className="text-2xl font-bold">{module?.title}</div>
                <div className="h-2" />
                <div className="text-sm text-muted">{module?.description}</div>
                <div className="h-3" />
                <div className="flex items-center gap-2">
                    <Chip variant="secondary" color="accent">
                        <BookOpenIcon className="size-5" />
                        <Chip.Label>
                            {t(
                                "module.numContents", {
                                    count: module?.numContents || 0,
                                })
                            }
                        </Chip.Label>
                    </Chip>
                </div>
                <div className="h-6" />
                <div className="font-semibold text-base">{t("module.pathIntroduction")}</div>
                <div className="h-3" />
                <div className="text-sm text-start w-full gap-3 flex flex-col text-muted">
                    {_.cloneDeep(module?.previewContents ?? [])
                        .sort((previous, current) => previous.orderIndex - current.orderIndex)
                        .map((content) => (
                            <div key={content.id} className="flex items-center gap-3">
                                <BracketsCurlyIcon className="w-5 h-5 min-w-5 min-h-5" />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: content.text,
                                    }}
                                />
                            </div>
                        ))} 
                </div>
                <div className="h-6" />
                <div className="font-semibold text-base">{t("content.tabs.content")}</div>
                <div className="h-3" />
                {
                    contents?.length && contents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {_.cloneDeep(contents)?.sort((prev, next) => prev.orderIndex - next.orderIndex).map((content) => (
                                <ContentCard key={content.id} content={content} onPress={
                                    () => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleDisplayId).content(content.displayId).build())
                                } />
                            ))}
                        </div>
                    ) : <Empty />
                }
            </div>
        </div>
    )
}
