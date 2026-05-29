"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { Button, Card, CardContent, Chip, Spinner } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
    queryCodingProblems,
    CodingDifficulty,
    type CodingProblem,
} from "@/modules/api/graphql"

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

/**
 * Coding-practice problem list. Client component: fetches the problem page via
 * SWR (keyed by the difficulty filter) and renders cards linking to each
 * problem, with a "solved" badge from the user's solved ids.
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

    // set of solved problem ids for quick lookup in the list
    const solvedIds = useMemo(
        () => new Set(data?.solvedProblemIds ?? []),
        [data?.solvedProblemIds],
    )

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* page heading */}
            <h1 className="text-2xl font-bold">{t("codingPractice.title")}</h1>
            <p className="mt-1 text-muted">{t("codingPractice.subtitle")}</p>

            {/* difficulty filter buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
                {DIFFICULTY_FILTERS.map((filter) => (
                    <Button
                        key={filter ?? "all"}
                        size="sm"
                        variant={difficulty === filter ? "primary" : "secondary"}
                        onPress={() => setDifficulty(filter)}
                    >
                        {filter ? t(`codingPractice.difficulty.${filter}`) : t("codingPractice.allDifficulties")}
                    </Button>
                ))}
            </div>

            {/* loading / empty / list states */}
            <div className="mt-6 flex flex-col gap-3">
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                )}

                {!isLoading && (data?.problems.length ?? 0) === 0 && (
                    <p className="py-10 text-center text-muted">
                        {t("codingPractice.empty")}
                    </p>
                )}

                {data?.problems.map((problem: CodingProblem) => (
                    <Link key={problem.id} href={`/practice/${problem.slug}`}>
                        <Card className="w-full transition-colors hover:bg-default-50">
                            <CardContent className="flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {/* solved badge */}
                                    {solvedIds.has(problem.id) && (
                                        <span className="text-success" aria-label={t("codingPractice.solved")}>
                                            ✓
                                        </span>
                                    )}
                                    <span className="font-medium">{problem.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* topic tags */}
                                    {problem.tags.slice(0, 3).map((tag) => (
                                        <Chip key={tag} size="sm" variant="soft" color="default">
                                            {tag}
                                        </Chip>
                                    ))}
                                    {/* difficulty */}
                                    <Chip size="sm" variant="soft" color={DIFFICULTY_COLOR[problem.difficulty]}>
                                        {t(`codingPractice.difficulty.${problem.difficulty}`)}
                                    </Chip>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
