"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import type { CodeImplementationEntity } from "@/modules/types"
import { usePersonalProjectGithubForm } from "@/hooks/zustand"
import { ImplementationCard } from "@/components/layouts/Content/CodeImplementationBody/ImplementationCard"

export interface TaskCodeImplementationsProps {
    /** Per-language implementation guides for the task (one row per language). */
    codeImplementations: Array<CodeImplementationEntity>
}

/**
 * Implementation guide for a milestone task, shown for the language picked by the
 * top "grading language" selector in {@link PersonalProjectSubmission} — a single
 * source of truth for the active language, so this section no longer renders its
 * own language tabs. Reuses the lesson implementation card so the look matches.
 * @param props.codeImplementations - Implementation rows to choose from.
 */
export const TaskCodeImplementations = ({ codeImplementations }: TaskCodeImplementationsProps) => {
    const t = useTranslations()
    // active grading language lives in the shared github-form store (set by the top selector);
    // read-only here, so `enableSync` stays off (default) and no debounced sync runs
    const { lang } = usePersonalProjectGithubForm()

    // pick the guide for the selected language (lang vocab matches: typescript/java/csharp/go)
    const selected = useMemo(
        () => codeImplementations.find(
            (item) => item.lang?.toLowerCase() === lang?.toLowerCase(),
        ),
        [codeImplementations, lang],
    )

    // no guide authored for the selected language → render nothing for this section
    if (!selected) {
        return null
    }

    return (
        <div className="mt-6 flex flex-col gap-3">
            <div className="font-semibold">
                {t("task.codeImplementationsTitle")}
            </div>
            <ImplementationCard item={selected} />
        </div>
    )
}
