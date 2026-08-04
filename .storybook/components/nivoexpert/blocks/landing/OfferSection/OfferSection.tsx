import { GraduationCapIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OfferSection` — the landing's closing pricing/enrol push: every real course
 * restated as one compact row (title · real lesson count · real price) with its
 * own Enrol CTA, inside a single surface. A nivo tenant sells single courses, not
 * tiers, so this restates each course's real price instead of a tier grid. An
 * optional risk-reversal `guarantee` line renders ONLY when the connected layer
 * hands one in from a real refund policy. Built on the shared HeroUI
 * atom/composite system (`SurfaceCard` / `List.Row` / `Chip` / `Button`).
 */

/** One course's offer row — a subset of the real `Course`, price pre-formatted. */
export interface OfferSectionCourseRow {
    /** `Course.slug` — the row key and the `onEnrol` argument. */
    slug: string
    /** `Course.title`. */
    title: string
    /** `Course.priceText`, verbatim. Null renders `labels.freeLabel` — a copy decision, not a fabricated price. */
    priceText?: string | null
    /** `Course.lessons.length`. */
    lessonCount: number
}

/** Already-resolved copy `OfferSection` renders. */
export interface OfferSectionLabels {
    /** Accent eyebrow above the title. */
    eyebrow: string
    /** The section title. */
    title: string
    /** Optional supporting intro line under the title. */
    intro?: string
    /** Price-row text shown when a course's `priceText` is null. */
    freeLabel: string
    /** Suffix after each row's lesson count (e.g. "lessons"). */
    lessonsSuffix: string
    /** Per-row enrol CTA label. */
    enrolLabel: string
    /** Empty-state title, shown only if the catalog ever returns zero courses. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Empty-state CTA label, routing to the lead-capture section. */
    emptyCtaLabel: string
}

/** Props for {@link OfferSection}. */
export interface OfferSectionProps {
    /** The real courses, in display order. */
    courses: Array<OfferSectionCourseRow>
    /** Fires with a course's slug when its row CTA is pressed. */
    onEnrol: (slug: string) => void
    /** Fired from the defensive empty branch — the caller routes to the lead-capture section. */
    onContact: () => void
    /**
     * Real risk-reversal copy (e.g. a refund window), verbatim from the expert's
     * own policy. `null`/omitted → no guarantee line renders; this block never
     * invents one (see file header).
     */
    guarantee?: string | null
    /**
     * `true` → the catalog's own first fetch is in flight: the offer keeps its row
     * shape while every title/price shimmers and every CTA stops accepting presses.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OfferSectionLabels
}

/** How many placeholder rows the loading mirror draws while `courses` hasn't landed. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_COURSES: Array<OfferSectionCourseRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    slug: `skeleton-${index}`,
    title: "Course title",
    priceText: "000.000",
    lessonCount: 6,
}))

/** Local props for the {@link OfferRow} helper. */
interface OfferRowProps {
    course: OfferSectionCourseRow
    onEnrol: (slug: string) => void
    labels: OfferSectionLabels
    isSkeleton: boolean
    divider: boolean
}

/**
 * One offer row: title + real lesson count on the left, the price chip and Enrol
 * CTA on the right. The SAME shape drives the loaded and loading rows —
 * `isSkeleton` mirrors, it does not branch to a second shape.
 */
const OfferRow = ({ course, onEnrol, labels, isSkeleton, divider }: OfferRowProps) => (
    <ListRow
        title={course.title}
        subtitle={`${course.lessonCount} ${labels.lessonsSuffix}`}
        meta={() => <Chip tone="accent" text={course.priceText ?? labels.freeLabel} />}
        trailing={() => <Button variant="primary" size="sm" label={labels.enrolLabel} onPress={() => onEnrol(course.slug)} />}
        divider={divider}
        isSkeleton={isSkeleton}
    />
)

/**
 * The offer section. See the file header for why every course restates as one
 * row instead of a tier grid, and why `guarantee` only ever renders real copy.
 *
 * @param props - {@link OfferSectionProps}
 */
const OfferSection = ({ courses, onEnrol, onContact, guarantee, isSkeleton = false, labels }: OfferSectionProps) => {
    const isEmpty = !isSkeleton && courses.length === 0
    const rows = isSkeleton ? SKELETON_COURSES : courses

    return (
        <section data-tier="block" data-component="OfferSection" className="px-6 py-16">
            <Container
                size="md"
                padding={1}
                body={() => (
                    <StackV
                        gap={8}
                        items={[
                            () => (
                                <StackV
                                    gap={3}
                                    align="center"
                                    items={[
                                        () => <Typography size="sm" weight="bold" color="accent" align="center" text={labels.eyebrow} />,
                                        () => <Typography size="h2" weight="bold" align="center" text={labels.title} />,
                                        ...(labels.intro
                                            ? [() => <Typography size="sm" color="muted" align="center" text={labels.intro as string} />]
                                            : []),
                                    ]}
                                />
                            ),
                            () =>
                                isEmpty ? (
                                    <EmptyState
                                        icon={GraduationCapIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                        action={() => <Button variant="secondary" label={labels.emptyCtaLabel} onPress={onContact} />}
                                    />
                                ) : (
                                    <SurfaceCard
                                        padding={2}
                                        body={() => (
                                            <StackV
                                                gap={1}
                                                items={rows.map((course, index) => () => (
                                                    <OfferRow
                                                        course={course}
                                                        onEnrol={onEnrol}
                                                        labels={labels}
                                                        isSkeleton={isSkeleton}
                                                        divider={index < rows.length - 1}
                                                    />
                                                ))}
                                            />
                                        )}
                                    />
                                ),
                            ...(!isSkeleton && !isEmpty && guarantee
                                ? [() => (
                                    <div className="flex justify-center">
                                        <InlineIconLabel icon={ShieldCheckIcon} tone="success" size="sm" label={guarantee as string} />
                                    </div>
                                )]
                                : []),
                        ]}
                    />
                )}
            />
        </section>
    )
}

export { OfferSection }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OfferSection" } as const
