"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Badge,
    Button,
    Label,
    Popover,
    Typography,
} from "@heroui/react"
import {
    FunnelIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "@/hooks/profile/useProfileUsername"
import {
    CODING_DIFFICULTY_CHIP,
    domainLabel,
} from "@/modules/utils/coding-difficulty"
import { pathConfig } from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryUserCodingHistorySwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingHistorySwr"
import { useQueryUserCodingProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingProgressSwr"
import { useQueryUserCodingRankSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingRankSwr"
import { useQueryUserCodingSkillsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingSkillsSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserXpSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserXpSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"
import { StatRibbon } from "@/components/composites/stats/StatRibbon"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Solve-history rows shown before the "see more" link kicks in. */
const INITIAL_HISTORY = 6

/** Props for {@link ProfileCoding}. */
export type ProfileCodingProps = WithClassNames<undefined>

/**
 * CODING difficulty scale (easy/medium/hard ONLY — coding problems, NOT the
 * challenge beginner/intermediate/advanced/insane taxonomy). 3-tone semantic
 * colours for the distribution bar: easy → green, medium → yellow, hard → red.
 */
const CODING_DIFFICULTY: ReadonlyArray<{ key: string; labelKey: string; color: string }> = [
    { key: "easy", labelKey: "publicProfile.skillsSnapshot.diffEasy", color: "var(--success)" },
    { key: "medium", labelKey: "publicProfile.skillsSnapshot.diffMedium", color: "var(--warning)" },
    { key: "hard", labelKey: "publicProfile.skillsSnapshot.diffHard", color: "var(--danger)" },
]

/** Single-select difficulty filter value — `"all"` clears the filter. */
type DifficultyFilterValue = "all" | string
/** Single-select language filter value — `"all"` clears the filter. */
type LanguageFilterValue = "all" | string

/**
 * Coding tab ("Skills & Coding") — the profile owner's coding-practice proof
 * of work, built as a sibling of the Challenges tab: a headline metric row
 * (solved · points · acceptance · rank · top-percentile placeholder), a single
 * "Stats" {@link LabeledCard} that gathers the three breakdowns (by difficulty /
 * by topic / by language) under {@link Label} sub-headings, then a "Solve
 * history" card whose rows mirror the Challenges submission style (title on top,
 * date on the left, difficulty/topic/language chips pushed right). Self-contained:
 * reads the username from the route, resolves it to the entity id, and drives its
 * own projection-backed SWR.
 *
 * @param props - optional className for the root element.
 */
export const ProfileCoding = ({
    className,
}: ProfileCodingProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // route carries the username; resolve to the entity id the queries key off
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
        error,
        mutate,
    } = useQueryUserCodingProgressSwr(userId)
    const historySwr = useQueryUserCodingHistorySwr(userId)
    const skillsSwr = useQueryUserCodingSkillsSwr(userId)
    // coding standing — global rank + percentile by solved count (null when unranked)
    const standingSwr = useQueryUserCodingRankSwr(userId)
    // per-source XP breakdown — codingXp is the coding-only XP (ledger sum),
    // NOT the global users.points balance the legacy "Code score" metric read
    const xpSwr = useQueryUserXpSwr(userId)
    const history = historySwr.data
    const skills = skillsSwr.data
    const standing = standingSwr.data
    const xp = xpSwr.data

    // null data (no coding activity yet) → treat every metric as zero
    const solved = data?.solvedProblemIds.length ?? 0

    // headline metric row (count · XP · top percentile · rank), mirroring the Challenges tab.
    // percentile + rank hide when unranked (no solved problems).
    const stats: Array<{ key: string; value: string }> = [
        { key: "solved", value: String(solved) },
        { key: "xp", value: String(xp?.codingXp ?? 0) },
    ]
    if (standing?.percentile != null) {
        stats.push({ key: "percentile", value: `${standing.percentile}%` })
    }
    if (standing?.rank != null) {
        stats.push({ key: "rank", value: `#${standing.rank}` })
    }

    // breakdowns for the gathered "Stats" card
    const byLanguage = skills?.byLanguage ?? []
    const byDifficulty = skills?.byDifficulty ?? []
    const byDomain = skills?.byDomain ?? []
    const orderedDomain = [...byDomain].sort((a, b) => b.solved - a.solved)
    // difficulty distribution (easy→hard), coloured by the coding 3-tone scale
    const solvedByDifficulty = new Map(byDifficulty.map((item) => [item.key, item.solved]))
    const difficultySegments = CODING_DIFFICULTY
        .filter((difficulty) => (solvedByDifficulty.get(difficulty.key) ?? 0) > 0)
        .map((difficulty) => ({
            key: difficulty.key,
            label: t(difficulty.labelKey),
            value: solvedByDifficulty.get(difficulty.key) ?? 0,
            color: difficulty.color,
        }))
    const hasStats = difficultySegments.length > 0 || orderedDomain.length > 0 || byLanguage.length > 0

    const solvedHistory = history ?? []

    // search/filter toolbar (the "manage" layer) — client-side, the list is
    // already small per-user; no server-side pagination needed here.
    const [search, setSearch] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilterValue>("all")
    const [languageFilter, setLanguageFilter] = useState<LanguageFilterValue>("all")
    // difficulty/language facets live behind a FUNNEL popover (same toolbar shape as
    // ProfileChallengeManage) — the toolbar stays a single clean line regardless of how
    // many facet values exist; the funnel badges the active facet count.
    const [filterOpen, setFilterOpen] = useState(false)
    const activeFacetCount = (difficultyFilter !== "all" ? 1 : 0) + (languageFilter !== "all" ? 1 : 0)
    const clearFacets = () => {
        setDifficultyFilter("all")
        setLanguageFilter("all")
    }
    // filter option pools — only difficulties/languages actually present in the history
    const difficultyOptions = useMemo(
        () => Array.from(new Set(solvedHistory.map((item) => item.difficulty).filter(Boolean))),
        [solvedHistory],
    )
    const languageOptions = useMemo(
        () => Array.from(new Set(solvedHistory.flatMap((item) => item.languages).filter(Boolean))),
        [solvedHistory],
    )
    const filteredHistory = useMemo(() => {
        const query = search.trim().toLowerCase()
        return solvedHistory.filter((item) => {
            if (query && !item.problemTitle.toLowerCase().includes(query)) {
                return false
            }
            if (difficultyFilter !== "all" && item.difficulty !== difficultyFilter) {
                return false
            }
            if (languageFilter !== "all" && !item.languages.includes(languageFilter)) {
                return false
            }
            return true
        })
    }, [solvedHistory, search, difficultyFilter, languageFilter])

    // cap the history; the rest hides behind a "see more" link
    const [showAllHistory, setShowAllHistory] = useState(false)
    const visibleHistory = showAllHistory ? filteredHistory : filteredHistory.slice(0, INITIAL_HISTORY)
    const hiddenHistory = filteredHistory.length - INITIAL_HISTORY
    // 2026-07-12: history/skills/standing/xp fire alongside `progress` but were
    // not part of this gate — once `progress` resolved, the tab's sub-sections
    // (metric row's rank/percentile, the stats card, solve history) popped in
    // individually as each of those queries finished. Wait on all of them so the
    // one skeleton below covers the whole chain instead of only the first hop.
    const isFirstLoad = (!data && (isLoading || !userId))
        || (historySwr.isLoading && !history)
        || (skillsSwr.isLoading && !skills)
        || (standingSwr.isLoading && !standing)
        || (xpSwr.isLoading && !xp)

    const rootClassNames: Array<AllowedClassName> = []
    if (className) {
        rootClassNames.push(className as AllowedClassName)
    }

    return (
        <AsyncContent
            isLoading={isFirstLoad}
            skeleton={(
                <StackV gap={6} principle="block-boundary" classNames={rootClassNames}
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        () => (
                            <StackV gap={4} items={[
                                () => <Skeleton.Typography type="body-sm" width="1/4" />,
                                () => <Skeleton className="h-20 w-full rounded-2xl" />,
                            ]} />
                        ),
                        () => (
                            <StackV gap={4} items={[
                                () => <Skeleton.Typography type="body-sm" width="1/4" />,
                                () => (
                                    <SurfaceListCard>
                                        <SurfaceListCardItem>
                                            <Skeleton.SegmentBar legendItems={3} />
                                        </SurfaceListCardItem>
                                        <SurfaceListCardItem>
                                            <Cluster gap={3} principle="chip-row"
                                                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                items={
                                                    [0, 1, 2, 3, 4, 5, 6, 7].map((chip) => (
                                                        () => <Skeleton key={chip} className="h-7 w-20 rounded-full" />
                                                    ))
                                                } />
                                        </SurfaceListCardItem>
                                        <SurfaceListCardItem>
                                            <Skeleton.SegmentBar legendItems={3} />
                                        </SurfaceListCardItem>
                                    </SurfaceListCard>
                                ),
                            ]} />
                        ),
                        () => (
                            <StackV gap={4} items={[
                                () => <Skeleton.Typography type="body-sm" width="1/4" />,
                                () => (
                                    <Cluster gap={4} principle="content-row" justify="between"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={[
                                            () => (
                                                <StackH gap={4} principle="content-row" classNames={["min-w-0", "flex-1"]}
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    items={[
                                                        () => <Skeleton className="h-9 min-w-0 flex-1 rounded-medium" />,
                                                        () => <Skeleton className="size-9 shrink-0 rounded-full" />,
                                                    ]} />
                                            ),
                                            () => <Skeleton.Typography type="body-sm" className="w-16 shrink-0" />,
                                        ]} />
                                ),
                                () => (
                                    <SurfaceListCard>
                                        {[0, 1, 2].map((row) => (
                                            <SurfaceListCardItem key={row}>
                                                <StackH gap={4} principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    items={[
                                                        () => (
                                                            <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]}
                                                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                items={[
                                                                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                                    () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                                                ]} />
                                                        ),
                                                        () => <Skeleton.Chip />,
                                                        () => <Skeleton.Chip />,
                                                    ]} />
                                            </SurfaceListCardItem>
                                        ))}
                                    </SurfaceListCard>
                                ),
                            ]} />
                        ),
                    ]} />
            )}
            isEmpty={solved === 0 && !hasStats && solvedHistory.length === 0}
            emptyContent={{
                title: t("publicProfile.coding.empty"),
                description: t("publicProfile.coding.emptyHint"),
            }}
            error={error}
            errorContent={{
                title: t("publicProfile.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("publicProfile.loadErrorRetry"),
            }}
        >
            <StackV gap={6} principle="block-boundary" classNames={rootClassNames}
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <LabeledCard label={t("publicProfile.coding.metricsHeading")} frameless>
                            <StatRibbon
                                items={stats.map((stat) => ({
                                    key: stat.key,
                                    value: stat.value,
                                    label: t(`publicProfile.coding.metric.${stat.key}`),
                                }))}
                            />
                        </LabeledCard>
                    ),
                    ...(hasStats
                        ? [() => (
                            <LabeledCard
                                label={t("publicProfile.coding.statsHeading")}
                                frameless
                            >
                                <SurfaceListCard>
                                    {difficultySegments.length > 0 ? (
                                        <SurfaceListCardItem>
                                            <StackV gap={3} principle="sibling-stack"
                                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                items={[
                                                    () => <Label>{t("publicProfile.coding.byDifficulty")}</Label>,
                                                    () => (
                                                        <SegmentBar
                                                            ariaLabel={t("publicProfile.coding.byDifficulty")}
                                                            segments={difficultySegments}
                                                        />
                                                    ),
                                                ]} />
                                        </SurfaceListCardItem>
                                    ) : null}
                                    {orderedDomain.length > 0 ? (
                                        <SurfaceListCardItem>
                                            <StackV gap={3} principle="sibling-stack"
                                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                items={[
                                                    () => <Label>{t("publicProfile.coding.byDomain")}</Label>,
                                                    () => (
                                                        <TopicMasteryGrid
                                                            ariaLabel={t("publicProfile.coding.byDomain")}
                                                            topics={orderedDomain.map((item) => ({
                                                                key: item.key,
                                                                label: domainLabel(item.key),
                                                                solved: item.solved,
                                                            }))}
                                                        />
                                                    ),
                                                ]} />
                                        </SurfaceListCardItem>
                                    ) : null}
                                    {byLanguage.length > 0 ? (
                                        <SurfaceListCardItem>
                                            <StackV gap={3} principle="sibling-stack"
                                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                items={[
                                                    () => <Label>{t("publicProfile.coding.byLanguage")}</Label>,
                                                    () => (
                                                        <SegmentBar
                                                            ariaLabel={t("publicProfile.coding.byLanguage")}
                                                            segments={byLanguage.map((item) => ({
                                                                key: item.key,
                                                                label: getLanguageLabel(item.key),
                                                                value: item.solved,
                                                                color: getLanguageColor(item.key),
                                                            }))}
                                                        />
                                                    ),
                                                ]} />
                                        </SurfaceListCardItem>
                                    ) : null}
                                </SurfaceListCard>
                            </LabeledCard>
                        )]
                        : []),
                    ...(solvedHistory.length > 0
                        ? [() => {
                            const facetBodyItems = [
                                ...(difficultyOptions.length > 0
                                    ? [() => (
                                        <StackV gap={3} principle="sibling-stack"
                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                            items={[
                                                () => <Typography type="body-xs" color="muted">{t("publicProfile.coding.manage.difficultyHeading")}</Typography>,
                                                () => (
                                                    <FlexWrapButtonRadio<DifficultyFilterValue>
                                                        ariaLabel={t("publicProfile.coding.manage.difficultyFilterAria")}
                                                        value={difficultyFilter}
                                                        onChange={setDifficultyFilter}
                                                        items={[
                                                            { value: "all", content: t("publicProfile.coding.manage.allDifficulties") },
                                                            ...difficultyOptions.map((raw) => {
                                                                const meta = CODING_DIFFICULTY_CHIP[raw]
                                                                return {
                                                                    value: raw,
                                                                    content: meta ? <StatusChip tone={meta.tone}>{t(meta.labelKey)}</StatusChip> : raw,
                                                                }
                                                            }),
                                                        ]}
                                                    />
                                                ),
                                            ]} />
                                    )]
                                    : []),
                                ...(languageOptions.length > 0
                                    ? [() => (
                                        <StackV gap={3} principle="sibling-stack"
                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                            items={[
                                                () => <Typography type="body-xs" color="muted">{t("publicProfile.coding.manage.languageHeading")}</Typography>,
                                                () => (
                                                    <FlexWrapButtonRadio<LanguageFilterValue>
                                                        ariaLabel={t("publicProfile.coding.manage.languageFilterAria")}
                                                        value={languageFilter}
                                                        onChange={setLanguageFilter}
                                                        items={[
                                                            { value: "all", content: t("publicProfile.coding.manage.allLanguages") },
                                                            ...languageOptions.map((lang) => ({
                                                                value: lang,
                                                                content: <LanguageChip language={lang} />,
                                                            })),
                                                        ]}
                                                    />
                                                ),
                                            ]} />
                                    )]
                                    : []),
                                ...(activeFacetCount > 0
                                    ? [() => (
                                        <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                            {t("publicProfile.coding.manage.clearFilters")}
                                        </Button>
                                    )]
                                    : []),
                            ]
                            return (
                                <LabeledCard
                                    label={t("publicProfile.coding.history")}
                                    frameless
                                >
                                    <StackV gap={4} items={[
                                        () => (
                                            <Cluster gap={4} principle="content-row" justify="between"
                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                items={[
                                                    () => (
                                                        <StackH gap={4} principle="content-row" classNames={["min-w-0", "flex-1"]}
                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                            items={[
                                                                () => (
                                                                    <SearchInput
                                                                        className="min-w-0 flex-1"
                                                                        value={search}
                                                                        onValueChange={setSearch}
                                                                        placeholder={t("publicProfile.coding.manage.searchPlaceholder")}
                                                                    />
                                                                ),
                                                                ...((difficultyOptions.length > 0 || languageOptions.length > 0)
                                                                    ? [() => (
                                                                        <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                                                                            <Button
                                                                                isIconOnly
                                                                                variant="ghost"
                                                                                aria-label={t("publicProfile.coding.manage.filterButton")}
                                                                                className="shrink-0"
                                                                            >
                                                                                {activeFacetCount > 0 ? (
                                                                                    <Badge.Anchor>
                                                                                        <FunnelIcon className="size-5" />
                                                                                        <Badge size="sm" color="accent" placement="top-left">{activeFacetCount}</Badge>
                                                                                    </Badge.Anchor>
                                                                                ) : (
                                                                                    <FunnelIcon className="size-5" />
                                                                                )}
                                                                            </Button>
                                                                            <Popover.Content className="w-72">
                                                                                <StackV gap={1} padding={4} principle="cell-pad"
                                                                                    explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
                                                                                    items={[
                                                                                        () => (
                                                                                            <StackV gap={4} items={facetBodyItems} />
                                                                                        ),
                                                                                    ]} />
                                                                            </Popover.Content>
                                                                        </Popover>
                                                                    )]
                                                                    : []),
                                                            ]} />
                                                    ),
                                                    () => (
                                                        <Typography type="body-sm" color="muted" className="shrink-0">
                                                            {t("publicProfile.coding.manage.found", { count: filteredHistory.length })}
                                                        </Typography>
                                                    ),
                                                ]} />
                                        ),
                                        () => (filteredHistory.length === 0 ? (
                                            <Typography type="body-sm" color="muted">
                                                {t("publicProfile.coding.manage.emptyFiltered")}
                                            </Typography>
                                        ) : (
                                            <SurfaceListCard>
                                                {visibleHistory.map((item, index) => {
                                                    const difficulty = CODING_DIFFICULTY_CHIP[item.difficulty]
                                                    const solvedAt = item.firstSolvedAt
                                                        ? new Date(item.firstSolvedAt).toLocaleDateString(locale)
                                                        : undefined
                                                    const chipItems = [
                                                        ...(difficulty
                                                            ? [() => (
                                                                <StatusChip tone={difficulty.tone}>
                                                                    {t(difficulty.labelKey)}
                                                                </StatusChip>
                                                            )]
                                                            : []),
                                                        ...(item.domain
                                                            ? [() => (
                                                                <StatusChip tone="neutral">
                                                                    {domainLabel(item.domain!)}
                                                                </StatusChip>
                                                            )]
                                                            : []),
                                                        ...item.languages.map((language) => (
                                                            () => <LanguageChip key={language} language={language} />
                                                        )),
                                                    ]
                                                    return (
                                                        <SurfaceListCardItem
                                                            key={`${item.slug}-${index}`}
                                                            hover="underline"
                                                            href={username
                                                                ? pathConfig().locale(locale).profile(username).skills().problem(item.slug).build()
                                                                : undefined}
                                                        >
                                                            <StackH gap={4} principle="content-row"
                                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                items={[
                                                                    () => (
                                                                        <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]}
                                                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                            items={[
                                                                                () => (
                                                                                    <Typography type="body-sm" weight="medium" truncate className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                                                                        {item.problemTitle}
                                                                                    </Typography>
                                                                                ),
                                                                                ...(solvedAt
                                                                                    ? [() => (
                                                                                        <Typography type="body-xs" color="muted">
                                                                                            {solvedAt}
                                                                                        </Typography>
                                                                                    )]
                                                                                    : []),
                                                                            ]} />
                                                                    ),
                                                                    () => (
                                                                        <Cluster gap={3} principle="chip-row" justify="end" classNames={["shrink-0"]} items={chipItems}
                                                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                                        />
                                                                    ),
                                                                ]} />
                                                        </SurfaceListCardItem>
                                                    )
                                                })}
                                                {hiddenHistory > 0 ? (
                                                    <SurfaceListCardItem onPress={() => setShowAllHistory((open) => !open)}>
                                                        <span className="text-muted">
                                                            {showAllHistory
                                                                ? t("publicProfile.coding.showLess")
                                                                : t("publicProfile.coding.showMore", { count: hiddenHistory })}
                                                        </span>
                                                    </SurfaceListCardItem>
                                                ) : null}
                                            </SurfaceListCard>
                                        )),
                                    ]} />
                                </LabeledCard>
                            )
                        }]
                        : []),
                ]} />
        </AsyncContent>
    )
}
