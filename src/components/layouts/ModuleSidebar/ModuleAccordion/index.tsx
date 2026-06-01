"use client"

import React from "react"
import {
    Accordion,
    cn,
} from "@heroui/react"
import type {
    ModuleEntity,
} from "@/modules/types"
import {
    ModuleContentRow,
} from "./ModuleContentRow"

/**
 * Props for {@link ModuleAccordion}.
 */
export interface ModuleAccordionProps {
    /** Modules to render, already ordered. */
    modules: Array<ModuleEntity>
    /** Currently expanded module id. */
    activeModuleId?: string
    /** Currently active content id (highlights its link). */
    activeContentId?: string
    /** Fired with the next expanded module id (or undefined when collapsed). */
    onExpandedChange: (moduleId?: string) => void
    /** Fired with the content id when a content link is pressed. */
    onSelectContent: (contentId: string) => void
}

/**
 * Accordion of course modules, each expanding to its ordered content rows.
 *
 * Presentational: maps modules/contents → {@link ModuleContentRow}; expansion
 * + selection are delegated via `onXXX` props. `"use client"` for the accordion.
 * @param props - modules, active ids, and callbacks
 */
export const ModuleAccordion = ({
    modules,
    activeModuleId,
    activeContentId,
    onExpandedChange,
    onSelectContent,
}: ModuleAccordionProps) => {
    return (
        <Accordion
            variant="default"
            className="rounded-none border-none px-0 shadow-none"
            expandedKeys={new Set(activeModuleId ? [String(activeModuleId)] : [])}
            onExpandedChange={(selection) => {
                const key = Array.from(selection)[0]
                onExpandedChange(key ? String(key) : undefined)
            }}
        >
            {
                modules.map(
                    (module) => {
                        const contents = module.contents
                            ?.slice()
                            ?.sort((prev, next) => prev.orderIndex - next.orderIndex) ?? []
                        return (
                            <Accordion.Item
                                key={String(module.id)}
                                id={String(module.id)}
                            >
                                <Accordion.Heading>
                                    <Accordion.Trigger className="w-full">
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <span
                                                className={cn(
                                                    "min-w-0 flex-1 cursor-pointer text-start text-base font-semibold",
                                                    module.id === activeModuleId ? "text-accent" : "",
                                                )}
                                            >
                                                {`${module.orderIndex + 1}. ${module.title}`}
                                            </span>
                                            <Accordion.Indicator />
                                        </div>
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body>
                                        <div className="flex flex-col gap-3">
                                            {contents.map((content, index) => (
                                                <ModuleContentRow
                                                    key={content.id}
                                                    content={content}
                                                    isActive={content.id === activeContentId}
                                                    isLast={index === contents.length - 1}
                                                    onSelectContent={onSelectContent}
                                                />
                                            ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    }
                )
            }
        </Accordion>
    )
}
