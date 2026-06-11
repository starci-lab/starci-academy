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
    /** Currently expanded module id (controlled from URL / Redux). */
    activeModuleId?: string
    /** Currently active content id (highlights its link). */
    activeContentId?: string
    /** Fired when a content link is pressed. */
    onSelectContent: (moduleId: string, contentId: string) => void
    /** Fired with the module id when a (different) module header is expanded — routes to it. */
    onExpandModule: (moduleId: string) => void
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
    onSelectContent,
    onExpandModule,
}: ModuleAccordionProps) => {
    return (
        <Accordion
            variant="default"
            className="rounded-none border-none px-0 shadow-none"
            expandedKeys={new Set(activeModuleId ? [String(activeModuleId)] : [])}
            onExpandedChange={(keys) => {
                // single-expand: route to the newly-expanded module (the key that isn't the active one).
                const nextModuleId = Array.from(keys).find((key) => String(key) !== String(activeModuleId))
                if (nextModuleId) {
                    onExpandModule(String(nextModuleId))
                }
            }}
        >
            {
                modules.map(
                    (module) => {
                        const contents = module.contents
                            ?.slice()
                            ?.sort((prev, next) => prev.sortIndex - next.sortIndex) ?? []
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
                                                {`${module.sortIndex}. ${module.title}`}
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
                                                    onSelectContent={(contentId) => onSelectContent(String(module.id), contentId)}
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
