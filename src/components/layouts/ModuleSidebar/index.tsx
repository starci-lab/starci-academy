"use client"

import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { Accordion, Card, CardContent, cn, Link } from "@heroui/react"
import _ from "lodash"
import { WithClassNames } from "@/modules/types"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useLocale } from "next-intl"

type ModuleSidebarProps = WithClassNames<undefined>

/**
 * Right sidebar accordion for module navigation and content list.
 * @param {ModuleSidebarProps} props Sidebar props.
 */
export const ModuleSidebar = (props: ModuleSidebarProps) => {
    const course = useAppSelector((state) => state.course.entity)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const modules = useMemo(() => _.cloneDeep(course?.modules ?? []), [course?.modules])
    const activeModule = useMemo(() => modules.find((module) => module.displayId === moduleDisplayId), [modules, moduleDisplayId])
    const contents = useAppSelector((state) => state.content.entities)
    const router = useRouter()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)]", props.className)}>
            <Accordion
                variant="default"
                className={cn("px-0 rounded-none border-none shadow-none", props.className)}
                expandedKeys={new Set(moduleDisplayId ? [String(moduleDisplayId)] : [])}
                onExpandedChange={
                    (selection) => {
                        const key = Array.from(selection)[0]
                        router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(key ? String(key) : undefined).build())
                    }
                }
            >
                {
                    modules.map((module) => (
                        <Accordion.Item
                            key={String(module.displayId)}
                            id={String(module.displayId)}
                        >
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full">
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <span
                                            className={cn(
                                                "min-w-0 flex-1 cursor-pointer text-start",
                                                module.id === activeModule?.id ? "text-primary" : ""
                                            )}
                                        >
                                            {module.title}
                                        </span>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className="p-3">
                                    <div className="flex flex-col gap-3">
                                        {_.cloneDeep(contents ?? [])
                                            ?.sort((prev, next) => prev.orderIndex - next.orderIndex)
                                            ?.map((content) => (
                                                <Card key={content.id} className="shadow-none">
                                                    <CardContent>
                                                        <Link onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleDisplayId).content(content.displayId).build()) } className="font-medium text-foreground">
                                                            {content.title}
                                                        </Link>
                                                        <div className="line-clamp-3 text-xs text-muted">
                                                            {content.description}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                    )
                }
            </Accordion>
        </div>
    )
}
