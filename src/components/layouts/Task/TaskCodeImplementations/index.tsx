"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import type { CodeImplementationEntity } from "@/modules/types"
import { CodeItemTabs } from "@/components/layouts/Content/CodeLessonBody/CodeItemTabs"
import { ImplementationCard } from "@/components/layouts/Content/CodeImplementationBody/ImplementationCard"

export interface TaskCodeImplementationsProps {
    /** Per-language implementation guides for the task (one row per language). */
    codeImplementations: Array<CodeImplementationEntity>
}

/**
 * Per-language implementation guides for a milestone task, rendered as language tabs.
 * Reuses the lesson code-implementation card + tab primitives so the look matches.
 * @param props.codeImplementations - Implementation rows to tab through.
 */
export const TaskCodeImplementations = ({ codeImplementations }: TaskCodeImplementationsProps) => {
    const t = useTranslations()

    const items = useMemo(
        () => codeImplementations
            .slice()
            .sort((prev, next) => prev.orderIndex - next.orderIndex),
        [codeImplementations],
    )

    if (!items.length) {
        return null
    }

    return (
        <div className="mt-6 flex flex-col gap-3">
            <div className="font-semibold">
                {t("task.codeImplementationsTitle")}
            </div>
            <CodeItemTabs<CodeImplementationEntity>
                items={items}
                ariaLabel={t("task.codeImplementationsTabsAria")}
                getTabLabel={(item) => item.lang}
                renderPanel={(item) => <ImplementationCard item={item} />}
            />
        </div>
    )
}
