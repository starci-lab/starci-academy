"use client"

import React, {
    useMemo,
} from "react"
import {
    Accordion,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryCourseSwr,
} from "@/hooks"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    MODULE_SUMMARY_ITEMS,
} from "./map"
import {
    ModulesSkeleton,
} from "./ModulesSkeleton"
import {
    ModuleItem,
} from "./ModuleItem"

/**
 * Modules props.
 * @param base - Optional slot class merged onto the outer wrapper.
 */
export type ModulesProps = WithClassNames<{
    /** Optional slot class merged onto the outer wrapper. */
    base: string
}>

/** Number of placeholder accordion items shown while loading. */
const SKELETON_COUNT = 3

/**
 * Modules container: pulls the course modules from redux + the load flag from
 * SWR, then renders either the skeleton or the accordion of module items.
 *
 * `"use client"` for redux selectors and the interactive HeroUI `Accordion`.
 * @param props - optional wrapper class names
 */
export const Modules = (props: ModulesProps) => {
    const modules = useAppSelector((state) => state.course.entity?.modules)
    const { isLoading } = useQueryCourseSwr()
    const t = useTranslations()

    /** Course modules to render (empty until the course is loaded). */
    const list = useMemo(
        () => modules ?? [],
        [modules],
    )

    return (
        <div className={cn(props.className, props.classNames?.base)}>
            <div className="text-lg font-semibold mb-3">{t("module.pathIntroduction")}</div>
            {isLoading ? (
                <ModulesSkeleton count={SKELETON_COUNT} />
            ) : (
                <Accordion variant="surface">
                    {list.map((module) => (
                        <ModuleItem
                            key={module.id}
                            module={module}
                            summaryItems={MODULE_SUMMARY_ITEMS}
                        />
                    ))}
                </Accordion>
            )}
        </div>
    )
}
