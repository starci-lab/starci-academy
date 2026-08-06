import React from "react"
import { ClockIcon, PuzzlePieceIcon, StackIcon } from "@phosphor-icons/react"
import { CourseContentTier } from "@/modules/types/enums/course-content-tier"
import { Chip } from "@/components/atoms/chips/Chip"
import { Breadcrumbs } from "@/components/atoms/navigation/Breadcrumbs"
import { EnumChip, type EnumChipEntry } from "@/components/composites/chips/EnumChip"
import { HighlightChip } from "@/components/composites/chips/HighlightChip"
import { PageHeader } from "@/components/composites/layout/Page"
import { StackH } from "@/components/frames/Stack"

/**
 * `ModuleHeader` — the module-identity cluster at the top of a module's page,
 * answering "what is this module, and how big is it". Sibling of `ContentHeader`
 * and `CourseBrief`: places identity into `PageHeader`, but carries a module's tier
 * plus three `HighlightChip` counts (lessons, minutes, challenges) — the counts are
 * the headline figures, so they keep their chip shape while `tier` classifies the
 * module. Which chips draw stays states of one shape; losing the whole meta row
 * drops a `PageHeader` region and earns its own shape.
 */

/** Tier → chip presentation. The block owns this table (§14d.1: no caller-supplied color/label). */
const TIER_MAP: Record<CourseContentTier, EnumChipEntry> = {
    [CourseContentTier.Foundation]: { color: "success", label: "Foundation" },
    [CourseContentTier.Intermediate]: { color: "warning", label: "Intermediate" },
    [CourseContentTier.Advanced]: { color: "danger", label: "Advanced" },
}

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface ModuleHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link ModuleHeader}. */
export interface ModuleHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. A module is always reached through its course, so the trail is always required (no "no breadcrumb" case, same call `ContentHeader` makes). */
    breadcrumbItems: Array<ModuleHeaderCrumb>
    /** Module title. */
    title: string
    /** One-sentence summary of the module. */
    description?: string
    /** Learning tier — the ONE classifying fact, drives the `EnumChip` tone + label. Omit → no tier chip. */
    tier?: CourseContentTier
    /** How many lessons this module has — the block adds "lessons" itself. Omit or `0` → no chip. */
    lessonCount?: number
    /** Total reading/study minutes across the module — the block adds "minutes of study" itself. Omit or `0` → no chip. */
    minutesTotal?: number
    /** How many challenges hang off this module — the block adds "challenges" itself. Omit or `0` → no chip. */
    challengeCount?: number
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
}

/**
 * The module identity cluster at the top of a module's own page. See the file
 * header for the full contract and why this is a sibling of `ContentHeader`/
 * `CourseBrief` rather than an edit of either.
 *
 * @param props - {@link ModuleHeaderProps}
 */
const ModuleHeader = ({
    breadcrumbItems,
    title,
    description,
    tier,
    lessonCount,
    minutesTotal,
    challengeCount,
    isSkeleton = false,
}: ModuleHeaderProps) => {
    const hasLessons = (lessonCount ?? 0) > 0
    const hasMinutes = (minutesTotal ?? 0) > 0
    const hasChallenges = (challengeCount ?? 0) > 0
    // The meta row only exists once it has something to show — otherwise `PageHeader`
    // gets `undefined` and drops the whole slot instead of an empty row with nothing in it.
    const hasMeta = isSkeleton || tier != null || hasLessons || hasMinutes || hasChallenges

    const metaRow = hasMeta ? (
        <StackH
            gap={3}
            align="center"
            at="sm"
            principle="chip-row"
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
            isSkeleton={isSkeleton}

            items={[
                () => (isSkeleton ? (
                    <EnumChip
                        value={CourseContentTier.Foundation}
                        map={TIER_MAP}
                        isSkeleton

                    />
                ) : tier != null ? (
                    <EnumChip value={tier} map={TIER_MAP} />
                ) : null),
                () => (isSkeleton ? (
                    <span>
                        <Chip isSkeleton icon={StackIcon} />
                    </span>
                ) : hasLessons ? (
                    <span>
                        <HighlightChip
                            icon={StackIcon}
                            value={lessonCount}
                            label="lessons"
                        />
                    </span>
                ) : null),
                () => (isSkeleton ? (
                    <span>
                        <Chip isSkeleton icon={ClockIcon} />
                    </span>
                ) : hasMinutes ? (
                    <span>
                        <HighlightChip
                            icon={ClockIcon}
                            value={minutesTotal}
                            label="minutes"
                        />
                    </span>
                ) : null),
                () => (isSkeleton ? (
                    <span>
                        <Chip isSkeleton icon={PuzzlePieceIcon} />
                    </span>
                ) : hasChallenges ? (
                    <span>
                        <HighlightChip
                            icon={PuzzlePieceIcon}
                            value={challengeCount}
                            label="challenges"
                        />
                    </span>
                ) : null),
            ]}
        />
    ) : undefined

    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() => (
                    <div className="w-fit">
                        <Breadcrumbs
                            collapseOnMobile
                            collapseFrom={4}
                            items={breadcrumbItems}
                            isSkeleton={isSkeleton}
                        />
                    </div>
                )}
                title={title}
                description={description}
                meta={() => metaRow}
            />
        </div>
    )
}

export { ModuleHeader }
