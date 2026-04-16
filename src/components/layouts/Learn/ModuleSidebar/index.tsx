"use client"

import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { Accordion, cn } from "@heroui/react"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources"
import { BracketsCurlyIcon } from "@phosphor-icons/react"

export const ModuleSidebar = () => {
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const modules = useMemo(() => _.cloneDeep(course?.modules ?? []), [course?.modules])
    const activeModule = useMemo(() => modules.find((module) => module.displayId === moduleDisplayId), [modules, moduleDisplayId])
    const router = useRouter()
    const locale = useLocale()
    return (
        <Accordion
            variant="surface"
            className="px-0"
            expandedKeys={moduleDisplayId ? [moduleDisplayId] : []}
            onExpandedChange={(selection) => {
                const key = Array.from(selection)[0]
                if (key) {
                    router.push(
                        pathConfig().locale(locale).course(courseDisplayId).learn().module(key.toString()).build()
                    )
                }
            }}
        >
            {modules.map((module) => (
                <Accordion.Item key={module.displayId} id={module.displayId}>
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
                            <div className="text-sm text-start w-full gap-3 flex flex-col">
                                {_.cloneDeep(module.previewContents)
                                    ?.sort((previous, current) => previous.orderIndex - current.orderIndex)
                                    .map((content) => (
                                        <div key={content.id} className="flex items-center gap-3 text-xs text-foreground-500">
                                            <BracketsCurlyIcon className="w-5 h-5 min-w-5 min-h-5" />
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: content.text,
                                                }}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}
