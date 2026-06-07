"use client"

import { CurlyBrackets as BracketsCurlyIcon } from "@gravity-ui/icons"
import React, {
    useMemo,
} from "react"
import {
    Accordion,
} from "@heroui/react"
import _ from "lodash"
import type {
    ModuleEntity,
} from "@/modules/types"
import type {
    ModuleSummaryItem,
} from "../types"
import {
    ModuleSummaryChips,
} from "../ModuleSummaryChips"

/** Props for {@link ModuleItem}. */
export interface ModuleItemProps {
    /** The course module rendered by this accordion item. */
    module: ModuleEntity
    /** Summary chips (content/video/challenge counters) shown under the title. */
    summaryItems: Array<ModuleSummaryItem>
}

/**
 * One module accordion item: title + description + summary chips, expanding to
 * the ordered preview contents.
 *
 * Presentational: sorts the supplied preview contents for display only.
 * `"use client"` because HeroUI `Accordion` is interactive.
 * @param props - the module entity and its summary chips
 */
export const ModuleItem = ({
    module,
    summaryItems,
}: ModuleItemProps) => {
    /** Preview contents sorted by their display order (clone to avoid mutating redux state). */
    const previewContents = useMemo(
        () => _.cloneDeep(module.previewContents ?? []).sort(
            (previous, current) => previous.orderIndex - current.orderIndex,
        ),
        [module.previewContents],
    )
    return (
        <Accordion.Item aria-label={module.title}>
            <Accordion.Heading>
                <Accordion.Trigger>
                    <div className="flex w-full items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 text-start">
                            <div className="text-lg font-semibold mb-1.5">{module.title}</div>
                            <div>
                                <div className="text-sm text-muted">{module.description}</div>
                                <ModuleSummaryChips items={summaryItems} />
                            </div>
                        </div>
                        <Accordion.Indicator />
                    </div>
                </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
                <Accordion.Body>
                    <div className="text-sm text-start w-full gap-3 flex flex-col">
                        {previewContents.map((content) => (
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
    )
}
