import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    LeadLeakageMap,
    type LeadLeakageMapStage,
} from "@sb-components/nivo/blocks/landing/LeadLeakageMap/LeadLeakageMap"

/**
 * `ProblemStatement` — the landing's core message: "SMEs don't lack tools.
 * SMEs lack a system," paired with the `LeadLeakageMap` as its concrete
 * proof. Feeding the map different stage data shows the pairing recompute
 * together, since this block composes the map directly rather than the page
 * arranging them separately (`nivo-landing.proposal.md` §5).
 */

/** Props for {@link ProblemStatement}. */
export interface ProblemStatementProps {
    /** Accent-toned kicker above the headline. */
    eyebrow: string
    /** First headline line, default foreground (e.g. "SMEs don't lack tools."). */
    headlineLead: string
    /** Second headline line, accent-colored (e.g. "SMEs lack a system."). */
    headlineAccent: string
    /** Supporting paragraph naming the concrete symptoms. */
    description: string
    /** Visible label for the secondary CTA. */
    ctaLabel: string
    /** Fired by the CTA — the caller routes toward the audit or pricing. */
    onCtaPress: () => void
    /** Header for the composed {@link LeadLeakageMap}. */
    leakMapTitle: string
    /** Stage data for the composed {@link LeadLeakageMap}. */
    leakMapStages: Array<LeadLeakageMapStage>
}

/**
 * The problem beat. See the file header for why it composes `LeadLeakageMap`
 * directly instead of leaving the pairing to the page.
 *
 * @param props - {@link ProblemStatementProps}
 */
const ProblemStatement = ({
    eyebrow,
    headlineLead,
    headlineAccent,
    description,
    ctaLabel,
    onCtaPress,
    leakMapTitle,
    leakMapStages,
}: ProblemStatementProps) => (
    <div data-tier="block" data-component="ProblemStatement">
        <Grid
            columns={{ base: 1, lg: 2 }}
            principle="marketing-beat"
            items={[
                {
                    key: "copy",
                    content: () => (
                        <StackV
                            gap={4}
                            align="start"
                            items={[
                                () => <Typography size="sm" weight="semibold" color="accent" text={eyebrow} />,
                                () => (
                                    <StackV
                                        gap={1}
                                        items={[
                                            () => <Typography size="h2" weight="bold" text={headlineLead} />,
                                            () => <Typography size="h2" weight="bold" color="accent" text={headlineAccent} />,
                                        ]}
                                    />
                                ),
                                () => <Typography size="base" color="muted" text={description} />,
                                () => (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        label={ctaLabel}
                                        suffixIcon={ArrowRightIcon}
                                        iconSlide
                                        onPress={onCtaPress}
                                    />
                                ),
                            ]}
                        />
                    ),
                },
                {
                    key: "map",
                    content: () => <LeadLeakageMap title={leakMapTitle} stages={leakMapStages} />,
                },
            ]}
        />
    </div>
)

export { ProblemStatement }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProblemStatement" } as const
