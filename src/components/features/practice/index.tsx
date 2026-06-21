"use client"

import React, { useState } from "react"
import { Tabs } from "@heroui/react"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/blocks"
import { LearnBreadcrumb } from "../learn/shared/LearnBreadcrumb"
import { ProgressCockpit } from "./ProgressCockpit"
import { PracticeFilters } from "./PracticeFilters"
import { ProblemCatalog } from "./ProblemCatalog"
import { CodingLeaderboard } from "./CodingLeaderboard"

/** The two views under the practice cockpit. */
enum PracticeTab {
    Problems = "problems",
    Leaderboard = "leaderboard",
}

/**
 * `/practice` — the LeetCode-style coding-practice page. Composes, top to bottom:
 * a {@link PageHeader}, the {@link ProgressCockpit} (the viewer's solve standing,
 * shown for BOTH tabs), then a tab switcher between two peer views — **Problems**
 * (the {@link PracticeFilters} bar + {@link ProblemCatalog}, the default) and the
 * global **Leaderboard** ({@link CodingLeaderboard}, ranked by problems solved).
 * Pure composition — each child reads its own SWR / filter state; this root only
 * places them and owns the local tab state.
 */
export const Practice = () => {
    const t = useTranslations()
    const [tab, setTab] = useState<PracticeTab>(PracticeTab.Problems)

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <PageHeader
                breadcrumb={<LearnBreadcrumb current={t("codingPractice.title")} />}
                title={t("codingPractice.title")}
                description={t("codingPractice.subtitle")}
            />

            {/* the viewer's own standing — stays above both tabs */}
            <ProgressCockpit />

            <Tabs
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(String(key) as PracticeTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("codingPractice.title")}>
                        <Tabs.Tab
                            key={PracticeTab.Problems}
                            id={PracticeTab.Problems}
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("practice.tabs.problems")}
                        </Tabs.Tab>
                        <Tabs.Tab
                            key={PracticeTab.Leaderboard}
                            id={PracticeTab.Leaderboard}
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("practice.tabs.leaderboard")}
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* only the active view mounts, so the idle tab's query stays idle */}
            {tab === PracticeTab.Problems ? (
                <>
                    {/* filter bar sticks below the navbar while scrolling the catalog */}
                    <PracticeFilters className="sticky top-16 z-40 bg-background py-2" />
                    <ProblemCatalog />
                </>
            ) : (
                <CodingLeaderboard />
            )}
        </div>
    )
}
