"use client"

import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { Accordion, Chip, cn, Link } from "@heroui/react"
import _ from "lodash"
import { WithClassNames } from "@/modules/types"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useLocale, useTranslations } from "next-intl"
import { ClockIcon, SwordIcon, VideoIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"

type ModuleSidebarProps = WithClassNames<undefined>

/**
 * Right sidebar accordion for module navigation and content list.
 * @param {ModuleSidebarProps} props Sidebar props.
 */
export const ModuleSidebar = (props: ModuleSidebarProps) => {
    const course = useAppSelector((state) => state.course.entity)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const modules = useMemo(() => _.cloneDeep(course?.modules ?? []), [course?.modules])
    const contents = useAppSelector((state) => state.content.entities)
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const activeContent = useAppSelector((state) => state.content.entity)
    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", props.className)}>
            <Accordion
                variant="default"
                className="rounded-none border-none px-0 shadow-none"
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
                                            className={
                                                cn(
                                                    "min-w-0 flex-1 cursor-pointer text-start text-base font-semibold",
                                                )
                                            }
                                        >
                                            {`${module.orderIndex + 1}. ${module.title}`}
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
                                            ?.map((content, index) => (
                                                <div key={content.id}>
                                                    <div>
                                                        <Link onPress={
                                                            () => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleDisplayId).content(content.displayId).build()) 
                                                        } 
                                                        className={
                                                            cn(
                                                                "font-medium text-foreground",
                                                                content.id === activeContent?.id ? "text-accent" : ""
                                                            )
                                                        }
                                                        >
                                                            {`${content.orderIndex + 1}. ${content.title}`}
                                                        </Link>
                                                        <div className="h-2" />
                                                        <div className="line-clamp-3 text-xs text-muted">
                                                            {content.description}
                                                        </div>
                                                        <div className="h-3" />
                                                        <div className="overflow-hidden">
                                                            <motion.div
                                                                className="flex w-max items-center gap-2"
                                                                drag="x"
                                                                dragConstraints={{ left: -100, right: 0 }}
                                                                whileTap={{ cursor: "grabbing" }}
                                                            >
                                                                <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                                                                    <ClockIcon className="size-4" />
                                                                    <Chip.Label>
                                                                        {t("content.minutesRead", {
                                                                            minutes: content?.minutesRead ?? 0,
                                                                        })}
                                                                    </Chip.Label>
                                                                </Chip>
                                                                <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                                                                    <VideoIcon className="size-4" />
                                                                    <Chip.Label>
                                                                        {t("content.lessonCount", {
                                                                            count: content?.numLessons ?? 0,
                                                                        })}
                                                                    </Chip.Label>
                                                                </Chip>
                                                                <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                                                                    <SwordIcon className="size-4" />
                                                                    <Chip.Label>
                                                                        {t("content.challengeCount", {
                                                                            count: content?.numChallenges ?? 0,
                                                                        })}
                                                                    </Chip.Label>
                                                                </Chip>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                    <div className="h-3" />
                                                    {index !== (contents?.length ?? 0) - 1 && <div className="border-t border-divider" />}
                                                </div>
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
