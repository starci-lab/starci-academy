import { ArrowRightIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `HeroIdentity` -- the full-fold hero of a tenant's public landing
 * (`apps/expert` `/`): the expert's identity (avatar, name, tagline), one
 * real stat line, an optional promo-video trigger, and the page's single
 * primary action + one onward action. Grounded in the real `Brand` shape
 * (`lib/api.ts`) -- no bio, no credentials, nothing beyond
 * `displayName`/`tagline`/`avatarUrl` exists to show. `courseCount === 0`
 * (every new tenant's starting state) flips the stat line to an honest
 * "not yet" and the primary action to a lead-capture ask, never both offered
 * at once.
 *
 * HeroUI: composes the house `Avatar`/`Button`/`Typography` atoms and
 * `Container`/`Cluster`/`StackV` frames -- the same vocabulary
 * `nivo/blocks/landing/HeroBanner` builds its own hero from. Every colour
 * resolves through `apps/expert`'s `--nivo-*` -> HeroUI bridge, so this
 * fixture renders correctly with no host `:root` override present.
 */

/** The subset of `Brand` this hero reads. */
export interface HeroIdentityBrand {
    /** `Brand.displayName` -- falls back to an initial glyph when `avatarUrl` is unset. */
    displayName: string
    /** `Brand.tagline`, or `null` when the expert has not set one. */
    tagline: string | null
    /** `Brand.avatarUrl`, or `null` -- renders the initial glyph instead. */
    avatarUrl: string | null
}

/** Already-resolved copy `HeroIdentity` renders. */
export interface HeroIdentityLabels {
    /** Suffix after the course count in the populated stat line (e.g. "courses open"). */
    courseSuffix: string
    /** Suffix after the lesson count in the populated stat line (e.g. "lessons"). */
    lessonSuffix: string
    /** The honest zero-course stat line -- no fabricated date, no fake urgency. */
    comingSoonStat: string
    /** Primary action label once at least one course exists. */
    primaryPopulatedLabel: string
    /** Primary action label at zero courses -- flips to the lead-capture ask. */
    primaryEmptyLabel: string
    /** Onward action label once at least one course exists. */
    secondaryPopulatedLabel: string
    /** Onward action label at zero courses. */
    secondaryEmptyLabel: string
}

/** The optional promo-video trigger (research annex delta #3). Absent when the tenant has no clip. */
export interface HeroIdentityPromoVideo {
    /** Visible label for the trigger (e.g. "Watch the 90s intro"). */
    label: string
    /** Fired when pressed -- the caller opens the actual player (an overlay this block does not own). */
    onPress: () => void
}

/** Props for {@link HeroIdentity}. */
export interface HeroIdentityProps {
    /** The tenant's brand identity. */
    brand: HeroIdentityBrand
    /** Real count from `courses()` -- `0` is the critical, honestly-handled state. */
    courseCount: number
    /** Real sum of every course's `lessons.length`. */
    lessonCount: number
    /** Fired by the primary action -- the caller routes into the catalog (populated) or the lead form (empty). */
    onPrimary: () => void
    /** Fired by the onward action -- the caller opens the community (populated) or the lead form (empty). */
    onSecondary: () => void
    /** Optional promo-video trigger -- omit when the tenant has no clip to show. */
    promoVideo?: HeroIdentityPromoVideo
    /**
     * `true` -> the courses fetch is still in flight: the stat line and the
     * action row shimmer; the avatar/name/tagline render as normal (see file
     * header for why). No primary action is offered while the block cannot
     * yet say which one is honest.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: HeroIdentityLabels
}

/**
 * The hero. See the file header for why the identity fields and the stat
 * line/action row shimmer independently, and for the promo-video trigger's
 * scope.
 *
 * @param props - {@link HeroIdentityProps}
 */
const HeroIdentity = ({
    brand,
    courseCount,
    lessonCount,
    onPrimary,
    onSecondary,
    promoVideo,
    isSkeleton = false,
    labels,
}: HeroIdentityProps) => {
    const hasCourses = courseCount > 0
    const statText = hasCourses
        ? `${courseCount} ${labels.courseSuffix} · ${lessonCount} ${labels.lessonSuffix}`
        : labels.comingSoonStat

    return (
        <section
            data-tier="block"
            data-component="HeroIdentity"
            className="flex flex-col items-center bg-gradient-to-b from-surface to-background px-6 py-16 text-center"
        >
            <Container
                size="md"
                padding={1}
                body={() => (
                    <StackV
                        gap={4}
                        align="center"
                        items={[
                            () => (
                                <Avatar
                                    src={brand.avatarUrl ?? undefined}
                                    name={brand.displayName}
                                    size="lg"
                                    ring="accent"
                                    fallback="initials"
                                />
                            ),
                            () => <Typography size="h1" weight="bold" align="center" text={brand.displayName} />,
                            ...(brand.tagline
                                ? [() => <Typography size="base" weight="semibold" color="accent" align="center" text={brand.tagline as string} />]
                                : []),
                            () => <Typography size="sm" color="muted" align="center" text={statText} isSkeleton={isSkeleton} />,
                            ...(!isSkeleton
                                ? [
                                    () => (
                                        <Cluster
                                            gap={3}
                                            justify="center"
                                            items={[
                                                () => (
                                                    <Button
                                                        variant="primary"
                                                        size="lg"
                                                        label={hasCourses ? labels.primaryPopulatedLabel : labels.primaryEmptyLabel}
                                                        suffixIcon={ArrowRightIcon}
                                                        iconSlide
                                                        onPress={onPrimary}
                                                    />
                                                ),
                                                () => (
                                                    <Button
                                                        variant="secondary"
                                                        size="lg"
                                                        label={hasCourses ? labels.secondaryPopulatedLabel : labels.secondaryEmptyLabel}
                                                        onPress={onSecondary}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]
                                : []),
                            ...(!isSkeleton && promoVideo
                                ? [
                                    () => (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            label={promoVideo.label}
                                            prefixIcon={PlayCircleIcon}
                                            onPress={promoVideo.onPress}
                                        />
                                    ),
                                ]
                                : []),
                        ]}
                    />
                )}
            />
        </section>
    )
}

export { HeroIdentity }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "HeroIdentity" } as const
