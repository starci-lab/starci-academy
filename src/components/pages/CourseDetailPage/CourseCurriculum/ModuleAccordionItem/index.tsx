"use client"

import React from "react"
import {
    Accordion,
    Typography,
} from "@heroui/react"
import {
    CaretRightIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { CourseContentTier } from "@/modules/types/enums/course-content-tier"
import { type ModuleEntity } from "@/modules/types/entities/module"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** Chip tone per learning tier (foundation → advanced reads easy → hard). */
const TIER_TONE: Record<CourseContentTier, "success" | "warning" | "danger"> = {
    [CourseContentTier.Foundation]: "success",
    [CourseContentTier.Intermediate]: "warning",
    [CourseContentTier.Advanced]: "danger",
}

/** Props for {@link ModuleAccordionItem}. */
export interface ModuleAccordionItemProps extends WithClassNames<undefined> {
    /** The module to render as one accordion row (list-item data prop). */
    module: ModuleEntity
}

/**
 * One curriculum module as an accordion row: title + tier badge + premium lock in
 * the trigger; lesson/minute meta + description + free preview bullets in the
 * panel. List-item (rendered in a `.map`), so it takes the `module` data prop.
 *
 * @param props - {@link ModuleAccordionItemProps}
 */
export const ModuleAccordionItem = ({ module }: ModuleAccordionItemProps) => {
    const t = useTranslations()

    const contents = module.contents ?? []
    const minutes = contents.reduce((sum, content) => sum + (content.minutesRead ?? 0), 0)
    const lessonCount = module.numContents || contents.length
    const previews = _.cloneDeep(module.previewContents ?? []).sort(
        (a, b) => a.sortIndex - b.sortIndex,
    )
    const contentTier = module.contentTier

    return (
        <Accordion.Item aria-label={module.title}>
            <Accordion.Heading>
                <Accordion.Trigger>
                    <StackH gap={4} principle="content-row"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        classNames={["min-w-0", "flex-1"]} justify="between" align="center" items={[
                            () => (
                                <Typography type="body-sm" weight="medium" truncate className="min-w-0">
                                    {module.title}
                                </Typography>
                            ),
                            () => (
                                <Cluster
                                    gap={3}
                                    principle="chip-row"
                                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                    classNames={["shrink-0"]}
                                    items={[
                                        ...(contentTier ? [() => (
                                            <StatusChip tone={TIER_TONE[contentTier]}>
                                                {t(`courseLanding.tier.${contentTier}`)}
                                            </StatusChip>
                                        )] : []),
                                        ...(previews.length > 0 ? [() => (
                                            <StatusChip tone="neutral">
                                                {t("courseLanding.previewCount", { count: previews.length })}
                                            </StatusChip>
                                        )] : []),
                                    ]}
                                />
                            ),
                        ]} />
                </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
                <Accordion.Body>
                    <StackV gap={4} principle="card-caption"
                        explain="Holds caption text under card media so the caption stays attached to the image above it."
                        items={[
                            () => (
                                <Typography type="body-xs" color="muted">
                                    {t("courseLanding.moduleMeta", { lessons: lessonCount, minutes })}
                                </Typography>
                            ),
                            () => (module.description ? (
                                <MarkdownContent markdown={module.description} />
                            ) : null),
                            () => (previews.length > 0 ? (
                                <ul data-principle="sibling-stack" className="flex flex-col gap-2">
                                    {previews.map((preview) => (
                                        <StackH key={preview.id} as="li" gap={3} principle="identity"
                                            explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                            align="start" items={[
                                                () => <CaretRightIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />,
                                                () => (
                                                    <Typography type="body-sm" color="muted">
                                                        {preview.text}
                                                    </Typography>
                                                ),
                                            ]} />
                                    ))}
                                </ul>
                            ) : null),
                        ]} />
                </Accordion.Body>
            </Accordion.Panel>
        </Accordion.Item>
    )
}
