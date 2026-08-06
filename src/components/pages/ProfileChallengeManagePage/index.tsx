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
} from "@/hooks/profile/useProfileUsername"
import {
    difficultyLevel,
} from "@/modules/utils/challenge-difficulty"
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
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
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

/** Props for {@link ProfileChallengeManagePage}. */
export type ProfileChallengeManagePageProps = WithClassNames<undefined>

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
export const ProfileChallengeManagePage = ({
    className,
}: ProfileChallengeManagePageProps) => {
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
            <Cluster gap={4} principle="content-row" justify="between" align="center" classNames={["w-full"]}
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (
                        <StackH gap={4} principle="flex-action" classNames={["min-w-0", "flex-1"]}
                            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                            items={[
                                () => (
                                    <SearchInput
                                        className="min-w-0 flex-1"
                                        value={search}
                                        onValueChange={setSearch}
                                        placeholder={t("publicProfile.challengesTab.manage.searchPlaceholder")}
                                    />
                                ),
                                () => (
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
                                            <Box principle="cell-pad" className="p-3"
                                                explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.">
                                                <StackV gap={4} principle="group-boundary"
                                                    explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                                                    items={[
                                                        () => (
                                                            <StackV gap={4} principle="label-field"
                                                                explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                                                items={[
                                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.sortHeading")}</Typography>,
                                                                    () => (
                                                                        <FlexWrapButtonRadio<SortValue>
                                                                            ariaLabel={t("publicProfile.challengesTab.manage.sortAria")}
                                                                            value={sort}
                                                                            onChange={setSort}
                                                                            items={[
                                                                                { value: "newest", content: t("publicProfile.challengesTab.manage.sortNewest") },
                                                                                { value: "score", content: t("publicProfile.challengesTab.manage.sortScore") },
                                                                            ]}
                                                                        />
                                                                    ),
                                                                ]} />
                                                        ),
                                                        ...(difficultyOptions.length > 0 ? [() => (
                                                            <StackV gap={4} principle="label-field"
                                                                explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                                                items={[
                                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.difficultyHeading")}</Typography>,
                                                                    () => (
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
                                                                    ),
                                                                ]} />
                                                        )] : []),
                                                        ...(languageOptions.length > 0 ? [() => (
                                                            <StackV gap={4} principle="label-field"
                                                                explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                                                items={[
                                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.languageHeading")}</Typography>,
                                                                    () => (
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
                                                                    ),
                                                                ]} />
                                                        )] : []),
                                                        ...(activeFacetCount > 0 ? [() => (
                                                            <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                                                {t("publicProfile.challengesTab.manage.clearFilters")}
                                                            </Button>
                                                        )] : []),
                                                    ]} />
                                            </Box>
                                        </Popover.Content>
                                    </Popover>
                                ),
                            ]} />
                    ),
                    () => (
                        <Typography type="body-sm" color="muted" className="shrink-0">
                            {t("publicProfile.challengesTab.manage.found", { count: filtered.length })}
                        </Typography>
                    ),
                ]} />

            <AsyncContent
                isLoading={(isLoading || !userId) && courseChallenges.length === 0}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1, 2].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <StackV gap={2} principle="title-subtitle"
                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                    items={[
                                        () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                        () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                    ]} />
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
                        const selectedLang = challenge.selectedLang
                        const score = challenge.score
                        return (
                            <SurfaceListCardItem
                                key={challenge.id ?? `${challenge.submissionUrl}-${index}`}
                                hover="underline"
                                href={username && challenge.id
                                    ? pathConfig().locale(locale).profile(username).challenges()
                                        .course(courseSlug ?? "").submission(challenge.id).build()
                                    : undefined}
                            >
                                <StackH gap={4} principle="content-row" justify="between" align="center"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    items={[
                                        () => (
                                            <StackV gap={2} principle="title-subtitle" classNames={["min-w-0", "flex-1"]}
                                                explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                items={[
                                                    () => (
                                                        <Typography type="body-sm" weight="medium" truncate className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                                            {challenge.title}
                                                        </Typography>
                                                    ),
                                                    () => (
                                                        <Cluster gap={3} principle="chip-row" align="center"
                                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                            items={[
                                                                ...(level ? [() => <DifficultyChip difficulty={level} />] : []),
                                                                ...(selectedLang ? [() => <LanguageChip language={selectedLang} />] : []),
                                                                ...(passedAt ? [() => (
                                                                    <Typography type="body-xs" color="muted">
                                                                        {passedAt}
                                                                    </Typography>
                                                                )] : []),
                                                            ]} />
                                                    ),
                                                ]} />
                                        ),
                                        ...(typeof score === "number" ? [() => (
                                            <Typography
                                                type="body-xs"
                                                weight="medium"
                                                className={cn("shrink-0", scoreToneClass(score))}
                                            >
                                                {t("publicProfile.challengesTab.score", { score })}
                                            </Typography>
                                        )] : []),
                                    ]} />
                            </SurfaceListCardItem>
                        )
                    })}
                </SurfaceListCard>
            </AsyncContent>
        </div>
    )
}
