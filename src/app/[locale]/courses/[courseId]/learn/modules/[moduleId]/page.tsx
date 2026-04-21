"use client"
import React, { useEffect, useMemo, useState } from "react"
import { Accordion, Breadcrumbs, Card, CardContent, Skeleton, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { BracketsCurlyIcon } from "@phosphor-icons/react"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks/singleton"
import { MarkdownContent } from "@/components/reuseable"
import { pathConfig } from "@/resources"

const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const module = useAppSelector((state) => state.module.entity)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const { isLoading: isCourseLoading } = useQueryCourseSwr()
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
    const isLoading = isCourseLoading || isModuleLoading || !course || !module
    const sortedModules = useMemo(
        () => [...(course?.modules ?? [])].sort((a, b) => a.orderIndex - b.orderIndex),
        [course?.modules],
    )
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
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:border-divider/60">
                <div className="p-6">
                    {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                    ) : (
                        <Breadcrumbs>
                            <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                                {t("nav.home")}
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                                {t("nav.courses")}
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                                {course?.title || t("nav.courses")}
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item>
                                <span>{module?.title || t("modules.title")}</span>
                            </Breadcrumbs.Item>
                        </Breadcrumbs>
                    )}
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
            </div>
            <div className="col-span-2 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)]">
                <div className="h-full p-3">
                    <div className="h-full overflow-y-auto rounded-3xl border border-divider bg-surface p-4">
                        <div className="mb-3 text-base font-medium">{t("modules.title")}</div>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <Accordion
                                variant="surface"
                                expandedKeys={moduleDisplayId ? [moduleDisplayId] : []}
                                onExpandedChange={(selection) => {
                                    const key = Array.from(selection)[0]
                                    if (!key || !courseDisplayId) return
                                    router.push(
                                        pathConfig().locale(locale).course(courseDisplayId).learn().module(key.toString()).build(),
                                    )
                                }}
                            >
                                {sortedModules.map((moduleItem) => (
                                    <Accordion.Item key={moduleItem.displayId} id={moduleItem.displayId}>
                                        <Accordion.Heading>
                                            <Accordion.Trigger className="w-full">
                                                <div className="flex w-full items-center justify-between gap-2">
                                                    <span
                                                        className={cn(
                                                            "min-w-0 flex-1 text-start text-sm font-semibold",
                                                            moduleItem.displayId === moduleDisplayId ? "text-accent" : "",
                                                        )}
                                                    >
                                                        {moduleItem.title}
                                                    </span>
                                                    <Accordion.Indicator />
                                                </div>
                                            </Accordion.Trigger>
                                        </Accordion.Heading>
                                        <Accordion.Panel>
                                            <Accordion.Body className="px-0 pb-0 pt-2">
                                                <div className="flex flex-col gap-2">
                                                    {[...(moduleItem.contents ?? [])]
                                                        .sort((a, b) => a.orderIndex - b.orderIndex)
                                                        .map((content) => (
                                                            <Card
                                                                key={content.id}
                                                                className={cn(
                                                                    "cursor-pointer border border-divider",
                                                                    content.id === selectedContent?.id ? "bg-accent/10 text-accent" : "",
                                                                )}
                                                                onClick={() => setSelectedContentId(content.id)}
                                                            >
                                                                <CardContent className="flex items-start gap-2 p-2">
                                                                    <BracketsCurlyIcon className="mt-0.5 size-4 shrink-0" />
                                                                    <div className="text-sm">{content.title}</div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page