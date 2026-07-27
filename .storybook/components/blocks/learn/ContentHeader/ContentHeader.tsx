import React from "react"
import { CheckCircleIcon, ClockIcon, FlameIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentHeader`: the LESSON IDENTITY block, answering "what is this
 * lesson" at the top of the reading screen.
 *
 * WHY IT EXISTS: the screen owns a LIST OF FUNCTIONS, never a heading frame plus
 * loose atoms. `ContentHeader` is the single thing the screen calls for the
 * whole identity cluster — trail, title, description, the quiet meta strip, and
 * the "what you'll learn" list.
 *
 * SIBLING, NOT A COPY of `CourseBrief`. Both place identity into `PageHeader`,
 * but they answer different questions and carry different data: a course brief
 * counts modules/hours/learners, a lesson header carries read state, reading
 * time, challenge count, and learning outcomes. Same frame, different domain.
 *
 * CONTRACT — the block receives DATA and does ALL the wording itself (§14d.1).
 * No `meta` string, no `heading`: the caller hands over numbers and the block
 * decides the units, the separator and the order. A caller that could pass
 * `meta="12 phút đọc · 3 thử thách"` would own the shape, and the block would
 * stop owning its own appearance.
 *
 * ONE CHIP PER CLUSTER (`starci-fe/no-adjacent-chip`). The read state is the
 * classifying axis, so it gets the chip; reading time and challenge count are
 * quiet facts and ride as muted text with an inline icon. The `src` original
 * stacked a badge, a chip and a text line — three weights for three facts of
 * equal importance.
 *
 * SEAM: header proper to outcomes is `section`. They are two REGIONS of one
 * thing (what this lesson is), not two features. ⚠️ `src` writes `gap-10` there,
 * which is OFF-SCALE — the scale admits `0·1·2·3·6·8` only, so this is a
 * deliberate correction, not a transcription slip.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface ContentHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** One line of "what you'll learn" — plain data, the block builds the row. */
export interface ContentHeaderOutcome {
    /** Stable React key. */
    key: string
    /** The outcome sentence, already localized by the caller (blocks carry no i18n). */
    text: string
}

/** Props for {@link ContentHeader}. */
export interface ContentHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. */
    breadcrumbItems?: Array<ContentHeaderCrumb>
    /** Lesson title. */
    title: string
    /** One-sentence summary of the lesson. */
    description?: string
    /**
     * `true` → the learner has finished this lesson. This is the ONE classifying
     * fact in the meta cluster, so it is the one that gets a chip.
     */
    isRead?: boolean
    /** Estimated reading time in MINUTES — the block adds the word itself. */
    minutesRead?: number
    /** How many challenges hang off this lesson — the block adds the word itself. */
    challengeCount?: number
    /**
     * The "what you'll learn" lines. Empty or omitted → the whole section is not
     * drawn at all: a lesson with no stated outcomes should say nothing, not show
     * an empty card.
     */
    outcomes?: Array<ContentHeaderOutcome>
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c), so the shimmer keeps the exact box of the thing it replaces.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Lesson identity cluster at the top of the reading screen. See the file header
 * for the full contract.
 *
 * @param props - {@link ContentHeaderProps}
 */
const ContentHeader = ({
    breadcrumbItems,
    title,
    description,
    isRead = false,
    minutesRead,
    challengeCount,
    outcomes,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ContentHeaderProps) => {
    const hasOutcomes = isSkeleton || (outcomes?.length ?? 0) > 0

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                <PageHeader
                    anatPart={showAnatomy ? "PageHeader" : undefined}
                    breadcrumb={
                        isSkeleton || breadcrumbItems?.length ? (
                            <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                                <Breadcrumbs
                                    collapseOnMobile
                                    collapseFrom={4}
                                    items={breadcrumbItems ?? []}
                                    isSkeleton={isSkeleton}
                                />
                            </div>
                        ) : undefined
                    }
                    title={
                        isSkeleton ? (
                            // `PageHeader` has no `isSkeleton` of its own, so the block calls the
                            // atom directly with the EXACT size/weight the frame uses for a title
                            // and feeds the result into the slot — still "the flag reaches the
                            // atom", just from a different caller.
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
                    meta={
                        <StackH gap="related" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                            {isSkeleton ? (
                                <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                            ) : isRead ? (
                                <Chip
                                    tone="success"
                                    icon={CheckCircleIcon}
                                    text="Đã đọc"
                                    anatPart={showAnatomy ? "Chip" : undefined}
                                />
                            ) : null}
                            {isSkeleton ? (
                                <Typography size="xs" color="muted" isSkeleton className="w-40" anatPart={showAnatomy ? "Typography" : undefined} />
                            ) : (
                                <>
                                    {minutesRead != null ? (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            prefixIcon={ClockIcon}
                                            text={`${minutesRead} phút đọc`}
                                            anatPart={showAnatomy ? "Typography" : undefined}
                                        />
                                    ) : null}
                                    {challengeCount != null ? (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            prefixIcon={FlameIcon}
                                            text={`${challengeCount} thử thách`}
                                            anatPart={showAnatomy ? "Typography" : undefined}
                                        />
                                    ) : null}
                                </>
                            )}
                        </StackH>
                    }
                />
                {hasOutcomes ? (
                    <SurfaceCardList
                        label="Bạn sẽ học được gì"
                        variant="nested"
                        isSkeleton={isSkeleton}
                        anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                        items={(outcomes ?? []).map((outcome) => ({
                            key: outcome.key,
                            leadingIcon: CheckCircleIcon,
                            title: outcome.text,
                        }))}
                    />
                ) : null}
            </StackV>
        </div>
    )
}

export { ContentHeader }
