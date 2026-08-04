import { ArrowRightIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `SystemStoryCard` — the landing's honest before/after narrative: a
 * pain-point column, an outcome column, and a disclaimer making clear the
 * story is illustrative, never a specific customer's numbers. `eyebrow` is
 * the one optional prop, so its presence is the leaf.
 */

/** One side of the before/after story. */
export interface SystemStoryCardSide {
    /** The side's small header (e.g. "Before", "After the system"). */
    label: string
    /** The side's points, in reading order. */
    points: Array<string>
}

/** Props for {@link SystemStoryCard}. */
export interface SystemStoryCardProps {
    /** Accent-toned kicker above the title (e.g. "Before & after"). */
    eyebrow?: string
    /** The beat's headline (e.g. "Real results come from a real system."). */
    title: string
    /** The pain-point column, rendered with a warning marker per point. */
    before: SystemStoryCardSide
    /** The outcome column, rendered with a success marker per point. */
    after: SystemStoryCardSide
    /** Already-resolved honesty note under the panels (e.g. "Illustrative story, not tied to one customer's numbers."). */
    disclaimer: string
}

/** One before/after panel: a labeled surface over a list of toned points, sharing the row width evenly with its sibling. */
const StoryPanel = ({ side, tone }: { side: SystemStoryCardSide; tone: "warning" | "success" }) => (
    <SurfaceCard
        padding={3}
        label={side.label}
        subtleLabel
        classNames={["flex-1"]}
        body={() => (
            <StackV
                gap={3}
                items={side.points.map((point) => () => (
                    <InlineIconLabel icon={tone === "warning" ? XCircleIcon : CheckCircleIcon} label={point} tone={tone} size="sm" />
                ))}
            />
        )}
    />
)

/**
 * The before/after story card. See the file header for why the honesty
 * disclaimer is a resolved string this block renders, never a badge it
 * invents.
 *
 * @param props - {@link SystemStoryCardProps}
 */
const SystemStoryCard = ({ eyebrow, title, before, after, disclaimer }: SystemStoryCardProps) => (
    <div data-tier="block" data-component="SystemStoryCard">
        <StackV
            gap={6}
            items={[
                () => <SectionHeading eyebrow={eyebrow} title={title} align="center" />,
                () => (
                    <StackH
                        gap={6}
                        at="md"
                        align="stretch"
                        items={[
                            () => <StoryPanel side={before} tone="warning" />,
                            () => (
                                <span aria-hidden className="flex shrink-0 items-center justify-center text-accent [&_svg]:size-6">
                                    <ArrowRightIcon />
                                </span>
                            ),
                            () => <StoryPanel side={after} tone="success" />,
                        ]}
                    />
                ),
                () => <Typography size="xs" color="muted" align="center" text={disclaimer} />,
            ]}
        />
    </div>
)

export { SystemStoryCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SystemStoryCard" } as const
