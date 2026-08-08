"use client"

import React from "react"
import { Button, ScrollShadow } from "@heroui/react"
import {
    ListChecksIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { CODING_DOMAIN_ORDER } from "@/modules/api/graphql/queries/types/coding"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { StackH } from "@/components/frames/Stack"
import { usePracticeView } from "@/hooks/usePracticeView"
import { usePracticeFilters } from "@/hooks/usePracticeFilters"
import type { PracticeView } from "@/hooks/usePracticeView"
import type { DomainFilter } from "@/modules/types/practice-hub"

/** Props for {@link PracticeMobileNav}. */
export type PracticeMobileNavProps = Record<string, never>
/** All topic options for the mobile chip row: "all" + the canonical domain order. */
const MOBILE_TOPICS: ReadonlyArray<DomainFilter> = ["all", ...CODING_DOMAIN_ORDER]

/**
 * Mobile counterpart of {@link import("..").PracticeRail}: the docs-style rail
 * hides below `lg`, so the mode switch + topic filter fold into scrollable chip
 * rows above the work pane (the master-detail mobile pattern). Reads/writes the
 * same URL state as the rail ({@link usePracticeView} + {@link usePracticeFilters}),
 * so the two stay in lockstep. Topics show only in Problems mode.
 *
 * @param props - {@link PracticeMobileNavProps}
 */
export const PracticeMobileNav = () => {
    const t = useTranslations()
    const { view, setView } = usePracticeView()
    const { filters, setFilters } = usePracticeFilters()

    return (
        <div className={"flex flex-col gap-3 @app-lg:hidden"}>
            {/* mode switch — mirrors the desktop rail's TabsCard (see PracticeRail) */}
            <TabsCard
                variant="primary"
                leftTabs={{
                    selectedKey: view,
                    ariaLabel: t("PracticeHubPage.rail.modeAria"),
                    onSelectionChange: (key) => setView(String(key) as PracticeView),
                    items: [
                        {
                            key: "problems",
                            label: (
                                <StackH gap={3} principle="flex-action" as="span"
                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                    items={[
                                        () => <ListChecksIcon className="size-4 shrink-0" aria-hidden focusable="false" />,
                                        () => <>{t("PracticeHubPage.tabs.problems")}</>,
                                    ]} />
                            ),
                        },
                        {
                            key: "leaderboard",
                            label: (
                                <StackH gap={3} principle="flex-action" as="span"
                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                    items={[
                                        () => <TrophyIcon className="size-4 shrink-0" aria-hidden focusable="false" />,
                                        () => <>{t("PracticeHubPage.tabs.leaderboard")}</>,
                                    ]} />
                            ),
                        },
                    ],
                }}
            />

            {/* topic chips — problems mode only */}
            {view === "problems" ? (
                <ScrollShadow
                    orientation="horizontal"
                    hideScrollBar
                    className="overflow-x-auto"
                >
                    <StackH
                        gap={3}
                        principle="chip-row"
                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                        items={MOBILE_TOPICS.map((domain) => (
                            () => (
                                <Button
                                    size="sm"
                                    variant={filters.domain === domain ? "secondary" : "ghost"}
                                    aria-pressed={filters.domain === domain}
                                    className="shrink-0"
                                    onPress={() => setFilters({ domain })}
                                >
                                    {domain === "all"
                                        ? t("PracticeHubPage.filters.allDomains")
                                        : t(`codingPractice.domain.${domain}`)}
                                </Button>
                            )
                        ))}
                    />
                </ScrollShadow>
            ) : null}
        </div>
    )
}
