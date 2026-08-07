"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { PracticeRail } from "./PracticeRail"
import { PracticeMobileNav } from "./PracticeRail/PracticeMobileNav"
import { ProgressCockpit } from "./ProgressCockpit"
import { PracticeFilters } from "./PracticeFilters"
import { ProblemCatalog } from "./ProblemCatalog"
import { CodingLeaderboard } from "./CodingLeaderboard"
import { usePracticeView } from "./hooks/usePracticeView"

/**
 * `/PracticeHubPage` — the LeetCode-style coding-PracticeHubPage page, laid out docs-style: a
 * persistent left {@link PracticeRail} (the mode switch Problems ⇄ Leaderboard +
 * the course-domain topics as a nav list) beside a padded work pane. The rail and
 * the pane share one source of truth through the URL (the {@link usePracticeView}
 * mode + the {@link PracticeFilters} topic), so navigation is shareable. Below
 * `lg` the rail folds into the in-pane {@link PracticeMobileNav} chip rows.
 *
 * The pane stacks: a {@link PageHeader}, the {@link ProgressCockpit} (the viewer's
 * solve standing, shown for BOTH views), then the active view — **Problems** (the
 * {@link PracticeFilters} bar + {@link ProblemCatalog}) or the global
 * **Leaderboard** ({@link CodingLeaderboard}). Pure composition — each child reads
 * its own SWR / URL state; this root only places them and owns the shell.
 */
export const PracticeHubPage = () => {
    const t = useTranslations()
    const router = useRouter()
    const { view } = usePracticeView()

    return (
        // single column on mobile/tablet; rail + content side-by-side from lg up
        <div className="flex w-full flex-col items-start @app-lg:flex-row">
            {/* docs-style left rail — sticks under the navbar, viewport-tall, drag-resizable */}
            <ResizableRail
                className="hidden shrink-0 @app-lg:sticky @app-lg:top-16 @app-lg:flex @app-lg:h-[calc(100dvh-4rem)] @app-lg:flex-col @app-lg:self-start"
                storageKey="starci.PracticeHubPage.rail.width"
                defaultWidth={300}
                minWidth={256}
                maxWidth={420}
                ariaLabel={t("PracticeHubPage.rail.modeAria")}
            >
                <FillAvailable at="lg" body={() => <PracticeRail />} />
            </ResizableRail>

            {/* content column — owns the canonical p-6 reading padding */}
            <Box principle="page-pad" className="min-h-0 min-w-0 flex-1 p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <Box principle="center-measure" className="mx-auto flex max-w-5xl flex-col gap-10"
                    explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                    <PageHeader
                        breadcrumb={(
                            <ResponsiveBreadcrumb
                                items={[
                                    {
                                        key: "home",
                                        label: t("nav.home"),
                                        onPress: () => router.push(pathConfig().locale().build()),
                                    },
                                    {
                                        key: "current",
                                        label: t("codingPractice.title"),
                                    },
                                ]}
                            />
                        )}
                        title={t("codingPractice.title")}
                        description={t("codingPractice.subtitle")}
                    />

                    <StackV gap={6} principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[
                            () => <PracticeMobileNav />,
                            () => <ProgressCockpit />,
                            () => (view === "problems" ? (
                                <>
                                    <Box principle="pill-pad" className="sticky top-16 z-40 bg-background py-2"
                                        explain="Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.">
                                        <PracticeFilters />
                                    </Box>
                                    <ProblemCatalog />
                                </>
                            ) : (
                                <CodingLeaderboard />
                            )),
                        ]} />
                </Box>
            </Box>
        </div>
    )
}
