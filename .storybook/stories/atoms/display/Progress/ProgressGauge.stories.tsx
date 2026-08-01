import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressGauge } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `ProgressGauge`: a static MEASUREMENT (storage, battery, quota), wrapping
 * HeroUI/react-aria Meter DIRECTLY.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Leaf set: `Value` (merges `value`+`max` — two props
 * but ONE shape, same as `Chip` merging `dotColor`/`dotClassName` into the `Dot`
 * leaf) · `Colors` · `Sizes` · `Loading`.
 *
 * ⛔ NO `Indeterminate` leaf — react-aria Meter is always determinate; a
 * measurement can never be "unknown" (unlike `ProgressBar`/`Circle`).
 * ⛔ `ariaLabel` has NO leaf (§12g.1): it only feeds `aria-label`, it never changes a pixel.
 *
 * ⭐ `Meter` calls its own `HeroMeter` directly, it does NOT recompose `ProgressBar`.
 * `Meter.Track`/`Meter.Fill` ARE real HeroUI compound components (not an internal
 * slot) ⇒ `tier: "heroui"`, no `storyId` (§ naming pass, 2026-07-28) — renamed
 * from `Track`/`Fill`, names that used to collide with `ProgressBar`/
 * `ProgressCircle`'s own `Track`/`Fill` (DIFFERENT compounds despite the same name).
 *
 * ⚠️ Fixed 2026-07-26: the old `Bands` leaf only rendered 3 of 5 `color` values
 * (missing `accent`, `default`) — a missed value would grow into a stray story, so
 * it was renamed to `Colors` covering the full union; the "tone = threshold" idea
 * moved into `reason`. The `Sizes` leaf did NOT exist before, even though `size`
 * genuinely changes the height.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Meter.Track": {
        tier: "heroui",
        role: "the neutral rail the fill sits inside",
    },
    "Meter.Fill": {
        tier: "heroui",
        role: "the filled portion, always a fixed width at a value — a meter is never indeterminate",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the resting shimmer bar, drawn in place of the whole track/fill pair while isSkeleton is on",
    },
}

const meta: Meta<typeof ProgressGauge> = {
    title: "Atoms/Display/Progress/ProgressGauge",
    component: ProgressGauge,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProgressGauge>

/**
 * Leaf props `value` / `max` — TWO props but ONE shape: both only push the same
 * fill mark. Splitting them would give two identical frames, so they're merged
 * (anchor: `Chip`'s `Dot` leaf).
 */
export const Value: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressGauge"
                tier="atom"
                leaf="Props `value` / `max`"
                annotate={ANNOTATE}
                reason="A meter is a static measurement, not a task running, so there is no indeterminate state. The fill is always the value read against its own ceiling."
                states={[
                    {
                        name: "value = 72, max = 100 (default)",
                        why: "The fill sits at 72% of the track's width. `max` defaults to 100, so a bare `value` reads directly as a percentage.",
                        code: "<ProgressGauge value={72} />   // max defaults to 100",
                        render: <ProgressGauge value={72} ariaLabel="Disk usage out of 100" />,
                    },
                    {
                        name: "value = 72, max = 200",
                        why: "The fill sits at only 36% of the track's width even though the raw number is the same 72. Reading the fill without knowing `max` gives the wrong answer, so the two props always have to be read together.",
                        code: "<ProgressGauge value={72} max={200} />",
                        render: <ProgressGauge value={72} max={200} ariaLabel="Disk usage out of 200" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — 5 tones, rendering the FULL union (the old version only had 3). */
export const Colors: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressGauge"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="On a meter the tone is information, not decoration: the same measurement reads as safe, watch-it, or act-now depending on which band it lands in. Only the Fill takes the tone; the Track stays neutral in all five, so a column of meters still reads as one family."
                states={[
                    {
                        name: "color = accent",
                        why: "The fill renders in the neutral accent tone. This is the default reading, used when the number carries no verdict of its own yet.",
                        code: "<ProgressGauge color=\"accent\" value={55} />",
                        render: <ProgressGauge color="accent" value={55} ariaLabel="Storage used" />,
                    },
                    {
                        name: "color = success",
                        why: "The fill renders green. This band tells the reader the measurement is comfortably within its limit.",
                        code: "<ProgressGauge color=\"success\" value={30} />",
                        render: <ProgressGauge color="success" value={30} ariaLabel="Well within limit" />,
                    },
                    {
                        name: "color = warning",
                        why: "The fill renders amber. This band tells the reader the measurement is approaching its cap.",
                        code: "<ProgressGauge color=\"warning\" value={65} />",
                        render: <ProgressGauge color="warning" value={65} ariaLabel="Approaching the cap" />,
                    },
                    {
                        name: "color = danger",
                        why: "The fill renders red. This band tells the reader the measurement is almost full and needs action.",
                        code: "<ProgressGauge color=\"danger\" value={92} />",
                        render: <ProgressGauge color="danger" value={92} ariaLabel="Almost full" />,
                    },
                    {
                        name: "color = default",
                        why: "The fill renders in the plain neutral tone, with no verdict attached at all. Use this when the reading has not yet been classified into a band.",
                        code: "<ProgressGauge color=\"default\" value={48} />",
                        render: <ProgressGauge color="default" value={48} ariaLabel="Unrated measurement" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 height steps, rendering the FULL union. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressGauge"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Height is picked from a fixed 3-step scale so the atom owns it, and a caller never hand-sets a bar height with a class."
                states={[
                    {
                        name: "size = sm",
                        why: "The track renders at its shortest height. Use this in a compact row where several meters sit close together.",
                        code: "<ProgressGauge size=\"sm\" value={62} />",
                        render: <ProgressGauge size="sm" value={62} ariaLabel="Compact row" />,
                    },
                    {
                        name: "size = md (default)",
                        why: "The track renders at its default height. This is the height a caller gets without passing `size` at all.",
                        code: "<ProgressGauge value={62} />          // md = default",
                        render: <ProgressGauge size="md" value={62} ariaLabel="Default row" />,
                    },
                    {
                        name: "size = lg",
                        why: "The track renders at its tallest height. Use this when the reading is the single most prominent element on the screen.",
                        code: "<ProgressGauge size=\"lg\" value={62} />",
                        render: <ProgressGauge size="lg" value={62} ariaLabel="Prominent row" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — the atom draws its own shimmer (§12c), not using Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressGauge"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The track is replaced by a shimmer bar at the same height as the real track, no fill and no value. Since the atom draws its own shimmer, nothing shifts once the measurement lands and the real fill appears.",
                        code: "<ProgressGauge isSkeleton />",
                        render: <ProgressGauge isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
