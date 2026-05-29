"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import _ from "lodash"
import {
    useRouter,
} from "next/navigation"
import {
    useLocale,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources/path"
import {
    useQueryModulesSwr,
} from "@/hooks"
import {
    ModulesSkeleton,
} from "@/components/layouts/Course/Modules/ModulesSkeleton"
import {
    ModuleAccordion,
} from "./ModuleAccordion"

/**
 * Props for {@link ModuleSidebar}.
 */
type ModuleSidebarProps = WithClassNames<undefined>

/**
 * Module navigation sidebar with a content list per module.
 *
 * Container: owns the modules SWR singleton, redux selectors, derived sorted
 * modules, and routing on expand/select; renders the presentational
 * {@link ModuleAccordion}. `"use client"` for hooks + navigation.
 * @param props - optional container class name
 */
export const ModuleSidebar = (props: ModuleSidebarProps) => {
    const modulesSwr = useQueryModulesSwr()
    const moduleId = useAppSelector((state) => state.module.id)
    const modules = useAppSelector((state) => state.module.modules)
    const router = useRouter()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const activeContent = useAppSelector((state) => state.content.entity)

    /** Modules cloned + sorted by their display order. */
    const sortedModules = useMemo(
        () => _.cloneDeep(modules ?? []).sort((a, b) => a.orderIndex - b.orderIndex),
        [
            modules,
        ],
    )

    /** Route to the newly expanded module (or the collapsed state). */
    const onExpandedChange = useCallback(
        (nextModuleId?: string) => {
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().module(nextModuleId).build(),
            )
        },
        [
            router,
            locale,
            courseDisplayId,
        ],
    )

    /** Route to the chosen content within the active module. */
    const onSelectContent = useCallback(
        (contentId: string) => {
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleId).content(contentId).build(),
            )
        },
        [
            router,
            locale,
            courseDisplayId,
            moduleId,
        ],
    )

    /**
     * Loading gate: show content only when the modules query has settled with
     * data and no error; otherwise mirror the accordion via {@link ModulesSkeleton}.
     */
    const ready = !modulesSwr.isLoading && !modulesSwr.isValidating && !!modulesSwr.data && !modulesSwr.error

    if (!ready) {
        return (
            <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", props.className)}>
                <ModulesSkeleton count={5} />
            </div>
        )
    }

    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", props.className)}>
            <ModuleAccordion
                modules={sortedModules}
                activeModuleId={moduleId}
                activeContentId={activeContent?.id}
                onExpandedChange={onExpandedChange}
                onSelectContent={onSelectContent}
            />
        </div>
    )
}
