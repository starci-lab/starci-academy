"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/blocks"
import { ProgressCockpit } from "./ProgressCockpit"
import { PracticeFilters } from "./PracticeFilters"
import { ProblemCatalog } from "./ProblemCatalog"

/**
 * `/practice` — the LeetCode-style coding-practice catalog (phase 1: the list /
 * cockpit page). Composes, top to bottom: a {@link PageHeader}, the
 * {@link ProgressCockpit} (the viewer's solve standing), the {@link PracticeFilters}
 * bar (search + difficulty/status chips + domain/sort dropdowns + group toggle,
 * all URL-backed), and the {@link ProblemCatalog} list. Pure composition — each
 * child reads its own SWR / filter state; this root only places them.
 */
export const Practice = () => {
    const t = useTranslations()

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6">
            <PageHeader
                title={t("codingPractice.title")}
                description={t("codingPractice.subtitle")}
            />

            <ProgressCockpit />

            {/* filter bar sticks below the navbar while scrolling the catalog */}
            <PracticeFilters className="sticky top-16 z-40 bg-background py-2" />

            <ProblemCatalog />
        </div>
    )
}
