import { Card, CardContent } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `InstructorAuthorityCard` -- the landing's trust signal about the person, one
 * of the two peer cards in the trust row (beside `CommunityPreviewCard`).
 * Deliberately THIN: `Brand` (`lib/api.ts`) has no `bio`, no `credentials`,
 * no testimonial, no student-count field anywhere in the schema, so this
 * card shows only what really exists -- identity plus the real stat row
 * derived from `courses()` and `Brand.communityEnabled`. At zero courses the
 * three-chip stat row collapses to one honest combined line instead of
 * padding an empty stat with a zero lesson count and a community chip.
 *
 * HeroUI rebuild (P1 foundation): `Card`/`CardContent` + the shared
 * `Avatar`/`Chip`/`Typography`/`Stack` atoms, re-themed per tenant through
 * `apps/expert/app/globals.css`'s `--nivo-*` -> HeroUI CSS-var bridge -- see
 * the component's own file header for the full contract.
 */

/** The subset of `Brand` this card reads. */
export interface InstructorAuthorityCardBrand {
    /** `Brand.displayName`. */
    displayName: string
    /** `Brand.tagline`, or `null` when unset -- shown as the role/positioning line. */
    tagline: string | null
    /** `Brand.avatarUrl`, or `null` -- renders the initials fallback instead. */
    avatarUrl: string | null
}

/** Already-resolved copy `InstructorAuthorityCard` renders. */
export interface InstructorAuthorityCardLabels {
    /** Suffix after the course count (e.g. "courses"). */
    courseSuffix: string
    /** Suffix after the lesson count (e.g. "lessons"). */
    lessonSuffix: string
    /** Qualifier appended to the zero-course combined stat (e.g. "coming soon"). */
    comingSoonQualifier: string
    /** Label for the community chip, shown only when `communityEnabled` and `courseCount > 0`. */
    communityOpenLabel: string
}

/** Props for {@link InstructorAuthorityCard}. */
export interface InstructorAuthorityCardProps {
    /** The tenant's brand identity. */
    brand: InstructorAuthorityCardBrand
    /** Real count from `courses()`. */
    courseCount: number
    /** Real sum of every course's `lessons.length`. */
    lessonCount: number
    /** Real `Brand.communityEnabled` -- a disabled feature is never advertised as a stat. */
    communityEnabled: boolean
    /**
     * `true` -> the courses fetch is still in flight: the identity (avatar,
     * name, tagline) and the stat row all shimmer, threaded to every leaf
     * this card composes. Unlike `HeroIdentity`, this card's identity is
     * shimmered too -- it sits inside the same trust-row loading picture as
     * the stat row it is paired with, so the pair resolves together rather
     * than the identity appearing to "finish" before the stats do.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: InstructorAuthorityCardLabels
}

/**
 * The instructor trust card. See the file header for why it carries no bio
 * and for the HeroUI rebuild's tagline-visibility correction.
 *
 * @param props - {@link InstructorAuthorityCardProps}
 */
const InstructorAuthorityCard = ({
    brand,
    courseCount,
    lessonCount,
    communityEnabled,
    isSkeleton = false,
    labels,
}: InstructorAuthorityCardProps) => {
    const hasCourses = courseCount > 0
    const showCommunityChip = hasCourses && communityEnabled

    return (
        <Card data-tier="block" data-component="InstructorAuthorityCard">
            <CardContent>
                <StackV
                    principle="label-field" gap={4}
                    divider
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <StackH
                                gap={3}
                                items={[
                                    () => (
                                        <Avatar
                                            src={brand.avatarUrl ?? undefined}
                                            name={brand.displayName}
                                            fallback="initials"
                                            size="md"
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={1}
                                            isSkeleton={isSkeleton}
                                            items={[
                                                () => (
                                                    <Typography
                                                        size="sm"
                                                        weight="semibold"
                                                        truncate
                                                        isSkeleton={isSkeleton}
                                                        text={brand.displayName}
                                                    />
                                                ),
                                                ...(brand.tagline ? [() => (
                                                    <Typography
                                                        size="xs"
                                                        color="muted"
                                                        truncate
                                                        isSkeleton={isSkeleton}
                                                        text={brand.tagline ?? ""}
                                                    />
                                                )] : []),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            hasCourses ? (
                                <StackH
                                    gap={2}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Chip tone="default" isSkeleton={isSkeleton} text={`${courseCount} ${labels.courseSuffix}`} />,
                                        () => <Chip tone="default" isSkeleton={isSkeleton} text={`${lessonCount} ${labels.lessonSuffix}`} />,
                                        ...(showCommunityChip ? [() => <Chip tone="accent" isSkeleton={isSkeleton} text={labels.communityOpenLabel} />] : []),
                                    ]}
                                />
                            ) : (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    text={`${courseCount} ${labels.courseSuffix} · ${labels.comingSoonQualifier}`}
                                />
                            )
                        ),
                    ]}
                />
            </CardContent>
        </Card>
    )
}

export { InstructorAuthorityCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "InstructorAuthorityCard" } as const
