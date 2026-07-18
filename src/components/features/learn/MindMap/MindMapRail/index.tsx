"use client"

import React, { useState } from "react"
import {
    Badge,
    Button,
    Input,
    Popover,
    ScrollShadow,
    Typography,
    cn,
} from "@heroui/react"
import { FunnelIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import type { VerdictBandVariant } from "@/components/blocks/cards/verdict-band"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Popularity floor the map is filtered to — `all` shows everything, the others hide lower tiers. */
export type MindMapTier = "all" | "medium" | "high"

/** One row in the rail's result list — a keyword the current search + filter surfaced. */
export interface MindMapRailItem {
    /** Node id — the select payload. */
    id: string
    /** Keyword label. */
    label: string
    /** Popularity tier — carried for parity; the rail row itself stays neutral. */
    popularity: string | null
    /** Ancestor path (e.g. "Observability & SRE › SRE & SLO"), for context. */
    breadcrumb: string
}

/** Tier VERDICT — the shared inset PILL band (card.md §3i) per row, signalling how common
 * the keyword is (thầy 2026-07-18). Popularity → semantic tone: common = success, mid =
 * warning, rare = danger. */
const VERDICT_BY_POP: Record<string, VerdictBandVariant> = {
    high: "success",
    medium: "warning",
    low: "danger",
}

/** Props for {@link MindMapRail}. */
export interface MindMapRailProps extends WithClassNames<undefined> {
    /** Live search text. */
    query: string
    /** Fired with the new query on every keystroke. */
    onQuery: (value: string) => void
    /** Selected popularity floor. */
    tier: MindMapTier
    /** Fired with the new tier floor. */
    onTier: (tier: MindMapTier) => void
    /** The keyword results matching search + filter (parent-computed). */
    items: ReadonlyArray<MindMapRailItem>
    /** Currently selected node id (highlights its row). */
    selectedId: string | null
    /** Fired with a picked node id — the map recentres + opens its drawer. */
    onPick: (id: string) => void
}

/**
 * The mind-map "lookup" RAIL — a resizable left column (see {@link ResizableRail}) on a
 * `bg-background` base. TOP: a search field + a FUNNEL filter (a popover holding the popularity
 * chips, so the head stays compact). BELOW: the live result LIST — a {@link LabeledCard} +
 * {@link SurfaceListCard} of keyword rows (title + ancestor breadcrumb). Typing filters the tree in
 * place (the canvas hides non-matches — a local, instant fuzzy filter, no RAG); clicking a row
 * recentres the map on that node and opens its drawer. Pure/props-only.
 *
 * @param props - {@link MindMapRailProps}
 */
export const MindMapRail = ({
    query,
    onQuery,
    tier,
    onTier,
    items,
    selectedId,
    onPick,
    className,
}: MindMapRailProps) => {
    const t = useTranslations()
    const [filterOpen, setFilterOpen] = useState(false)
    // one active facet when the floor is above "all" — surfaced as a badge on the funnel.
    const activeFacet = tier === "all" ? 0 : 1

    return (
        <div className={cn("flex h-full flex-col bg-background", className)}>
            <div className="flex items-center gap-2 border-b border-default p-3">
                <Input
                    type="search"
                    variant="primary"
                    aria-label={t("mindMap.toolbar.searchAria")}
                    placeholder={t("mindMap.toolbar.searchPlaceholder")}
                    value={query}
                    onChange={(event) => onQuery(event.target.value)}
                    className="min-w-0 flex-1"
                />
                <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                    <Button
                        isIconOnly
                        variant="ghost"
                        aria-label={t("mindMap.toolbar.tierAria")}
                        className="shrink-0"
                    >
                        {activeFacet > 0 ? (
                            <Badge.Anchor>
                                <FunnelIcon className="size-5 text-foreground" aria-hidden focusable="false" />
                                <Badge size="sm" color="accent" placement="top-left">{activeFacet}</Badge>
                            </Badge.Anchor>
                        ) : (
                            <FunnelIcon className="size-5 text-foreground" aria-hidden focusable="false" />
                        )}
                    </Button>
                    <Popover.Content className="w-64">
                        <div className="flex flex-col gap-2 p-3">
                            <Typography type="body-xs" color="muted">
                                {t("mindMap.toolbar.tierAria")}
                            </Typography>
                            <FlexWrapButtonRadio<MindMapTier>
                                value={tier}
                                onChange={onTier}
                                ariaLabel={t("mindMap.toolbar.tierAria")}
                                items={[
                                    {
                                        value: "all",
                                        content: t("mindMap.toolbar.tierAll"),
                                    },
                                    {
                                        value: "medium",
                                        content: t("mindMap.toolbar.tierCommon"),
                                    },
                                    {
                                        value: "high",
                                        content: t("mindMap.toolbar.tierCore"),
                                    },
                                ]}
                            />
                        </div>
                    </Popover.Content>
                </Popover>
            </div>
            <ScrollShadow className="min-h-0 flex-1 p-3" hideScrollBar>
                <LabeledCard label={t("mindMap.rail.count", { count: items.length })} frameless>
                    {items.length > 0 ? (
                        <SurfaceListCard bordered>
                            {items.map((item) => (
                                <SurfaceListCardRow
                                    key={item.id}
                                    title={item.label}
                                    subtitle={item.breadcrumb || undefined}
                                    selected={selectedId === item.id}
                                    onPress={() => onPick(item.id)}
                                    withVerdict={item.popularity && VERDICT_BY_POP[item.popularity]
                                        ? { enable: true, variant: VERDICT_BY_POP[item.popularity] }
                                        : undefined}
                                />
                            ))}
                        </SurfaceListCard>
                    ) : (
                        <Typography type="body-sm" color="muted" className="px-1 py-8 text-center">
                            {t("mindMap.rail.empty")}
                        </Typography>
                    )}
                </LabeledCard>
            </ScrollShadow>
        </div>
    )
}
