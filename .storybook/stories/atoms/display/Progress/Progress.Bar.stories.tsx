import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Bar> = {
    title: "Atoms/Display/Progress/Progress.Bar",
    component: Progress.Bar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Bar>

/**
 * `ProgressBar.Track`/`ProgressBar.Fill` are direct HeroUI compound-component
 * renders (`tier: "heroui"`, no `storyId` — there is no story of ours to jump
 * to for a library component). `Skeleton` is HeroUI's own `Skeleton`, same
 * reasoning. Renamed from the role-words `Track`/`Fill` (§ naming pass,
 * 2026-07-28) — those names collided with `Progress.Circle`/`Progress.Meter`'s
 * own `Track`/`Fill`, which are DIFFERENT real compound components.
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

/** Value — tiến trình xác định (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Value"
                annotate={ANNOTATE}
                reason="The linear progress bar wrapping react-aria ProgressBar; determinate (value) or indeterminate."
                states={[
                    {
                        name: "value = 62, max = 100",
                        why: "The Fill span's width is set to the percentage of value over max, landing at 62% wide. A determinate bar is used whenever the caller can compute a real fraction of work done, so the width itself carries the information.",
                        code: "<Progress.Bar value={62} max={100} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar value={62} ariaLabel="Course progress" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Indeterminate — không rõ thời lượng → fill tự chạy (không value). */
export const Indeterminate: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Indeterminate"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isIndeterminate = true",
                        why: "The Fill switches from a fixed-width bar to a CSS animation that runs on its own, since react-aria ignores value in this mode. This is for a run whose duration nobody can predict, so a moving bar is more honest than a fake percentage.",
                        code: "<Progress.Bar isIndeterminate />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar isIndeterminate ariaLabel="Processing" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Loading"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole bar swaps to its own shimmering placeholder (hybrid C) instead of the real track/fill pair. This lets a progress row hold its place on the page before the real value is known, rather than popping in once it lands.",
                        code: "<Progress.Bar isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — 5 tone, mỗi tone là MỘT state (điều kiện: `color` truyền vào). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="The fill tone carries meaning — accent for a plain run, success/warning/danger for an outcome the value implies, default when the tone should stay silent. Only the Fill part ever takes the tone; the Track stays neutral in every case, so bars in different tones still read as one family."
                states={[
                    {
                        name: "color = \"accent\"",
                        why: "The Fill renders in the accent tone while the Track stays neutral. This is the plain tone for a run that has not yet finished or failed, with no verdict implied.",
                        code: "<Progress.Bar color=\"accent\" value={55} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar color="accent" value={55} ariaLabel="Course progress" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"success\"",
                        why: "The Fill renders in the success tone. This marks a value that already stands for a completed or positive outcome, such as an upload that finished.",
                        code: "<Progress.Bar color=\"success\" value={100} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar color="success" value={100} ariaLabel="Upload complete" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"warning\"",
                        why: "The Fill renders in the warning tone. This flags a value the caller wants the viewer to notice before it turns into a failure, such as a sync that needs attention.",
                        code: "<Progress.Bar color=\"warning\" value={40} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar color="warning" value={40} ariaLabel="Sync needs attention" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"danger\"",
                        why: "The Fill renders in the danger tone. This marks a value tied to an outcome that already failed, such as a deploy that errored out.",
                        code: "<Progress.Bar color=\"danger\" value={20} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar color="danger" value={20} ariaLabel="Deploy failed" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "color = \"default\"",
                        why: "The Fill renders in the neutral default tone, the same shape as every other tone. This is for a value the UI shows without implying any verdict at all, such as an idle queue length.",
                        code: "<Progress.Bar color=\"default\" value={65} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar color="default" value={65} ariaLabel="Idle queue" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 mốc chiều cao, mỗi mốc là MỘT state. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Height signals how much weight the progress deserves on the page, a compact row inside a dense list versus a prominent bar carrying the whole screen's attention. Only the track height changes across sizes; the fill colour and rounding stay identical."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The Track height drops to its most compact setting. This is for a bar sitting inside a dense list, where a tall bar would crowd its neighbours.",
                        code: "<Progress.Bar size=\"sm\" value={62} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar size="sm" value={62} ariaLabel="Compact row" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "size = \"md\"",
                        why: "The Track renders at its default height. This is the middle ground for a bar standing on its own in a regular row, neither cramped nor oversized.",
                        code: "<Progress.Bar size=\"md\" value={62} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar size="md" value={62} ariaLabel="Default row" showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The Track grows to its tallest setting. This is for a bar meant to carry the whole screen's attention on its own, where a thin bar would read as an afterthought.",
                        code: "<Progress.Bar size=\"lg\" value={62} />",
                        render: (
                            <div className="w-72">
                                <Progress.Bar size="lg" value={62} ariaLabel="Prominent row" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
