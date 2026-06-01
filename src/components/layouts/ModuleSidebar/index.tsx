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
    ModuleAccordion,
} from "./ModuleAccordion"
import {
    ModuleIndexStrip,
} from "./ModuleIndexStrip"
import {
    ModuleSidebarSkeleton,
} from "./ModuleSidebarSkeleton"

/**
 * Props for {@link ModuleSidebar}.
 */
type ModuleSidebarProps = WithClassNames<undefined> & {
    /** Collapsed mode: render a slim numbered index instead of the full accordion. */
    collapsed?: boolean
}

/**
 * Module navigation sidebar with a content list per module.
 *
 * Container: owns the modules SWR singleton, redux selectors, derived sorted
 * modules, and routing on expand/select; renders the presentational
 * {@link ModuleAccordion}. `"use client"` for hooks + navigation.
 * @param props - optional container class name
 */
export const ModuleSidebar = ({ className, collapsed = false }: ModuleSidebarProps) => {
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
     * data and no error; otherwise mirror the accordion via {@link ModuleSidebarSkeleton}.
     */
    const ready = !modulesSwr.isLoading
        && !!modulesSwr.data
        && !modulesSwr.error

    // shared sticky/scroll shell so every render branch lines up under the navbar
    const shellClass = cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", className)

    // collapsed rail: show only the slim numbered index (clicking a number routes to that module)
    if (collapsed) {
        return (
            <div className={shellClass}>
                <ModuleIndexStrip
                    modules={sortedModules}
                    activeModuleId={moduleId}
                    onSelectModule={onExpandedChange}
                />
            </div>
        )
    }

    if (!ready) {
        return (
            <div className={shellClass}>
                <ModuleSidebarSkeleton count={5} />
            </div>
        )
    }

    return (
        <div className={shellClass}>
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
