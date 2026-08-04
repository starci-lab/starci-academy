import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AuditCta` — the landing's dark diagnostic band: "Where are you losing
 * leads?" over the one path for an unsure visitor, the Lead-Leakage Audit.
 * `eyebrow` is the one optional prop, so its presence is the leaf.
 */

/** Props for {@link AuditCta}. */
export interface AuditCtaProps {
    /** Optional accent-toned kicker above the headline (e.g. "Quick diagnosis"). */
    eyebrow?: string
    /** The band's headline (e.g. "Where are you losing leads?"). */
    title: string
    /** Supporting copy naming the audit's value before a plan is chosen. */
    description: string
    /** Visible label for the one CTA into the audit. */
    ctaLabel: string
    /** Fired by the CTA — the caller routes to the Lead-Leakage Audit. */
    onCtaPress: () => void
}

/**
 * The dark diagnostic CTA band. See the file header for why it forces
 * `"dark"` the same way `OperatingLoopHero` does.
 *
 * @param props - {@link AuditCtaProps}
 */
const AuditCta = ({ eyebrow, title, description, ctaLabel, onCtaPress }: AuditCtaProps) => (
    <section
        data-tier="block"
        data-component="AuditCta"
        className="dark rounded-3xl bg-background px-6 py-14 text-center text-foreground"
    >
        <Container
            size="lg"
            padding={1}
            body={() => (
                <StackV
                    gap={4}
                    align="center"
                    items={[
                        ...(eyebrow ? [() => <Typography size="sm" weight="semibold" color="accent" align="center" text={eyebrow} />] : []),
                        () => <Typography size="h2" weight="bold" align="center" text={title} />,
                        () => <Typography size="base" color="muted" align="center" text={description} />,
                        () => (
                            <Button
                                variant="primary"
                                size="lg"
                                label={ctaLabel}
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                onPress={onCtaPress}
                            />
                        ),
                    ]}
                />
            )}
        />
    </section>
)

export { AuditCta }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AuditCta" } as const
