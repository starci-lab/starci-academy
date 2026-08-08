"use client"

import React, {
    useState,
} from "react"
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
import { StackV } from "@/components/frames/Stack"
import { pathConfig } from "@/resources/path"
/** The two leaderboard scopes the page can show. */
enum LeagueTab {
    Weekly = "weekly",
    Global = "global",
}

/** Props for {@link LeaguePage}. */
export type LeaguePageProps = Record<string, never>
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
export const LeaguePage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [tab, setTab] = useState<LeagueTab>(LeagueTab.Weekly)

    return (
        <div className={"mx-auto w-full max-w-2xl p-3"} data-principle="cell-pad">
            <StackV
                principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                items={[
                    () => (
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
                    ),
                    // tabs + board grouped at block-boundary; only the active board mounts
                    () => (
                        <StackV
                            principle="block-boundary"
                            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                            items={[
                                () => (
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
                                ),
                                () => (tab === LeagueTab.Weekly ? <WeeklyBoard /> : <GlobalBoard />),
                            ]}
                        />
                    ),
                ]}
            />
        </div>
    )
}
