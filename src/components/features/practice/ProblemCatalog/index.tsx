"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { usePracticeFilters } from "../hooks/usePracticeFilters"
import { useCodingProblemsSwr } from "../hooks/useCodingProblemsSwr"
import { useMyCodingProgressSwr } from "../hooks/useMyCodingProgressSwr"
import {
    deriveStatus,
    filterProblems,
    sortProblems,
} from "../utils"
import { ProblemRow } from "./ProblemRow"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { CODING_DOMAIN_ORDER, type CodingDomain, type CodingProblem } from "@/modules/api/graphql/queries/types/coding"

/** Props for {@link ProblemCatalog}. */
export type ProblemCatalogProps = WithClassNames<undefined>

/** One rendered domain section: the domain plus its (already sorted) problems. */
interface CatalogGroup {
    /** The domain this section groups. */
    domain: CodingDomain
    /** Problems under the domain, in the active sort order. */
    problems: Array<CodingProblem>
}

/**
 * The practice problem list. Loads the whole catalog + the viewer's progress,
 * overlays per-problem status, applies the URL-backed client filters / search /
 * sort, then renders either domain-grouped sections (LeetCode topic style) or a
 * flat sorted list per the group toggle. Every fetch goes through
 * {@link AsyncContent} (loading skeleton, filter-aware empty, retry on error).
 * Composes blocks + the {@link ProblemRow} list-item.
 *
 * @param props - optional className for the root element.
 */
export const ProblemCatalog = ({
    className,
}: ProblemCatalogProps) => {
    const t = useTranslations()
    const { filters, isFiltered, clearFilters } = usePracticeFilters()

    const {
        data: problems,
        isLoading,
        error,
        mutate,
    } = useCodingProblemsSwr()
    // progress overlay — drives row status + the status filter (anonymous → null)
    const { data: progress } = useMyCodingProgressSwr()

    // apply client filters then sort the survivors
    const filtered = useMemo(
        () => sortProblems(filterProblems(problems ?? [], progress, filters), filters.sort),
        [problems, progress, filters],
    )

    // group the filtered+sorted problems by domain, in canonical domain order
    const groups = useMemo<Array<CatalogGroup>>(() => {
        const byDomain = new Map<CodingDomain, Array<CodingProblem>>()
        filtered.forEach((problem) => {
            const bucket = byDomain.get(problem.domain) ?? []
            bucket.push(problem)
            byDomain.set(problem.domain, bucket)
        })
        return CODING_DOMAIN_ORDER
            .filter((domain) => byDomain.has(domain))
            .map((domain) => ({ domain, problems: byDomain.get(domain) ?? [] }))
    }, [filtered])

    return (
        <AsyncContent
            isLoading={isLoading && !problems}
            // intentionally flat regardless of `filters.group` — real layout can be
            // N domain-header sections when grouped, but we keep the skeleton a
            // simple 5-row approximation rather than pre-guessing group shape
            skeleton={(
                <SurfaceListCard className={className}>
                    {[0, 1, 2, 3, 4].map((row) => (
                        <SurfaceListCardItem key={row}>
                            <div className="flex min-w-0 items-center gap-3">
                                {/* status icon */}
                                <Skeleton className="size-5 shrink-0 rounded-full" />
                                {/* title + tags */}
                                <div className="flex min-w-0 flex-col gap-2">
                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                    </div>
                                </div>
                                {/* right cluster: difficulty + domain chips + points */}
                                <div className="ml-auto flex shrink-0 items-center gap-2">
                                    <Skeleton.Chip />
                                    <Skeleton.Chip />
                                    <Skeleton.Typography type="body-xs" width="1/4" className="w-10" />
                                </div>
                            </div>
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            )}
            isEmpty={filtered.length === 0}
            emptyContent={isFiltered
                ? {
                    title: t("practice.catalog.noMatch"),
                    onRetry: clearFilters,
                    retryLabel: t("practice.catalog.clearFilters"),
                }
                : { title: t("codingPractice.empty"), description: t("codingPractice.emptyHint") }}
            error={error}
            errorContent={{
                title: t("practice.catalog.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("practice.retry"),
            }}
        >
            {filters.group ? (
                <div className={cn("flex flex-col gap-6", className)}>
                    {groups.map((group) => (
                        <section key={group.domain} className="flex flex-col gap-2">
                            {/* domain header + count */}
                            <div className="flex items-center gap-2">
                                <Typography type="h5" weight="semibold">
                                    {t(`codingPractice.domain.${group.domain}`)}
                                </Typography>
                                <Chip size="sm" variant="soft" color="default">
                                    <Chip.Label>{group.problems.length}</Chip.Label>
                                </Chip>
                            </div>
                            <SurfaceListCard>
                                {group.problems.map((problem) => (
                                    <ProblemRow
                                        key={problem.id}
                                        problem={problem}
                                        status={deriveStatus(problem.id, progress)}
                                    />
                                ))}
                            </SurfaceListCard>
                        </section>
                    ))}
                </div>
            ) : (
                <SurfaceListCard className={className}>
                    {filtered.map((problem) => (
                        <ProblemRow
                            key={problem.id}
                            problem={problem}
                            status={deriveStatus(problem.id, progress)}
                        />
                    ))}
                </SurfaceListCard>
            )}
        </AsyncContent>
    )
}
