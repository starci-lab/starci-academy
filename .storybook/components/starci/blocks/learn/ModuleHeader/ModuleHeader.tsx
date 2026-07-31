import React from "react"
import { ClockIcon, PuzzlePieceIcon, StackIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ModuleHeader`: the MODULE IDENTITY block, answering "what is this
 * module, and how big is it" at the top of a module's own page.
 *
 * THIRD SIBLING of `ContentHeader` (lesson identity) and `CourseBrief` (course
 * identity), NOT a copy of either. All three place identity into the same
 * `PageHeader` frame with a `Breadcrumbs` trail, but each answers a different
 * question with different domain fields: a lesson header carries read state /
 * minutes / challenge count / outcomes, a course brief counts modules / hours /
 * learners, this block carries a module's TIER plus three counts of its own
 * (lessons, minutes, challenges). Same frame, different domain — see
 * `ContentHeader`'s file header for why that makes it a new block rather than a
 * prop bolted onto an existing one.
 *
 * ⭐ TIER GETS THE ONE CLASSIFYING CHIP; the three counts stay `HighlightChip`s,
 * not muted text. `ContentHeader` collapses its meta row down to "one chip,
 * rest as quiet text" (`starci-fe/no-adjacent-chip`) because its two non-chip
 * facts are incidental. Here the three counts ARE the module's headline
 * figures — "12 bài · 145 phút học · 6 thử thách" is the exact meta row the
 * real `ModulePage` shows — so they keep the `HighlightChip` shape the source
 * already gives them. The rule's INTENT still holds, the same way
 * `ChallengeHeader` keeps two chips on purpose (see its file header): `tier`
 * is the only fact here that CLASSIFIES the module, the rest only COUNT
 * something, and the lint rule matches literal `<Chip>` siblings — composing
 * through `EnumChip`/`HighlightChip` does not trip it either way.
 *
 * A COUNT OF ZERO IS NOT NEWS — same idiom `ContentModeNav` uses for its tab
 * counts. Each `HighlightChip` only renders once its count is `> 0`; a brand
 * new module with no challenges yet should not show a "0 thử thách" pill
 * claiming something is there. (The real `ModulePage` already applies this to
 * its challenge count; this block extends the same reasoning to lessons and
 * minutes for one consistent rule instead of a special case per field.)
 *
 * CONTRACT — the block takes DATA, never a pre-formatted string (§14d.1):
 * `tier` is the raw enum, the three counts are raw numbers. The block owns the
 * tier→label/tone table and the chip words ("bài" / "phút học" / "thử thách")
 * itself — a caller that could pass `meta="12 bài · 145 phút học"` would own
 * the join, the units and the separator, and the block would stop owning its
 * own shape.
 *
 * SKELETON — `EnumChip` carries its own `isSkeleton` (used directly here, the
 * same way `ChallengeHeader` drives its difficulty/status chips). `HighlightChip`
 * has NO `isSkeleton` of its own yet (outside this block's edit boundary), so
 * its shimmer mirror calls the `Chip` atom directly instead, passing the SAME
 * icon so the pill keeps the real chip's icon-plus-label footprint — the same
 * move `ContentHeader`/`CourseBrief` use for `PageHeader`'s title/description
 * slots: the flag still reaches a real atom, just from a different caller. All
 * four pills render during `isSkeleton` regardless of whether the real props
 * end up empty, so the row does not resize once data lands (§8).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Learning tier of a module — mirrors the `src` `CourseContentTier` enum (GraphQL / DB, shared across every course). */
export enum CourseContentTier {
    /** Entry-level material — always free. */
    Foundation = "foundation",
    /** Mid-level material — the later half is premium. */
    Intermediate = "intermediate",
    /** Advanced material — always premium. */
    Advanced = "advanced",
}

/** Tier → chip presentation. The block owns this table (§14d.1: no caller-supplied color/label). */
const TIER_MAP: Record<CourseContentTier, EnumChipEntry> = {
    [CourseContentTier.Foundation]: { color: "success", label: "Nền tảng" },
    [CourseContentTier.Intermediate]: { color: "warning", label: "Trung cấp" },
    [CourseContentTier.Advanced]: { color: "danger", label: "Nâng cao" },
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
    /** How many lessons this module has — the block adds "bài" itself. Omit or `0` → no chip. */
    lessonCount?: number
    /** Total reading/study minutes across the module — the block adds "phút học" itself. Omit or `0` → no chip. */
    minutesTotal?: number
    /** How many challenges hang off this module — the block adds "thử thách" itself. Omit or `0` → no chip. */
    challengeCount?: number
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ModuleHeaderProps) => {
    const hasLessons = (lessonCount ?? 0) > 0
    const hasMinutes = (minutesTotal ?? 0) > 0
    const hasChallenges = (challengeCount ?? 0) > 0
    // The meta row only exists once it has something to show — otherwise `PageHeader`
    // gets `undefined` and drops the whole slot instead of an empty row with nothing in it.
    const hasMeta = isSkeleton || tier != null || hasLessons || hasMinutes || hasChallenges

    const metaRow = hasMeta ? (
        <StackH
            gap="related"
            align="center"
            wrap
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    {isSkeleton ? (
                        <EnumChip
                            value={CourseContentTier.Foundation}
                            map={TIER_MAP}
                            isSkeleton
                            anatPart={showAnatomy ? "EnumChip" : undefined}
                        />
                    ) : tier != null ? (
                        <EnumChip value={tier} map={TIER_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />
                    ) : null}
                    {isSkeleton ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <Chip isSkeleton icon={StackIcon} />
                        </span>
                    ) : hasLessons ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <HighlightChip
                                icon={<StackIcon aria-hidden focusable="false" className="size-4" />}
                                value={lessonCount}
                                label="bài"
                            />
                        </span>
                    ) : null}
                    {isSkeleton ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <Chip isSkeleton icon={ClockIcon} />
                        </span>
                    ) : hasMinutes ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <HighlightChip
                                icon={<ClockIcon aria-hidden focusable="false" className="size-4" />}
                                value={minutesTotal}
                                label="phút học"
                            />
                        </span>
                    ) : null}
                    {isSkeleton ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <Chip isSkeleton icon={PuzzlePieceIcon} />
                        </span>
                    ) : hasChallenges ? (
                        <span data-anat-part={showAnatomy ? "HighlightChip" : undefined}>
                            <HighlightChip
                                icon={<PuzzlePieceIcon aria-hidden focusable="false" className="size-4" />}
                                value={challengeCount}
                                label="thử thách"
                            />
                        </span>
                    ) : null}
                </>
            }
        />
    ) : undefined

    return (
        <div data-anat-part={anatPart}>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                breadcrumb={
                    <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                        <Breadcrumbs
                            collapseOnMobile
                            collapseFrom={4}
                            items={breadcrumbItems}
                            isSkeleton={isSkeleton}
                        />
                    </div>
                }
                title={
                    isSkeleton ? (
                        // `PageHeader` has no `isSkeleton` of its own, so the block calls the
                        // atom directly with the EXACT size/weight the frame uses for a title
                        // and feeds the result into the slot.
                        <Typography size="h3" weight="bold" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        <span data-anat-part={showAnatomy ? "Typography" : undefined}>{title}</span>
                    )
                }
                description={
                    isSkeleton ? (
                        <Typography size="sm" color="muted" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        description
                    )
                }
                meta={metaRow}
            />
        </div>
    )
}

export { ModuleHeader }
