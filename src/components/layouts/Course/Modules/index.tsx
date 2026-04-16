"use client"

import React, { useMemo } from "react"
import type { IconProps } from "@phosphor-icons/react"
import { BookOpenIcon, BracketsCurlyIcon, SwordIcon, VideoIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"
import { Accordion, Chip, cn, Skeleton, Tooltip } from "@heroui/react"
import _ from "lodash"
import { WithClassNames } from "@/modules/types"

type IconComponent = React.ComponentType<IconProps>

/**
 * Module item metadata for summary chips (quantities are placeholder until API wiring).
 */
interface ModuleItem {
    /** Stable id for list keys */
    id: string
    /** Phosphor icon component */
    icon: IconComponent
    /** next-intl key for tooltip body */
    tooltipKey: string
    /** Temporary hardcoded count shown on the chip */
    quantity: number
}

/**
 * Module props
 * @param base - Optional slot class from `classNames.base`
 */
type ModuleProps = WithClassNames<{
    base: string
}>

export const Modules = (props: ModuleProps) => {
    const modules = useAppSelector((state) => state.course.entity?.modules)
    const { isLoading } = useQueryCourseSwr()
    const list = modules ?? []
    const t = useTranslations()
    const items: Array<ModuleItem> = useMemo(
        () => [
            {
                id: "contents",
                icon: BookOpenIcon,
                tooltipKey: "module.chipContentsHint",
                quantity: 12,
            },
            {
                id: "videos",
                icon: VideoIcon,
                tooltipKey: "module.chipVideosHint",
                quantity: 8,
            },
            {
                id: "challenges",
                icon: SwordIcon,
                tooltipKey: "module.chipChallengesHint",
                quantity: 3,
            },
        ],
        []
    )
    return (
        <div className={cn(props.className, props.classNames?.base)}>
            <div className="text-lg font-semibold mb-3">{t("module.pathIntroduction")}</div>
            {isLoading ? (
                <Accordion variant="surface">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Accordion.Item
                            key={index}
                            aria-label={t("module.aria", { index: index + 1 })}
                        >
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full">
                                    <div className="flex w-full items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            <Skeleton className="h-4 w-[30%] my-[4px]" />
                                            <div>
                                                <Skeleton className="h-[14px] w-[60%] my-[3px]" />
                                                <Skeleton className="h-[14px] w-[40%] my-[3px]" />
                                            </div>
                                        </div>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body />
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <Accordion variant="surface">
                    {list.map((module) => (
                        <Accordion.Item key={module.id} aria-label={module.title}>
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    <div className="flex w-full items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1 text-start">
                                            <div className="text-lg font-semibold mb-1.5">{module.title}</div>
                                            <div>
                                                <div className="text-sm text-muted">{module.description}</div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {items.map((item) => {
                                                        const ItemIcon = item.icon
                                                        return (
                                                            <Tooltip key={item.id} delay={400}>
                                                                <Tooltip.Trigger>
                                                                    <Chip
                                                                        size="sm"
                                                                        color="accent"
                                                                        variant="soft"
                                                                        className="cursor-default"
                                                                    >
                                                                        <ItemIcon className="size-4 shrink-0" />
                                                                        <Chip.Label>{item.quantity}</Chip.Label>
                                                                    </Chip>
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content placement="top" showArrow>
                                                                    <Tooltip.Arrow />
                                                                    {t(item.tooltipKey)}
                                                                </Tooltip.Content>
                                                            </Tooltip>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <div className="text-sm text-start w-full gap-3 flex flex-col">
                                        {_.cloneDeep(module.previewContents)
                                            ?.sort((previous, current) => previous.orderIndex - current.orderIndex)
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
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    )
}
