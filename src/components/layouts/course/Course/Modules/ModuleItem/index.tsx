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
    WithClassNames,
} from "@/modules/types"
import {
    MODULE_SUMMARY_ITEMS,
} from "../map"
import {
    ModuleSummaryChips,
} from "../ModuleSummaryChips"

/** Props for {@link ModuleItem}. */
export interface ModuleItemProps extends WithClassNames<undefined> {
    /** The course module rendered by this accordion item. */
    module: ModuleEntity
}

/**
 * One module accordion item: title + description + summary chips, expanding to
 * the ordered preview contents.
 *
 * List item: receives its own module entity from the parent .map(); derives
 * all other data internally. `"use client"` because HeroUI `Accordion` is
 * interactive.
 * @param props - the module entity and optional class names
 */
export const ModuleItem = ({
    module,
}: ModuleItemProps) => {
    /** Preview contents sorted by their display order (clone to avoid mutating redux state). */
    const previewContents = useMemo(
        () => _.cloneDeep(module.previewContents ?? []).sort(
            (previous, current) => previous.sortIndex - current.sortIndex,
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
                                <ModuleSummaryChips items={MODULE_SUMMARY_ITEMS} />
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
                            <div key={content.id} className="flex items-center gap-1.5">
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
