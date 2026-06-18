"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, Chip, Tabs } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
    queryCodingProblems,
    queryMyCodingProgress,
    CodingDifficulty,
    CODING_DOMAIN_ORDER,
    type CodingDomain,
    type CodingProblem,
} from "@/modules/api/graphql"
import { PracticeListSkeleton } from "./PracticeListSkeleton"

/** Difficulty filter options (null = all). */
const DIFFICULTY_FILTERS: Array<CodingDifficulty | null> = [
    null,
    CodingDifficulty.Easy,
    CodingDifficulty.Medium,
    CodingDifficulty.Hard,
]

/** HeroUI Chip color per difficulty. */
const DIFFICULTY_COLOR: Record<CodingDifficulty, "success" | "warning" | "danger"> = {
    [CodingDifficulty.Easy]: "success",
    [CodingDifficulty.Medium]: "warning",
    [CodingDifficulty.Hard]: "danger",
}

/** Seniority level i18n key per difficulty (easy=junior, medium=mid, hard=senior). */
const LEVEL_KEY: Record<CodingDifficulty, string> = {
    [CodingDifficulty.Easy]: "junior",
    [CodingDifficulty.Medium]: "mid",
    [CodingDifficulty.Hard]: "senior",
}

/** One rendered section: a coding domain plus the problems that fall under it. */
interface CodingDomainGroup {
    /** The coding domain this section groups. */
    domain: CodingDomain
    /** Problems belonging to the domain, in catalog order. */
    problems: Array<CodingProblem>
}

/**
 * Coding-practice problem list. Client component: fetches the problem page via
 * SWR (keyed by the difficulty filter) and renders cards grouped by domain, each
 * with its seniority level, points, tags, and a solved badge.
 */
export const PracticeList = () => {
    const t = useTranslations()
    // active difficulty filter (null = all)
    const [difficulty, setDifficulty] = useState<CodingDifficulty | null>(null)

    // fetch the problem page; re-keys when the difficulty filter changes
    const { data, isLoading } = useSWR(
        ["coding-problems", difficulty],
        async () => {
            const response = await queryCodingProblems({
                request: {
                    ...(difficulty ? { difficulty } : {}),
                    page: 1,
                    limit: 100,
                },
            })
            return response.data?.codingProblems.data ?? null
        },
    )

    // per-user status (solved ids + total points) — cached, decoupled from the
    // shared ES catalog; mirrors the challengeProgress split
    const { data: progress } = useSWR(
        ["my-coding-progress"],
        async () => {
            const response = await queryMyCodingProgress({})
            return response.data?.myCodingProgress.data ?? null
        },
    )

    // set of solved problem ids for quick lookup in the list
    const solvedIds = useMemo(
        () => new Set(progress?.solvedProblemIds ?? []),
        [progress?.solvedProblemIds],
    )

    // group the problems by domain, in the canonical domain order, keeping only
    // domains that actually have problems so empty sections never render
    const groups = useMemo<Array<CodingDomainGroup>>(() => {
        const byDomain = new Map<CodingDomain, Array<CodingProblem>>()
        data?.problems.forEach((problem) => {
            const bucket = byDomain.get(problem.domain) ?? []
            bucket.push(problem)
            byDomain.set(problem.domain, bucket)
        })
        return CODING_DOMAIN_ORDER
            .filter((domain) => byDomain.has(domain))
            .map((domain) => ({ domain, problems: byDomain.get(domain) ?? [] }))
    }, [data?.problems])

    const total = data?.problems.length ?? 0
    const solvedCount = useMemo(
        () => (data?.problems ?? []).filter((problem) => solvedIds.has(problem.id)).length,
        [data?.problems, solvedIds],
    )

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
            {/* ── header ── */}
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-2xl font-bold">{t("codingPractice.title")}</h1>
                        <p className="text-sm text-muted">{t("codingPractice.subtitle")}</p>
                    </div>
                    {/* the user's cumulative coding score (from cached progress) */}
                    {progress && (
                        <Chip size="md" variant="soft" color="accent">
                            {t("codingPractice.totalPoints", { points: progress.totalPoints })}
                        </Chip>
                    )}
                </div>
                {/* scoring legend — explains points per level */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {DIFFICULTY_FILTERS.filter((f): f is CodingDifficulty => f !== null).map((level) => (
                        <Chip key={level} size="sm" variant="soft" color={DIFFICULTY_COLOR[level]}>
                            {t(`codingPractice.level.${LEVEL_KEY[level]}`)} ·{" "}
                            {t("codingPractice.points", { points: level === CodingDifficulty.Easy ? 10 : level === CodingDifficulty.Medium ? 15 : 20 })}
                        </Chip>
                    ))}
                </div>
            </div>

            {/* ── level filter (tabs) + progress ── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Tabs
                    className="w-fit text-center"
                    selectedKey={difficulty ?? "all"}
                    onSelectionChange={(key) =>
                        setDifficulty(key === "all" ? null : (key as CodingDifficulty))
                    }
                >
                    <Tabs.ListContainer>
                        <Tabs.List
                            aria-label={t("codingPractice.filterAria")}
                            className="w-fit *:w-fit *:px-3 *:text-sm *:font-normal *:data-[selected=true]:text-accent-foreground"
                        >
                            {DIFFICULTY_FILTERS.map((filter) => (
                                <Tabs.Tab key={filter ?? "all"} id={filter ?? "all"}>
                                    {filter ? t(`codingPractice.level.${LEVEL_KEY[filter]}`) : t("codingPractice.allLevels")}
                                    <Tabs.Indicator className="bg-accent" />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
                {!isLoading && total > 0 && (
                    <span className="text-xs text-muted">
                        {t("codingPractice.solvedOf", { solved: solvedCount, total })}
                    </span>
                )}
            </div>

            {/* ── loading / empty / grouped list ── */}
            <div className="flex flex-col gap-6">
                {(isLoading || !data) && <PracticeListSkeleton />}

                {!isLoading && !!data && total === 0 && (
                    <Card className="w-full">
                        <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
                            <p className="font-medium">{t("codingPractice.empty")}</p>
                            <p className="text-sm text-muted">{t("codingPractice.emptyHint")}</p>
                        </CardContent>
                    </Card>
                )}

                {/* one section per domain, in canonical order */}
                {groups.map((group) => (
                    <section key={group.domain} className="flex flex-col gap-3">
                        {/* domain header + count */}
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-semibold">
                                {t(`codingPractice.domain.${group.domain}`)}
                            </h2>
                            <Chip size="sm" variant="soft" color="accent">
                                {group.problems.length}
                            </Chip>
                        </div>

                        {group.problems.map((problem: CodingProblem) => (
                            <Link key={problem.id} href={`/practice/${problem.slug}`}>
                                <Card className="w-full transition-colors hover:bg-surface-secondary">
                                    <CardContent className="flex flex-col gap-1.5">
                                        {/* title + level/points chips */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                {solvedIds.has(problem.id) && (
                                                    <span
                                                        className="text-success"
                                                        aria-label={t("codingPractice.solved")}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                                <span className="truncate font-medium">{problem.title}</span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-1.5">
                                                <Chip
                                                    size="sm"
                                                    variant="soft"
                                                    color={DIFFICULTY_COLOR[problem.difficulty]}
                                                >
                                                    {t(`codingPractice.level.${LEVEL_KEY[problem.difficulty]}`)}
                                                </Chip>
                                                <Chip size="sm" variant="soft" color="accent">
                                                    {t("codingPractice.points", { points: problem.points })}
                                                </Chip>
                                            </div>
                                        </div>
                                        {/* topic tags */}
                                        {problem.tags.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {problem.tags.slice(0, 4).map((tag) => (
                                                    <Chip key={tag} size="sm" variant="soft" color="default">
                                                        {tag}
                                                    </Chip>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    )
}
