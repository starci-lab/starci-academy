import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `StoryBeatCard` — one product beat: accent eyebrow, title, positioning line, a
 * plan-count chip, and a secondary CTA into the catalog. The card has one shape;
 * the two real products are its two data states. Grounded in `AI Academy` and
 * `nivo AI Agent`.
 */

/** Props for {@link StoryBeatCard}. */
export interface StoryBeatCardProps {
    /** Accent-toned kicker above the title. */
    eyebrow: string
    /** The beat's title — the product's marketing name. */
    title: string
    /** One grounded paragraph positioning the product. */
    description: string
    /** Fully formatted plan-count chip copy (e.g. "3 plans"), pre-pluralized by the caller. */
    unitCountLabel: string
    /** Visible CTA label (e.g. "See plans"). */
    ctaLabel: string
    /** Fired when the CTA is pressed — the caller routes into the catalog. */
    onCtaPress: () => void
}

/**
 * One landing story beat. See the file header for why the CTA is secondary and
 * the two products are states of one shape.
 *
 * @param props - {@link StoryBeatCardProps}
 */
const StoryBeatCard = ({ eyebrow, title, description, unitCountLabel, ctaLabel, onCtaPress }: StoryBeatCardProps) => (
    <div data-tier="block" data-component="StoryBeatCard">
        <SurfaceCard
            padding={3}
            body={() => (
                <StackV
                    gap={3}
                    items={[
                        () => (
                            <StackV
                                gap={2}
                                items={[
                                    () => <Typography size="sm" weight="semibold" color="accent" text={eyebrow} />,
                                    () => <Typography size="base" weight="semibold" text={title} />,
                                    () => <Typography size="sm" color="muted" text={description} />,
                                ]}
                            />
                        ),
                        () => (
                            <StackH
                                gap={3}
                                align="center"
                                justify="between"
                                items={[
                                    () => <Chip tone="default" text={unitCountLabel} />,
                                    () => (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            label={ctaLabel}
                                            suffixIcon={ArrowRightIcon}
                                            iconSlide
                                            onPress={onCtaPress}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { StoryBeatCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "StoryBeatCard" } as const
