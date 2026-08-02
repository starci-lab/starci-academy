import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ProgressBar> = {
    title: "Atoms/Display/Progress/ProgressBar",
    component: ProgressBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProgressBar>

/**
 * `ProgressBar.Track`/`ProgressBar.Fill` are direct HeroUI compound-component renders
 * (`tier: "heroui"`, no `storyId` — a library component has no story of ours to jump to).
 * `Skeleton` is HeroUI's own `Skeleton`, same reasoning. Named distinctly from
 * `ProgressCircle`/`ProgressMeter`'s own `Track`/`Fill`, which are different compounds.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ProgressBar.Track": {
        tier: "heroui",
        role: "the neutral rail the fill sits inside",
    },
    "ProgressBar.Fill": {
        tier: "heroui",
        role: "the filled portion — a fixed width at a value, or a running CSS animation when indeterminate",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the resting shimmer bar, drawn in place of the whole track/fill pair while isSkeleton is on",
    },
}

/** Value — determinate progress (value/max). */
export const Value: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressBar"
                tier="atom"
                leaf="Value"
                annotate={ANNOTATE}
                reason="The linear progress bar wrapping react-aria ProgressBar; determinate (value) or indeterminate."
                states={[
                    {
                        name: "value = 62, max = 100",
                        why: "The Fill span's width is set to the percentage of value over max, landing at 62% wide. A determinate bar is used whenever the caller can compute a real fraction of work done, so the width itself carries the information.",
                        code: "<ProgressBar value={62} max={100} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar value={62} ariaLabel="Course progress" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Indeterminate — duration unknown → fill runs on its own (no value). */
export const Indeterminate: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressBar"
                tier="atom"
                leaf="Indeterminate"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isIndeterminate = true",
                        why: "The Fill switches from a fixed-width bar to a CSS animation that runs on its own, since react-aria ignores value in this mode. This is for a run whose duration nobody can predict, so a moving bar is more honest than a fake percentage.",
                        code: "<ProgressBar isIndeterminate />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar isIndeterminate ariaLabel="Processing" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — the atom draws its own leaf skeleton; no Skeleton.* used. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressBar"
                tier="atom"
                leaf="Loading"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole bar swaps to its own shimmering placeholder (hybrid C) instead of the real track/fill pair. This lets a progress row hold its place on the page before the real value is known, rather than popping in once it lands.",
                        code: "<ProgressBar isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — 5 tones, each tone is ONE state (condition: `color` passed in). */
export const Colors: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressBar"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="The fill tone carries meaning — accent for a plain run, success/warning/danger for an outcome the value implies, default when the tone should stay silent. Only the Fill part ever takes the tone; the Track stays neutral in every case, so bars in different tones still read as one family."
                states={[
                    {
                        name: "color = \"accent\"",
                        why: "The Fill renders in the accent tone while the Track stays neutral. This is the plain tone for a run that has not yet finished or failed, with no verdict implied.",
                        code: "<ProgressBar color=\"accent\" value={55} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar color="accent" value={55} ariaLabel="Course progress" />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"success\"",
                        why: "The Fill renders in the success tone. This marks a value that already stands for a completed or positive outcome, such as an upload that finished.",
                        code: "<ProgressBar color=\"success\" value={100} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar color="success" value={100} ariaLabel="Upload complete" />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"warning\"",
                        why: "The Fill renders in the warning tone. This flags a value the caller wants the viewer to notice before it turns into a failure, such as a sync that needs attention.",
                        code: "<ProgressBar color=\"warning\" value={40} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar color="warning" value={40} ariaLabel="Sync needs attention" />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"danger\"",
                        why: "The Fill renders in the danger tone. This marks a value tied to an outcome that already failed, such as a deploy that errored out.",
                        code: "<ProgressBar color=\"danger\" value={20} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar color="danger" value={20} ariaLabel="Deploy failed" />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"default\"",
                        why: "The Fill renders in the neutral default tone, the same shape as every other tone. This is for a value the UI shows without implying any verdict at all, such as an idle queue length.",
                        code: "<ProgressBar color=\"default\" value={65} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar color="default" value={65} ariaLabel="Idle queue" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 height steps, each step is ONE state. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressBar"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Height signals how much weight the progress deserves on the page, a compact row inside a dense list versus a prominent bar carrying the whole screen's attention. Only the track height changes across sizes; the fill colour and rounding stay identical."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The Track height drops to its most compact setting. This is for a bar sitting inside a dense list, where a tall bar would crowd its neighbours.",
                        code: "<ProgressBar size=\"sm\" value={62} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar size="sm" value={62} ariaLabel="Compact row" />
                            </div>
                        ),
                    },
                    {
                        name: "size = \"md\"",
                        why: "The Track renders at its default height. This is the middle ground for a bar standing on its own in a regular row, neither cramped nor oversized.",
                        code: "<ProgressBar size=\"md\" value={62} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar size="md" value={62} ariaLabel="Default row" />
                            </div>
                        ),
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The Track grows to its tallest setting. This is for a bar meant to carry the whole screen's attention on its own, where a thin bar would read as an afterthought.",
                        code: "<ProgressBar size=\"lg\" value={62} />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ProgressBar size="lg" value={62} ariaLabel="Prominent row" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
