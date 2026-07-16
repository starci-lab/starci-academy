"use client"

import React, {
    useState,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    WeeklyBoard,
} from "./WeeklyBoard"
import {
    GlobalBoard,
} from "./GlobalBoard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { pathConfig } from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** The two leaderboard scopes the page can show. */
enum LeagueTab {
    Weekly = "weekly",
    Global = "global",
}

/** Props for {@link League}. */
export type LeagueProps = WithClassNames<undefined>

/**
 * The full leaderboard page behind the dashboard `LeagueCard`'s "see more":
 * a proper main page ({@link PageHeader} + responsive breadcrumb, per
 * `header.md` — no bare `<h1>`) with two page-level tabs — the weekly-league
 * cohort ("this week") and the global all-users board ("global"). The tabs
 * switch the WHOLE board panel, so they're a `TabsCard variant="primary"`
 * segmented pill (`tabs.md §0b`), not a filter underline. Each board
 * self-fetches; only the active one mounts (the inactive leaf query stays
 * idle). `"use client"` for tab state + breadcrumb nav.
 *
 * @param props - optional className for the root element.
 */
export const League = ({
    className,
}: LeagueProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [tab, setTab] = useState<LeagueTab>(LeagueTab.Weekly)

    return (
        <div className={cn("mx-auto w-full max-w-2xl p-3", className)}>
            <PageHeader
                breadcrumb={(
                    <ResponsiveBreadcrumb
                        items={[
                            {
                                key: "home",
                                label: t("nav.home"),
                                onPress: () => router.push(pathConfig().locale(locale).build()),
                            },
                            { key: "league", label: t("dashboard.league.pageTitle") },
                        ]}
                    />
                )}
                title={t("dashboard.league.pageTitle")}
            />

            {/* header → content = gap-10 (header.md §2); tabs + board grouped at gap-6 */}
            <div className="mt-10 flex flex-col gap-6">
                <TabsCard
                    variant="primary"
                    leftTabs={{
                        items: [
                            { key: LeagueTab.Weekly, label: t("dashboard.league.tabWeekly") },
                            { key: LeagueTab.Global, label: t("dashboard.league.tabGlobal") },
                        ],
                        selectedKey: tab,
                        ariaLabel: t("dashboard.league.pageTitle"),
                        onSelectionChange: (key) => setTab(String(key) as LeagueTab),
                    }}
                />

                {/* only the active board mounts, so the inactive leaf query stays idle */}
                {tab === LeagueTab.Weekly ? (
                    <WeeklyBoard />
                ) : (
                    <GlobalBoard />
                )}
            </div>
        </div>
    )
}
