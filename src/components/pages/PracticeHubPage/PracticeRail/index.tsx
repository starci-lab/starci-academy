"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Input,
    Label,
    ListBox,
    ScrollShadow,
    TextField,
    Typography,
} from "@heroui/react"
import {
    ListChecksIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { CODING_DOMAIN_ORDER } from "@/modules/api/graphql/queries/types/coding"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { usePracticeView } from "../hooks/usePracticeView"
import { usePracticeFilters } from "../hooks/usePracticeFilters"
import type { PracticeView } from "../hooks/usePracticeView"
import type { DomainFilter } from "../types"

/**
 * The PracticeHubPage LEFT RAIL — the same docs-style sidebar as the flashcards /
 * content-map rail (a pinned header over a scroll region, full rail height). A
 * mode switch (Problems / Leaderboard) above the course-domain topics as a
 * searchable nav list. The mode drives the URL view ({@link usePracticeView}); the
 * chosen topic drives the catalog domain filter ({@link usePracticeFilters}), so
 * the rail and the work pane share one source of truth. Topics show only in
 * Problems mode (the leaderboard is topic-agnostic). Placed in the rail column by
 * the page shell; reads/writes URL state directly (no data props).
 */
export const PracticeRail = () => {
    const t = useTranslations()
    const { view, setView } = usePracticeView()
    const { filters, setFilters } = usePracticeFilters()
    const [query, setQuery] = useState("")

    /** Resolve a topic's display label ("All topics" or a domain name). */
    const topicLabel = (domain: DomainFilter): string =>
        domain === "all"
            ? t("PracticeHubPage.filters.allDomains")
            : t(`codingPractice.domain.${domain}`)

    // the topic rows: "all" + the canonical domain order, narrowed by the search box
    const topics = useMemo<Array<DomainFilter>>(() => {
        const all: Array<DomainFilter> = ["all", ...CODING_DOMAIN_ORDER]
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return all
        }
        return all.filter((domain) => topicLabel(domain).toLowerCase().includes(normalized))
    }, [query, t])

    return (
        <div className="relative flex min-h-0 min-w-0 flex-col gap-3 p-6">
            {/* pinned header: mode switch + topic search */}
            <StackV gap={4} principle="card-caption"
                explain="Holds caption text under card media so the caption stays attached to the image above it."
                items={[
                    () => (
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
                    ),
                    () => view === "problems" ? (
                        <StackV gap={3} principle="sibling-stack"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            items={[
                                () => <Label className="px-1 text-xs text-muted" data-principle="control-pad">{t("PracticeHubPage.rail.topicsLabel")}</Label>,
                                () => (
                                    <TextField>
                                        <Input
                                            type="search"
                                            aria-label={t("PracticeHubPage.rail.searchTopic")}
                                            placeholder={t("PracticeHubPage.rail.searchTopic")}
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                    </TextField>
                                ),
                            ]} />
                    ) : null,
                ]} />

            {/* scroll region: the topic nav list (problems mode only) */}
            {view === "problems" ? (
                <ScrollShadow
                    hideScrollBar
                    className="-mx-1 min-h-0 min-w-0 flex-1 overflow-y-auto px-1" data-principle="control-pad"
                >
                    {topics.length === 0 ? (
                        <Box principle="control-pad" className="px-3 py-2"
                            explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.">
                            <Typography type="body-sm" color="muted">
                                {t("PracticeHubPage.rail.searchTopicEmpty", { query: query.trim() })}
                            </Typography>
                        </Box>
                    ) : (
                        <ListBox
                            aria-label={t("PracticeHubPage.rail.topicsAria")}
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={[filters.domain]}
                            onSelectionChange={(keys) => {
                                // controlled single-select → filter the catalog by the chosen topic
                                const key = [...keys][0]
                                if (typeof key === "string") {
                                    setFilters({ domain: key as DomainFilter })
                                }
                            }}
                            className="gap-1 p-0" data-principle="title-subtitle"
                        >
                            {topics.map((domain) => (
                                <ListBox.Item
                                    key={domain}
                                    id={domain}
                                    textValue={topicLabel(domain)}
                                    className="cursor-pointer rounded-2xl px-3 py-2 text-foreground data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground" data-principle="control-pad"
                                >
                                    <Typography type="body-sm" className="min-w-0 flex-1 truncate text-inherit">
                                        {topicLabel(domain)}
                                    </Typography>
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    )}
                </ScrollShadow>
            ) : null}
        </div>
    )
}
