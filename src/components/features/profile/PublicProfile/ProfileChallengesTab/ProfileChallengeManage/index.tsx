"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Badge,
    Button,
    Popover,
    Typography,
    cn,
} from "@heroui/react"
import {
    FunnelIcon,
} from "@phosphor-icons/react"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    difficultyLevel,
} from "../ProfileChallenges/difficultyMeta"
import { pathConfig } from "@/resources/path"
import { dayjs } from "@/modules/dayjs"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Single-select difficulty filter value — `"all"` clears the filter. */
type DifficultyFilterValue = "all" | string
/** Single-select language filter value — `"all"` clears the filter. */
type LanguageFilterValue = "all" | string
/** Sort order for the submission list. */
type SortValue = "newest" | "score"

/**
 * Score → attention colour the eye catches fast: high green, mid yellow, low red.
 * @param score - the graded score (0–100).
 * @returns a `text-{token}` class for the score label.
 */
const scoreToneClass = (score: number): string => {
    if (score >= 90) {
        return "text-success-soft-foreground"
    }
    if (score >= 70) {
        return "text-warning-soft-foreground"
    }
    return "text-danger-soft-foreground"
}

/** Props for {@link ProfileChallengeManage}. */
export type ProfileChallengeManageProps = WithClassNames<undefined>

/**
 * `/profile/<u>/challenges/<courseSlug>` — the MANAGE tier of the 3-tier
 * challenges flow: search ONE course's passed-challenge submissions, with sort
 * (newest / highest score) and the difficulty/language facets tucked behind a
 * single FUNNEL popover next to the search box (keeps the toolbar one clean line).
 * Reads the course SLUG from the route, filters the profile owner's full
 * solved-challenges list down to it client-side (the list is already small
 * per-user; no server-side pagination needed here), then renders each match as
 * a nav row to the submission DETAIL page.
 *
 * @param props - optional className for the root element.
 */
export const ProfileChallengeManage = ({
    className,
}: ProfileChallengeManageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const params = useParams<{ courseId: string }>()
    const courseSlug = params?.courseId ? String(params.courseId) : null

    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
        error,
        mutate,
    } = useQueryUserSolvedChallengesSwr(userId)

    const [search, setSearch] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilterValue>("all")
    const [languageFilter, setLanguageFilter] = useState<LanguageFilterValue>("all")
    const [sort, setSort] = useState<SortValue>("newest")

    const allChallenges = data ?? []
    // scope down to THIS course only — the manage page's whole reason to exist
    const courseChallenges = useMemo(
        () => allChallenges.filter((challenge) => challenge.courseSlug === courseSlug),
        [allChallenges, courseSlug],
    )
    const courseTitle = courseChallenges[0]?.courseTitle ?? null
    // how many of the two facet filters are narrowing right now (drives the funnel badge)
    const activeFacetCount = (difficultyFilter !== "all" ? 1 : 0) + (languageFilter !== "all" ? 1 : 0)
    const clearFacets = () => {
        setDifficultyFilter("all")
        setLanguageFilter("all")
    }

    // filter option pools — only difficulties/languages actually present in this course
    const difficultyOptions = useMemo(
        () => Array.from(new Set(courseChallenges.map((challenge) => challenge.difficulty).filter((value): value is string => Boolean(value)))),
        [courseChallenges],
    )
    const languageOptions = useMemo(
        () => Array.from(new Set(courseChallenges.map((challenge) => challenge.selectedLang).filter((value): value is string => Boolean(value)))),
        [courseChallenges],
    )

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        const rows = courseChallenges.filter((challenge) => {
            if (query && !challenge.title.toLowerCase().includes(query)) {
                return false
            }
            if (difficultyFilter !== "all" && challenge.difficulty !== difficultyFilter) {
                return false
            }
            if (languageFilter !== "all" && challenge.selectedLang !== languageFilter) {
                return false
            }
            return true
        })
        const sorted = [...rows]
        if (sort === "score") {
            sorted.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
        } else {
            sorted.sort((a, b) => {
                const bTime = b.passedAt ? new Date(b.passedAt).getTime() : 0
                const aTime = a.passedAt ? new Date(a.passedAt).getTime() : 0
                return bTime - aTime
            })
        }
        return sorted
    }, [courseChallenges, search, difficultyFilter, languageFilter, sort])

    const hasActiveFilter = Boolean(search.trim() || difficultyFilter !== "all" || languageFilter !== "all")

    return (
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6", className)}>
            <PageHeader
                breadcrumb={(
                    <BackLink
                        target={t("publicProfile.challengesTab.repoHeading")}
                        onPress={() => router.push(pathConfig().locale(locale).profile(username ?? undefined).challenges().build())}
                    />
                )}
                title={courseTitle ?? t("publicProfile.challengesTab.manage.title")}
                description={t("publicProfile.challengesTab.manage.description")}
            />

            {/* search + a FUNNEL popover (difficulty/language facets) + sort, one row.
                Facets live behind the funnel so the toolbar stays a single clean line
                regardless of how many facet values exist. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SearchInput
                        className="min-w-0 flex-1"
                        value={search}
                        onValueChange={setSearch}
                        placeholder={t("publicProfile.challengesTab.manage.searchPlaceholder")}
                    />
                    <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                        <Button
                            isIconOnly
                            variant="ghost"
                            aria-label={t("publicProfile.challengesTab.manage.filterButton")}
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
                            <div className="flex flex-col gap-3 p-3">
                                <div className="flex flex-col gap-2">
                                    <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.sortHeading")}</Typography>
                                    <FlexWrapButtonRadio<SortValue>
                                        ariaLabel={t("publicProfile.challengesTab.manage.sortAria")}
                                        value={sort}
                                        onChange={setSort}
                                        items={[
                                            { value: "newest", content: t("publicProfile.challengesTab.manage.sortNewest") },
                                            { value: "score", content: t("publicProfile.challengesTab.manage.sortScore") },
                                        ]}
                                    />
                                </div>
                                {difficultyOptions.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.difficultyHeading")}</Typography>
                                        <FlexWrapButtonRadio<DifficultyFilterValue>
                                            ariaLabel={t("publicProfile.challengesTab.manage.difficultyFilterAria")}
                                            value={difficultyFilter}
                                            onChange={setDifficultyFilter}
                                            items={[
                                                { value: "all", content: t("publicProfile.challengesTab.manage.allDifficulties") },
                                                ...difficultyOptions.map((raw) => ({
                                                    value: raw,
                                                    content: <DifficultyChip difficulty={difficultyLevel(raw) ?? "beginner"} />,
                                                })),
                                            ]}
                                        />
                                    </div>
                                ) : null}
                                {languageOptions.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.languageHeading")}</Typography>
                                        <FlexWrapButtonRadio<LanguageFilterValue>
                                            ariaLabel={t("publicProfile.challengesTab.manage.languageFilterAria")}
                                            value={languageFilter}
                                            onChange={setLanguageFilter}
                                            items={[
                                                { value: "all", content: t("publicProfile.challengesTab.manage.allLanguages") },
                                                ...languageOptions.map((lang) => ({
                                                    value: lang,
                                                    content: <LanguageChip language={lang} />,
                                                })),
                                            ]}
                                        />
                                    </div>
                                ) : null}
                                {activeFacetCount > 0 ? (
                                    <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                        {t("publicProfile.challengesTab.manage.clearFilters")}
                                    </Button>
                                ) : null}
                            </div>
                        </Popover.Content>
                    </Popover>
                </div>
                <Typography type="body-sm" color="muted" className="shrink-0">
                    {t("publicProfile.challengesTab.manage.found", { count: filtered.length })}
                </Typography>
            </div>

            <AsyncContent
                isLoading={(isLoading || !userId) && courseChallenges.length === 0}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1, 2].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                )}
                isEmpty={filtered.length === 0}
                emptyContent={hasActiveFilter
                    ? {
                        title: t("publicProfile.challengesTab.manage.emptyFiltered"),
                        onRetry: () => {
                            setSearch("")
                            setDifficultyFilter("all")
                            setLanguageFilter("all")
                        },
                        retryLabel: t("jobs.list.emptyFiltered.clearFilters"),
                    }
                    : {
                        title: t("publicProfile.challengesTab.empty"),
                        description: t("publicProfile.challengesTab.emptyHint"),
                    }}
                error={courseChallenges.length === 0 ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <SurfaceListCard>
                    {filtered.map((challenge, index) => {
                        const level = difficultyLevel(challenge.difficulty)
                        const passedAt = challenge.passedAt
                            ? dayjs(challenge.passedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
                            : undefined
                        return (
                            <SurfaceListCardItem
                                key={challenge.id ?? `${challenge.submissionUrl}-${index}`}
                                hover="underline"
                                href={username && challenge.id
                                    ? pathConfig().locale(locale).profile(username).challenges()
                                        .course(courseSlug ?? "").submission(challenge.id).build()
                                    : undefined}
                            >
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <Typography type="body-sm" weight="medium" truncate className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                            {challenge.title}
                                        </Typography>
                                        <div className="flex flex-wrap items-center gap-2 sm:grid sm:grid-cols-[6rem_5.5rem_1fr]">
                                            {level ? <DifficultyChip difficulty={level} /> : null}
                                            {challenge.selectedLang ? <LanguageChip language={challenge.selectedLang} /> : null}
                                            {passedAt ? (
                                                <Typography type="body-xs" color="muted">
                                                    {passedAt}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    </div>
                                    {typeof challenge.score === "number" ? (
                                        <Typography
                                            type="body-xs"
                                            weight="medium"
                                            className={cn("shrink-0", scoreToneClass(challenge.score))}
                                        >
                                            {t("publicProfile.challengesTab.score", { score: challenge.score })}
                                        </Typography>
                                    ) : null}
                                </div>
                            </SurfaceListCardItem>
                        )
                    })}
                </SurfaceListCard>
            </AsyncContent>
        </div>
    )
}
