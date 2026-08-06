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
import { StackH, StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

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
 * The PracticeHubPage problem list. Loads the whole catalog + the viewer's progress,
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
                            <StackH gap={4} align="center" principle="content-row" classNames={["min-w-0"]}
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                items={[
                                    () => <Skeleton className="size-5 shrink-0 rounded-full" />,
                                    () => (
                                        <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]}
                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                            items={[
                                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                () => (
                                                    <Box principle="chip-row" className="flex flex-wrap items-center gap-2"
                                                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column.">
                                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                                    </Box>
                                                ),
                                            ]} />
                                    ),
                                    () => (
                                        <Box principle="push-end" className="ml-auto flex shrink-0 items-center gap-2"
                                            explain="Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.">
                                            <Skeleton.Chip />
                                            <Skeleton.Chip />
                                            <Skeleton.Typography type="body-xs" width="1/4" className="w-10" />
                                        </Box>
                                    ),
                                ]} />
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            )}
            isEmpty={filtered.length === 0}
            emptyContent={isFiltered
                ? {
                    title: t("PracticeHubPage.catalog.noMatch"),
                    onRetry: clearFilters,
                    retryLabel: t("PracticeHubPage.catalog.clearFilters"),
                }
                : { title: t("codingPractice.empty"), description: t("codingPractice.emptyHint") }}
            error={error}
            errorContent={{
                title: t("PracticeHubPage.catalog.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("PracticeHubPage.retry"),
            }}
        >
            {filters.group ? (
                <div className={cn("flex flex-col gap-6", className)}>
                    {groups.map((group) => (
                        <StackV key={group.domain} gap={3} principle="sibling-stack" as="section"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            items={[
                                () => (
                                    <StackH gap={3} principle="flex-action"
                                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                        items={[
                                            () => (
                                                <Typography type="h5" weight="semibold">
                                                    {t(`codingPractice.domain.${group.domain}`)}
                                                </Typography>
                                            ),
                                            () => (
                                                <Chip size="sm" variant="soft" color="default">
                                                    <Chip.Label>{group.problems.length}</Chip.Label>
                                                </Chip>
                                            ),
                                        ]} />
                                ),
                                () => (
                                    <SurfaceListCard>
                                        {group.problems.map((problem) => (
                                            <ProblemRow
                                                key={problem.id}
                                                problem={problem}
                                                status={deriveStatus(problem.id, progress)}
                                            />
                                        ))}
                                    </SurfaceListCard>
                                ),
                            ]} />
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
