import { PlayIcon } from "@phosphor-icons/react"
import { StepBadge } from "@sb-components/atoms/display/StepBadge/StepBadge"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    SurfaceCardPressableGroup,
    type SurfaceCardPressableGroupItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `DemoFlow` — the landing's "watch a lead move through nivo" preview: a
 * numbered row of demo cards, one per leg of the flow. A VISION preview
 * (nivo does not ship the full click-through walkthrough yet), so — matching
 * `SystemFlow`/`SystemStoryCard` — that honesty lives in `intro`, never a
 * badge this block draws itself. Feeding a shorter list proves the grid
 * reflows on real data, not a fixed four-card layout.
 */

/** One leg of the demo flow. */
export interface DemoFlowStep {
    /** Stable React key. */
    key: string
    /** Ordinal shown in the leading {@link StepBadge} (e.g. `1`). */
    stepNumber: number
    /** The leg's name (e.g. "Website → CRM"). */
    name: string
    /** Visible CTA label — the block itself prepends the play glyph (e.g. "Watch this step"). */
    ctaLabel: string
    /** Fired when the step card is pressed — the caller opens the demo player. */
    onPress: () => void
}

/** Props for {@link DemoFlow}. */
export interface DemoFlowProps {
    /** Accent-toned kicker above the title (e.g. "Demo"). */
    eyebrow: string
    /** The beat's headline (e.g. "See how a lead flows through nivo."). */
    title: string
    /** Supporting line naming this as a preview of the full operating loop. */
    intro?: string
    /** The demo legs, in flow order. */
    steps: Array<DemoFlowStep>
}

/** One step card's body: the ordinal badge over its name and play-CTA line. */
const stepBody = (step: DemoFlowStep) => (
    <StackV
        gap={2}
        align="start"
        items={[
            () => <StepBadge number={step.stepNumber} size="sm" />,
            () => <Typography size="sm" weight="semibold" text={step.name} />,
            () => (
                <Typography
                    size="xs"
                    weight="semibold"
                    color="accent"
                    prefixIcon={PlayIcon}
                    text={step.ctaLabel}
                />
            ),
        ]}
    />
)

/**
 * The demo-flow card row. See the file header for why the VISION framing
 * lives in `intro`, never a badge this block draws itself.
 *
 * @param props - {@link DemoFlowProps}
 */
const DemoFlow = ({ eyebrow, title, intro, steps }: DemoFlowProps) => {
    const items: Array<SurfaceCardPressableGroupItem> = steps.map((step) => ({
        key: step.key,
        onPress: step.onPress,
        content: () => stepBody(step),
    }))

    return (
        <div data-tier="block" data-component="DemoFlow">
            <StackV
                gap={8}
                principle="marketing-beat"
                items={[
                    () => <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />,
                    () => (
                        <SurfaceCardPressableGroup ariaLabel="Watch a step of the lead flow demo" columns={{ base: 2, md: 4 }} items={items} principle="content-row" />
                    ),
                ]}
            />
        </div>
    )
}

export { DemoFlow }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "DemoFlow" } as const
