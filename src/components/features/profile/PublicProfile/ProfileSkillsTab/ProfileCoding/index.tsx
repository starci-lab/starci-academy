"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Label,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    CODING_DIFFICULTY_CHIP,
    domainLabel,
} from "../codingDifficultyMeta"
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
import { StatRibbon } from "@/components/blocks/stats/StatRibbon"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"
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
 * Coding tab ("Kỹ năng & Lập trình") — the profile owner's coding-practice proof
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
    // NOT the global users.points balance the legacy "Điểm code" metric read
    const xpSwr = useQueryUserXpSwr(userId)
    const history = historySwr.data
    const skills = skillsSwr.data
    const standing = standingSwr.data
    const xp = xpSwr.data

    // null data (no coding activity yet) → treat every metric as zero
    const solved = data?.solvedProblemIds.length ?? 0

    // headline metric row (count · XP · Top đầu · Hạng), mirroring the Challenges tab.
    // percentile + rank hide when unranked (no solved problems).
    const stats: Array<{ key: string; value: React.ReactNode }> = [
        { key: "solved", value: solved },
        { key: "xp", value: xp?.codingXp ?? 0 },
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

    return (
        <AsyncContent
            isLoading={isFirstLoad}
            skeleton={(
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* headline stat ribbon — label + one card (StatPair cells) */}
                    <div className="flex flex-col gap-3">
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                    {/* stats card: difficulty / topic / language as surface list items */}
                    <div className="flex flex-col gap-3">
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <SurfaceListCard>
                            <SurfaceListCardItem>
                                <Skeleton.SegmentBar legendItems={3} />
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <div className="flex flex-wrap gap-2">
                                    {[0, 1, 2, 3, 4, 5, 6, 7].map((chip) => (
                                        <Skeleton key={chip} className="h-7 w-20 rounded-full" />
                                    ))}
                                </div>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <Skeleton.SegmentBar legendItems={3} />
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </div>
                    {/* solve history — surface list card with item rows */}
                    <div className="flex flex-col gap-3">
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <SurfaceListCard>
                            {[0, 1, 2].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            <Skeleton.Typography type="body-sm" width="1/2" />
                                            <Skeleton.Typography type="body-xs" width="1/3" />
                                        </div>
                                        <Skeleton.Chip />
                                        <Skeleton.Chip />
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </div>
                </div>
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
            <div className={cn("flex flex-col gap-6", className)}>
                {/* headline stat ribbon (solved · XP · top · rank) — labeled section, StatPair row in ONE card */}
                <LabeledCard label={t("publicProfile.coding.metricsHeading")} frameless>
                    <StatRibbon
                        items={stats.map((stat) => ({
                            key: stat.key,
                            value: stat.value,
                            label: t(`publicProfile.coding.metric.${stat.key}`),
                        }))}
                    />
                </LabeledCard>

                {/* gathered stats card — by difficulty + by topic + by language */}
                {hasStats ? (
                    <LabeledCard
                        label={t("publicProfile.coding.statsHeading")}
                        frameless
                    >
                        <SurfaceListCard>
                            {difficultySegments.length > 0 ? (
                                <SurfaceListCardItem>
                                    <div className="flex flex-col gap-2">
                                        <Label>{t("publicProfile.coding.byDifficulty")}</Label>
                                        <SegmentBar
                                            ariaLabel={t("publicProfile.coding.byDifficulty")}
                                            segments={difficultySegments}
                                        />
                                    </div>
                                </SurfaceListCardItem>
                            ) : null}
                            {orderedDomain.length > 0 ? (
                                <SurfaceListCardItem>
                                    <div className="flex flex-col gap-2">
                                        <Label>{t("publicProfile.coding.byDomain")}</Label>
                                        {/* topic mastery — all solved topics, tint deepens with count */}
                                        <TopicMasteryGrid
                                            ariaLabel={t("publicProfile.coding.byDomain")}
                                            topics={orderedDomain.map((item) => ({
                                                key: item.key,
                                                label: domainLabel(item.key),
                                                solved: item.solved,
                                            }))}
                                        />
                                    </div>
                                </SurfaceListCardItem>
                            ) : null}
                            {byLanguage.length > 0 ? (
                                <SurfaceListCardItem>
                                    <div className="flex flex-col gap-2">
                                        <Label>{t("publicProfile.coding.byLanguage")}</Label>
                                        {/* language → SegmentBar (one viz per metric, matches difficulty) */}
                                        <SegmentBar
                                            ariaLabel={t("publicProfile.coding.byLanguage")}
                                            segments={byLanguage.map((item) => ({
                                                key: item.key,
                                                label: getLanguageLabel(item.key),
                                                value: item.solved,
                                                color: getLanguageColor(item.key),
                                            }))}
                                        />
                                    </div>
                                </SurfaceListCardItem>
                            ) : null}
                        </SurfaceListCard>
                    </LabeledCard>
                ) : null}

                {/* solve history — search/filter toolbar (the "manage" layer) + surface list card */}
                {solvedHistory.length > 0 ? (
                    <LabeledCard
                        label={t("publicProfile.coding.history")}
                        frameless
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <SearchInput
                                    value={search}
                                    onValueChange={setSearch}
                                    placeholder={t("publicProfile.coding.manage.searchPlaceholder")}
                                />
                                <Typography type="body-sm" color="muted" className="shrink-0">
                                    {t("publicProfile.coding.manage.found", { count: filteredHistory.length })}
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-2">
                                {difficultyOptions.length > 0 ? (
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
                                ) : null}
                                {languageOptions.length > 0 ? (
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
                                ) : null}
                            </div>
                        </div>

                        {filteredHistory.length === 0 ? (
                            <Typography type="body-sm" color="muted" className="mt-3">
                                {t("publicProfile.coding.manage.emptyFiltered")}
                            </Typography>
                        ) : (
                            <SurfaceListCard className="mt-3">
                                {visibleHistory.map((item, index) => {
                                    const difficulty = CODING_DIFFICULTY_CHIP[item.difficulty]
                                    const solvedAt = item.firstSolvedAt
                                        ? new Date(item.firstSolvedAt).toLocaleDateString(locale)
                                        : undefined
                                    return (
                                        <SurfaceListCardItem
                                            key={`${item.slug}-${index}`}
                                            hover="underline"
                                            href={username
                                                ? pathConfig().locale(locale).profile(username).skills().problem(item.slug).build()
                                                : undefined}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* title + date */}
                                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                    <Typography type="body-sm" weight="medium" truncate className="underline-offset-2 group-hover:underline">
                                                        {item.problemTitle}
                                                    </Typography>
                                                    {solvedAt ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {solvedAt}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                                {/* difficulty · topic · languages — pushed right */}
                                                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                                                    {difficulty ? (
                                                        <StatusChip tone={difficulty.tone}>
                                                            {t(difficulty.labelKey)}
                                                        </StatusChip>
                                                    ) : null}
                                                    {item.domain ? (
                                                        <StatusChip tone="neutral">
                                                            {domainLabel(item.domain)}
                                                        </StatusChip>
                                                    ) : null}
                                                    {item.languages.map((language) => (
                                                        <LanguageChip key={language} language={language} />
                                                    ))}
                                                </div>
                                            </div>
                                        </SurfaceListCardItem>
                                    )
                                })}
                                {hiddenHistory > 0 ? (
                                    <SurfaceListCardItem onPress={() => setShowAllHistory((open) => !open)}>
                                        <span className="inline-flex items-center gap-2 text-muted">
                                            {showAllHistory
                                                ? t("publicProfile.coding.showLess")
                                                : t("publicProfile.coding.showMore", { count: hiddenHistory })}
                                        </span>
                                    </SurfaceListCardItem>
                                ) : null}
                            </SurfaceListCard>
                        )}
                    </LabeledCard>
                ) : null}
            </div>
        </AsyncContent>
    )
}
