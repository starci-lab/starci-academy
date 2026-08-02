import type { Meta, StoryObj } from "@storybook/nextjs"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TitledText` — a primary line + optional muted secondary (and optional hint) stacked
 * vertically as one composite; a title↔subtitle pair is a single semantic unit rather than raw
 * `<Typography>` hand-rolled at every row. The composite owns the type scale per `size`; the
 * caller passes nodes only. Leaves: `subtitle`, `hint`, `size`, `weight`, `truncate`, `isSkeleton`.
 */

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "the title, the optional subtitle, and the optional hint — up to three separate Typography instances stacked in a StackV",
        storyId: "atoms-text-typography-typography--overview",
    },
}

const meta: Meta<typeof TitledText> = {
    title: "Composites/Texts/TitledText",
    component: TitledText,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof TitledText>

/**
 * Leaf for prop `subtitle` — the optional secondary line beneath the title.
 */
export const Subtitle: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `subtitle`"
                reason="subtitle is the optional second line — a description, a role, a condition. Left unset, the stack collapses to one line rather than leaving an empty gap where the second line would sit."
                states={[
                    {
                        name: "subtitle = undefined",
                        why: "Only the title line renders, no subtitle bar or gap beneath it. This is the shape for a bare label — a notification title, a bare setting name with nothing more to say.",
                        code: "<TitledText title=\"Notification\" />",
                        render: <TitledText title="Notification" />,
                    },
                    {
                        name: "subtitle set",
                        why: "A muted secondary line grows directly beneath the title, gap-1 apart. This is the shape a setting row takes when the title alone doesn't say enough — the subtitle explains what turning it on actually does.",
                        code: "<TitledText title=\"Grade with the premium model\" subtitle=\"Unlocks when you upgrade your plan\" />",
                        render: <TitledText title="Grade with the premium model" subtitle="Unlocks when you upgrade your plan" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `hint` — the optional third muted line, only meaningful with
 * `size="stat"`.
 */
export const Hint: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `hint`"
                reason={"hint is a third muted line beneath subtitle, only meaningful for size=\"stat\" — a delta or a trend note under a metric's value and label. Left unset, the stack stops at two lines."}
                states={[
                    {
                        name: "hint = undefined",
                        why: "Only the value and its label render, two lines total, no third line beneath. This is the shape for a metric with nothing to say about its trend yet.",
                        code: "<TitledText size=\"stat\" title=\"1,284\" subtitle=\"Students\" />",
                        render: <TitledText size="stat" title="1,284" subtitle="Students" />,
                    },
                    {
                        name: "hint set",
                        why: "A third muted line grows beneath the label, completing the three-line stat stack — big bold value, foreground label, muted hint. This is the shape a dashboard tile takes when it also wants to show the metric's recent trend.",
                        code: "<TitledText size=\"stat\" title=\"1,284\" subtitle=\"Students\" hint=\"+12% vs last month\" />",
                        render: <TitledText size="stat" title="1,284" subtitle="Students" hint="+12% vs last month" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `size` — 3 vertical text-stack scales, each with its own
 * type + tone table (`SIZE_CONFIG`).
 */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size picks the whole vertical stack's scale in one go — title weight, subtitle size/tone, and (for stat) the hint's presence all change together, so a caller never mixes a row-scale title with a header-scale subtitle by accident."
                states={[
                    {
                        name: "size = \"row\" (default)",
                        why: "The title renders body-sm medium over a body-xs muted subtitle — the dense scale a list row or setting row falls back to when size is left unset.",
                        code: "<TitledText title=\"Grade with the premium model\" subtitle=\"Unlocks when you upgrade your plan\" />",
                        render: <TitledText title="Grade with the premium model" subtitle="Unlocks when you upgrade your plan" />,
                    },
                    {
                        name: "size = \"header\"",
                        why: "The title steps up to an h3 semibold heading over a body-sm muted subtitle. This is the scale a section or page header reaches for, where the title needs to outrank the ordinary body text around it.",
                        code: "<TitledText size=\"header\" title=\"DevOps Course\" subtitle=\"12 modules · updated 2 days ago\" />",
                        render: <TitledText size="header" title="DevOps Course" subtitle="12 modules · updated 2 days ago" />,
                    },
                    {
                        name: "size = \"stat\"",
                        why: "The title becomes a big bold h3 VALUE, the subtitle switches to a foreground medium LABEL instead of muted, and a third muted hint line becomes meaningful. This is the scale a metric tile uses — a value, what it counts, and an optional trend.",
                        code: "<TitledText size=\"stat\" title=\"1,284\" subtitle=\"Students\" hint=\"+12% vs last month\" />",
                        render: <TitledText size="stat" title="1,284" subtitle="Students" hint="+12% vs last month" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `weight` — overrides the per-size title weight default.
 */
export const Weight: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `weight`"
                reason="weight overrides the title's per-size default (medium for row, semibold for header, bold for stat) when one call site needs to step the title's emphasis up or down without switching the whole size scale."
                states={[
                    {
                        name: "weight = undefined (per-size default)",
                        why: "The title renders at its size's own default weight — medium for the row scale shown here. This is the shape every leaf above takes when weight is left unset.",
                        code: "<TitledText title=\"Grade with the premium model\" subtitle=\"Unlocks when you upgrade your plan\" />",
                        render: <TitledText title="Grade with the premium model" subtitle="Unlocks when you upgrade your plan" />,
                    },
                    {
                        name: "weight = \"medium\"",
                        why: "The title renders at medium weight regardless of size — here forced on a header-scale title that would otherwise default to semibold, for a quieter section heading.",
                        code: "<TitledText size=\"header\" weight=\"medium\" title=\"DevOps Course\" subtitle=\"12 modules · updated 2 days ago\" />",
                        render: <TitledText size="header" weight="medium" title="DevOps Course" subtitle="12 modules · updated 2 days ago" />,
                    },
                    {
                        name: "weight = \"semibold\"",
                        why: "The title renders at semibold weight — here forced on a row-scale title that would otherwise default to medium, for a row that needs to read slightly heavier than its neighbours.",
                        code: "<TitledText weight=\"semibold\" title=\"Grade with the premium model\" subtitle=\"Unlocks when you upgrade your plan\" />",
                        render: <TitledText weight="semibold" title="Grade with the premium model" subtitle="Unlocks when you upgrade your plan" />,
                    },
                    {
                        name: "weight = \"bold\"",
                        why: "The title renders at bold weight — here forced on a header-scale title for a page title that must outrank an ordinary section header nearby.",
                        code: "<TitledText size=\"header\" weight=\"bold\" title=\"DevOps Course\" subtitle=\"12 modules · updated 2 days ago\" />",
                        render: <TitledText size="header" weight="bold" title="DevOps Course" subtitle="12 modules · updated 2 days ago" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `truncate` — clips every line to one line at once (needs a
 * bounded parent width).
 */
export const Truncate: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `truncate`"
                reason="truncate clips every line the composite renders to a single line with an ellipsis, all at once — a caller can't truncate just the title and leave the subtitle wrapping, since a stack where only one line clips still breaks the row's height."
                states={[
                    {
                        name: "truncate = false (default)",
                        why: "Both lines wrap normally to fill the width they're given — the shape every leaf above this one uses, since none of them bound their container's width.",
                        code: "<TitledText title=\"A very long title that gets clipped at the end of the line\" subtitle=\"And a subtitle that is just as long gets clipped the same way\" />",
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-2xl border border-separator p-3">
                                <TitledText
                                    title="A very long title that gets clipped at the end of the line"
                                    subtitle="And a subtitle that is just as long gets clipped the same way"
                                   
                                />
                            </div>
                        ),
                    },
                    {
                        name: "truncate = true",
                        why: "Both lines clip to a single line with an ellipsis once they hit the bounded parent's edge. This is the shape a narrow list row needs so one long title never pushes the row's height taller than its neighbours.",
                        code: "<TitledText title=\"A very long title that gets clipped at the end of the line\" subtitle=\"And a subtitle that is just as long gets clipped the same way\" truncate />",
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-2xl border border-separator p-3">
                                <TitledText
                                    title="A very long title that gets clipped at the end of the line"
                                    subtitle="And a subtitle that is just as long gets clipped the same way"
                                    truncate
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — shimmer CO-LOCATED per line, one bar for each
 * of title/subtitle/hint that would otherwise render.
 */
export const SkeletonState: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TitledText"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="isSkeleton flows into each line's own Typography instance (COMPOSITE-10): the composite decides only which lines shimmer (mirroring which of subtitle/hint were passed) and how wide each bar sits, sized per SIZE_CONFIG's own skeleton table."
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The real two-line stack renders: a medium title over a muted subtitle — the shape the shimmer below mirrors.",
                        code: "<TitledText title=\"Grade with the premium model\" subtitle=\"Unlocks when you upgrade your plan\" />",
                        render: <TitledText title="Grade with the premium model" subtitle="Unlocks when you upgrade your plan" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"row\"",
                        why: "Two shimmer bars stack in place of the title and subtitle, each sized to the row scale's own skeleton widths. Passing a real subtitle string still only shimmers the bar — the text itself never leaks through.",
                        code: "<TitledText title=\"\" subtitle=\"x\" isSkeleton />",
                        render: <TitledText title="" subtitle="x" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"stat\"",
                        why: "Three shimmer bars stack — value, label, and hint — matching the three real lines a loaded stat tile would show, each at the stat scale's own skeleton widths.",
                        code: "<TitledText size=\"stat\" title=\"\" subtitle=\"x\" hint=\"x\" isSkeleton />",
                        render: <TitledText size="stat" title="" subtitle="x" hint="x" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
