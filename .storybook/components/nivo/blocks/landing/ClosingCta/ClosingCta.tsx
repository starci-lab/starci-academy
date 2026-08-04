import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `ClosingCta` — the landing's final beat: repeats the hero's own
 * primary/secondary CTA pair so the scrolled reader never has to scroll back
 * up for the one north-star action. `eyebrow` is the one optional prop, so
 * its presence is the leaf.
 */

/** One CTA — a visible label plus the callback it fires. */
export interface ClosingCtaAction {
    /** Visible button label. */
    label: string
    /** Fired when the CTA is pressed — the caller owns the destination. */
    onPress: () => void
}

/** Props for {@link ClosingCta}. */
export interface ClosingCtaProps {
    /** Optional accent-toned kicker above the title. */
    eyebrow?: string
    /** The beat's headline. */
    title: string
    /** Supporting intro line under the title. */
    description: string
    /** The PRIMARY CTA — must be the same destination as the hero's primary. */
    primaryCta: ClosingCtaAction
    /** The SECONDARY CTA — must be the same destination as the hero's secondary. */
    secondaryCta: ClosingCtaAction
}

/**
 * The landing's final CTA beat. See the file header for why it repeats the
 * hero's own primary/secondary pair rather than choosing a destination itself.
 *
 * @param props - {@link ClosingCtaProps}
 */
const ClosingCta = ({ eyebrow, title, description, primaryCta, secondaryCta }: ClosingCtaProps) => (
    <section data-tier="block" data-component="ClosingCta" className="px-6 py-16">
        <Container
            size="md"
            padding={1}
            body={() => (
                <StackV
                    gap={6}
                    align="center"
                    items={[
                        () => <SectionHeading eyebrow={eyebrow} title={title} intro={description} align="center" />,
                        () => (
                            <Cluster
                                gap={3}
                                justify="center"
                                items={[
                                    () => (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            label={primaryCta.label}
                                            onPress={primaryCta.onPress}
                                        />
                                    ),
                                    () => (
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            label={secondaryCta.label}
                                            onPress={secondaryCta.onPress}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    </section>
)

export { ClosingCta }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ClosingCta" } as const
