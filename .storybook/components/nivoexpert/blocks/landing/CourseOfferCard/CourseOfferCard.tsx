import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseOfferCard` -- one course in the public tenant landing's catalog:
 * title, a price chip (verbatim `Course.priceText`, or the free-course label
 * when unset), an optional summary, and the real lesson count. The whole card
 * is one press target, matching the real `landings/Classic.tsx`'s
 * card-as-link convention. Built on the shared HeroUI atom system
 * (`SurfaceCard` / `Typography` / `Chip`) -- the tenant-landing tier moved
 * onto it once `apps/expert` wired the HeroUI theme bridge; the atoms still
 * read the app's per-tenant `--nivo-*` runtime tokens, one indirection later.
 */

/** One course, as the public landing reads it -- a subset of the real `Course`. */
export interface CourseOfferCardView {
    /** `Course.slug` -- the grid key and the `onOpenCourse` argument. */
    slug: string
    /** `Course.title`. */
    title: string
    /** `Course.summary` -- null when the expert left it unset. */
    summary?: string | null
    /** `Course.priceText`, verbatim. Null renders `labels.freeLabel` -- a copy decision, not a fabricated price. */
    priceText?: string | null
    /** `Course.lessons.length`. */
    lessonCount: number
}

/** Already-resolved copy the card renders. */
export interface CourseOfferCardLabels {
    /** Price-chip text shown when `priceText` is null (e.g. "Free"). */
    freeLabel: string
    /** Suffix after the lesson count (e.g. "lessons"). */
    lessonsSuffix: string
}

/** Props for {@link CourseOfferCard}. */
export interface CourseOfferCardProps {
    /** The course this card renders. */
    course: CourseOfferCardView
    /** Fires on press -- the connected layer routes to `/classroom/[slug]`. */
    onOpenCourse: (slug: string) => void
    /** `true` -> a fixed skeleton course renders in place of `course`, every field shimmering. */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CourseOfferCardLabels
}

/** Skeleton placeholder -- sized like a real card so the shimmer mirrors the loaded shape. */
const SKELETON_COURSE: CourseOfferCardView = {
    slug: "skeleton",
    title: "Course title",
    summary: "Course summary line goes here",
    priceText: "000.000",
    lessonCount: 6,
}

/**
 * One course card in the public catalog. See the file header for the HeroUI
 * atom convention and why the whole card is one press target.
 *
 * @param props - {@link CourseOfferCardProps}
 */
const CourseOfferCard = ({ course, onOpenCourse, isSkeleton = false, labels }: CourseOfferCardProps) => {
    const view = isSkeleton ? SKELETON_COURSE : course
    const priceLabel = view.priceText ?? labels.freeLabel

    return (
        <div data-tier="block" data-component="CourseOfferCard">
            <SurfaceCard
                padding={4}
                isSkeleton={isSkeleton}
                onPress={() => onOpenCourse(course.slug)}
                body={() => (
                    <StackV
                        gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    align="start"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={view.title} />,
                                        () => <Chip tone="accent" isSkeleton={isSkeleton} text={priceLabel} />,
                                    ]}
                                />
                            ),
                            ...(isSkeleton || view.summary
                                ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={view.summary ?? ""} />]
                                : []),
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={`${view.lessonCount} ${labels.lessonsSuffix}`}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { CourseOfferCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CourseOfferCard" } as const
