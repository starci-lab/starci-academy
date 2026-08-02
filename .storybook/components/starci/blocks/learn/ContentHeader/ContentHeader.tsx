import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentHeader` — a BLOCK: the lesson identity block at the top of the reading
 * screen — the single thing the screen calls for the whole identity cluster: trail,
 * title, description, the quiet meta strip, and the "what you'll learn" list.
 *
 * A sibling of `CourseBrief`, not a copy: both place identity into `PageHeader`, but
 * a lesson header carries read state, reading time, challenge count, and learning
 * outcomes rather than a course's module/hour/learner counts.
 *
 * Receives DATA and does all the wording itself — no `meta` string, no `heading`:
 * the caller hands numbers and the block decides units, separator, and order.
 *
 * One chip per cluster: the read state is the classifying axis and gets the chip;
 * reading time and challenge count ride as muted text with an inline icon. The seam
 * from the header proper to the outcomes list is `section` (two regions of one
 * thing).
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
}: ContentHeaderProps) => {
    const hasOutcomes = isSkeleton || (outcomes?.length ?? 0) > 0

    const metaRow = (
        <>
            {isSkeleton ? (
                <Chip isSkeleton />
            ) : isRead ? (
                <Chip
                    tone="success"
                    icon={CheckCircleIcon}
                    text="Read"

                />
            ) : null}
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton classNames={["w-2/3"]} />
            ) : (
                <>
                    {minutesRead != null ? (
                        <Typography
                            size="xs"
                            color="muted"
                            text={`${minutesRead} min read`}

                        />
                    ) : null}
                    {challengeCount != null ? (
                        <Typography
                            size="xs"
                            color="muted"
                            text={`${challengeCount} challenges`}

                        />
                    ) : null}
                </>
            )}
        </>
    )

    const headerBody = (
        <>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit">
                            <Breadcrumbs
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems ?? []}
                                isSkeleton={isSkeleton}
                            />
                        </div>
                    ) : undefined
                }
                title={title}
                description={description}
                meta={() =>
                    <StackH gap={3} align="center" isSkeleton={isSkeleton} items={[() => metaRow]} />
                }
            />
            {hasOutcomes ? (
                <SurfaceCardList
                    label="What you will learn"
                    isSkeleton={isSkeleton}

                    items={(outcomes ?? []).map((outcome) => ({
                        key: outcome.key,
                        leadingIcon: CheckCircleIcon,
                        leadingIconColor: "success",
                        title: outcome.text,
                    }))}
                />
            ) : null}
        </>
    )

    return (
        <div>
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => headerBody]} />
        </div>
    )
}

export { ContentHeader }
