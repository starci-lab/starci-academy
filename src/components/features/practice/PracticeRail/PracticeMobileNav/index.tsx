"use client"

import React from "react"
import {
    Button,
    ScrollShadow,
    cn,
} from "@heroui/react"
import {
    ListChecksIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { CODING_DOMAIN_ORDER } from "@/modules/api/graphql/queries/types/coding"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import { usePracticeView } from "../../hooks/usePracticeView"
import { usePracticeFilters } from "../../hooks/usePracticeFilters"
import type { PracticeView } from "../../hooks/usePracticeView"
import type { DomainFilter } from "../../types"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PracticeMobileNav}. */
export type PracticeMobileNavProps = WithClassNames<undefined>

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
export const PracticeMobileNav = ({ className }: PracticeMobileNavProps) => {
    const t = useTranslations()
    const { view, setView } = usePracticeView()
    const { filters, setFilters } = usePracticeFilters()

    return (
        <div className={cn("flex flex-col gap-3 lg:hidden", className)}>
            {/* mode switch — mirrors the desktop rail's SegmentedControl (see PracticeRail) */}
            <SegmentedControl<PracticeView>
                ariaLabel={t("practice.rail.modeAria")}
                value={view}
                onChange={setView}
                items={[
                    {
                        value: "problems",
                        label: (
                            <span className="flex items-center gap-2">
                                <ListChecksIcon className="size-4 shrink-0" aria-hidden focusable="false" />
                                {t("practice.tabs.problems")}
                            </span>
                        ),
                    },
                    {
                        value: "leaderboard",
                        label: (
                            <span className="flex items-center gap-2">
                                <TrophyIcon className="size-4 shrink-0" aria-hidden focusable="false" />
                                {t("practice.tabs.leaderboard")}
                            </span>
                        ),
                    },
                ]}
            />

            {/* topic chips — problems mode only */}
            {view === "problems" ? (
                <ScrollShadow
                    orientation="horizontal"
                    hideScrollBar
                    className="flex gap-2 overflow-x-auto"
                >
                    {MOBILE_TOPICS.map((domain) => (
                        <Button
                            key={domain}
                            size="sm"
                            variant={filters.domain === domain ? "secondary" : "ghost"}
                            aria-pressed={filters.domain === domain}
                            className="shrink-0"
                            onPress={() => setFilters({ domain })}
                        >
                            {domain === "all"
                                ? t("practice.filters.allDomains")
                                : t(`codingPractice.domain.${domain}`)}
                        </Button>
                    ))}
                </ScrollShadow>
            ) : null}
        </div>
    )
}
