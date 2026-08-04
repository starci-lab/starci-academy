import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `HeroBanner` — the full-fold landing hero. The one north-star primary always
 * shows; the secondary CTA is optional, so its presence is the one leaf.
 * Grounded in the streamlined two-product platform.
 */

/** Props for {@link HeroBanner}. */
export interface HeroBannerProps {
    /** Accent-toned kicker above the headline. */
    eyebrow: string
    /** The full-fold headline. */
    headline: string
    /** Supporting sub-copy below the headline. */
    description: string
    /** Visible label for the single north-star primary CTA. */
    primaryLabel: string
    /** Fired by the primary CTA — the caller sends the reader into the catalog. */
    onPrimary: () => void
    /** Visible label for the optional secondary CTA; omit to drop it. */
    secondaryLabel?: string
    /** Fired by the secondary CTA — present only alongside {@link secondaryLabel}. */
    onSecondary?: () => void
}

/**
 * The landing hero. See the file header for why the secondary CTA's presence is
 * the one leaf.
 *
 * @param props - {@link HeroBannerProps}
 */
const HeroBanner = ({
    eyebrow,
    headline,
    description,
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
}: HeroBannerProps) => (
    <section
        data-tier="block"
        data-component="HeroBanner"
        className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 py-16"
    >
        <Container
            size="md"
            padding={1}
            body={() => (
                <StackV
                    gap={6}
                    align="center"
                    items={[
                        () => <Typography size="sm" weight="semibold" color="accent" align="center" text={eyebrow} />,
                        () => <Typography size="h1" weight="bold" align="center" text={headline} />,
                        () => <Typography size="base" color="muted" align="center" text={description} />,
                        () => (
                            <Cluster
                                gap={3}
                                justify="center"
                                items={[
                                    () => (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            label={primaryLabel}
                                            suffixIcon={ArrowRightIcon}
                                            iconSlide
                                            onPress={onPrimary}
                                        />
                                    ),
                                    ...(secondaryLabel
                                        ? [() => (
                                            <Button
                                                variant="secondary"
                                                size="lg"
                                                label={secondaryLabel}
                                                onPress={onSecondary}
                                            />
                                        )]
                                        : []),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    </section>
)

export { HeroBanner }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "HeroBanner" } as const
