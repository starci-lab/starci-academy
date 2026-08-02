import type { Meta, StoryObj } from "@storybook/nextjs"
import { UsersIcon, SparkleIcon, WarningCircleIcon, ChatCircleIcon, InfoIcon } from "@phosphor-icons/react"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InlineIconLabel` — a leading icon + an inline text label as one unit (a count, an eyebrow, a
 * tab label, a toned caption). Owns the icon size (per the text scale) and the tone colour, so a
 * call-site never hand-rolls `flex items-center gap-1` + a bare icon + a `Typography`. Leaves:
 * `icon`, `tone`, `size`, `truncate`, `isSkeleton`, `skeletonWidth`.
 */
const meta: Meta<typeof InlineIconLabel> = {
    title: "Composites/Texts/InlineIconLabel",
    component: InlineIconLabel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof InlineIconLabel>

const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Baseline leaf — icon + label, no tone (inherits currentColor), default size/truncate. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The plain icon+text row every call-site reaches for instead of hand-rolling flex + gap + a bare icon + a Typography. Every other leaf on this page differs from this one by exactly one prop."
                states={[
                    {
                        name: "no tone, size = \"xs\" (default), truncate = false",
                        why: "Icon and text inherit the ambient foreground colour, since no tone is set — the shape a plain tab label takes, where the row must not compete with a nearby tone of its own.",
                        code: "<InlineIconLabel icon={SparkleIcon}>Overview</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} label="Overview" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — a COMPONENT reference, never built JSX; the composite forces its box to size-4. */
export const IconProp: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="A leading glyph, always a Phosphor icon COMPONENT reference, never pre-built JSX — the composite calls it itself and forces its box to size-4 through a CSS descendant selector, so no call-site can slip in a mismatched icon size."
                states={[
                    {
                        name: "icon = UsersIcon",
                        why: "A people glyph leads a learner count, the most common lane this composite fills — a number that needs a quick visual cue for what it is counting.",
                        code: "<InlineIconLabel icon={UsersIcon} tone=\"default\">1,284 learners</InlineIconLabel>",
                        render: <InlineIconLabel icon={UsersIcon} tone="default" label="1,284 learners" />,
                    },
                    {
                        name: "icon = ChatCircleIcon",
                        why: "Swapping the icon component swaps only the glyph, nothing about the row's gap or text scale — this is how a comment count gets its own icon without a second component to keep in sync.",
                        code: "<InlineIconLabel icon={ChatCircleIcon} tone=\"default\">128 comments</InlineIconLabel>",
                        render: <InlineIconLabel icon={ChatCircleIcon} tone="default" label="128 comments" />,
                    },
                    {
                        name: "icon = SparkleIcon",
                        why: "A sparkle glyph reads as AI-produced wherever it leads a caption, the same icon this composite's own eyebrow lane already uses for a Graded-by-AI note.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"default\">Graded by AI</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} tone="default" label="Graded by AI" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tone` — the FULL AlertStatus union, plus the "omitted" foreground case (7 states total). */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `tone`"
                reason="tone colours the icon and the text together as ONE unit, aliasing the same 6-value AlertStatus scale (§9-clean) instead of inventing its own vocabulary. Left unset, both inherit the ambient foreground instead of any of the six — a 7th, distinct state."
                states={[
                    {
                        name: "tone = undefined (foreground, default)",
                        why: "Icon and text inherit whatever colour the surrounding text already has — the shape for a plain tab label where the row must not compete with a nearby tone.",
                        code: "<InlineIconLabel icon={SparkleIcon}>Overview</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} label="Overview" />,
                    },
                    {
                        name: "tone = \"default\"",
                        why: "Icon and text both take the neutral muted colour, for an inline note that should read as secondary without any semantic charge — a count or a plain caption.",
                        code: "<InlineIconLabel icon={UsersIcon} tone=\"default\">1,284 learners</InlineIconLabel>",
                        render: <InlineIconLabel icon={UsersIcon} tone="default" label="1,284 learners" />,
                    },
                    {
                        name: "tone = \"accent\"",
                        why: "Icon and text take the brand accent colour, for a caption the composite wants to draw a little attention to without alarming the reader.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"accent\">Graded by Claude</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} tone="accent" label="Graded by Claude" />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "Icon and text take the success colour, for a caption reporting something completed or passed, e.g. grading finishing without issue.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"success\">Grading complete</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} tone="success" label="Grading complete" />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "Icon and text take the warning colour, for a caption that wants the reader's attention before a deadline or a limit closes in.",
                        code: "<InlineIconLabel icon={WarningCircleIcon} tone=\"warning\">3 spots left — price is about to rise</InlineIconLabel>",
                        render: <InlineIconLabel icon={WarningCircleIcon} tone="warning" label="3 spots left — price is about to rise" />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "Icon and text take the danger colour, for a caption reporting something that has already gone wrong, e.g. a missed deadline.",
                        code: "<InlineIconLabel icon={WarningCircleIcon} tone=\"danger\">Submission deadline passed</InlineIconLabel>",
                        render: <InlineIconLabel icon={WarningCircleIcon} tone="danger" label="Submission deadline passed" />,
                    },
                    {
                        name: "tone = \"info\"",
                        why: "Icon and text take the info colour, for a caption surfacing a neutral fact worth a small amount of attention, without the weight of a warning or an error.",
                        code: "<InlineIconLabel icon={InfoIcon} tone=\"info\">New grading model available</InlineIconLabel>",
                        render: <InlineIconLabel icon={InfoIcon} tone="info" label="New grading model available" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `size` — xs (default) · sm; the icon stays size-4 for BOTH steps. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size scales the TEXT only (body-xs/body-sm) — the icon holds at size-4 for both steps, the app's own inline-meta glyph size, so an icon+text row never looks mismatched at either scale."
                states={[
                    {
                        name: "size = \"xs\" (default)",
                        why: "The label renders at body-xs, the tightest inline scale, for a dense caption row such as a count sitting under a card title.",
                        code: "<InlineIconLabel icon={ChatCircleIcon} tone=\"default\" size=\"xs\">128 comments</InlineIconLabel>",
                        render: <InlineIconLabel icon={ChatCircleIcon} tone="default" size="xs" label="128 comments" />,
                    },
                    {
                        name: "size = \"sm\"",
                        why: "The label steps up to body-sm while the icon stays the same size-4 box, for a caption that needs to read a little larger without growing its glyph out of step.",
                        code: "<InlineIconLabel icon={ChatCircleIcon} tone=\"default\" size=\"sm\">128 comments</InlineIconLabel>",
                        render: <InlineIconLabel icon={ChatCircleIcon} tone="default" size="sm" label="128 comments" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `truncate` — clamps the label to one line inside a bounded width; the icon never truncates. */
export const Truncate: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `truncate`"
                reason="truncate clamps the label text to a single line, needing a bounded parent width to have any effect — the icon never truncates, only the Typography text node."
                states={[
                    {
                        name: "truncate = false (default)",
                        why: "The label wraps onto as many lines as its content needs, since nothing tells Typography to clip it. Inside a narrow parent, a long label pushes the row taller instead of clipping.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"default\">A very long label gets clipped at the end of the line</InlineIconLabel>",
                        render: (
                            <div data-tier="fixture" className="w-44 rounded-2xl border border-separator p-3">
                                <InlineIconLabel icon={SparkleIcon} tone="default" label="A very long label gets clipped at the end of the line" />
                            </div>
                        ),
                    },
                    {
                        name: "truncate = true",
                        why: "The label clips to one line with an ellipsis inside the same bounded width, instead of wrapping and growing the row's height.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"default\" truncate>A very long label gets clipped at the end of the line</InlineIconLabel>",
                        render: (
                            <div data-tier="fixture" className="w-44 rounded-2xl border border-separator p-3">
                                <InlineIconLabel icon={SparkleIcon} tone="default" truncate label="A very long label gets clipped at the end of the line" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — icon becomes a circular HeroUI Skeleton shimmer; the label shimmers through Typography. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="One render path (COMPOSITE-10): the wrapper span and its gap stay identical in both states. The icon slot becomes a size-4 circular HeroUI Skeleton — the one bare-icon shimmer shape this composite draws itself — and the label shimmers through Typography's own isSkeleton bar."
                states={[
                    {
                        name: "isSkeleton = false (default)",
                        why: "The real icon and label render, tone applied to both — the shape isSkeleton mirrors.",
                        code: "<InlineIconLabel icon={SparkleIcon} tone=\"default\">Graded by AI</InlineIconLabel>",
                        render: <InlineIconLabel icon={SparkleIcon} tone="default" label="Graded by AI" />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The icon becomes a circular shimmer standing in for any glyph, and the label becomes a shimmer bar at the default skeletonWidth (w-1/4) — no tone applies to either while loading, since tone is a fact about content that hasn't arrived yet.",
                        code: "<InlineIconLabel icon={SparkleIcon} isSkeleton size=\"xs\" />",
                        render: <InlineIconLabel icon={SparkleIcon} isSkeleton size="xs" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `skeletonWidth` — the FULL closed union of shimmer-bar fractions, only meaningful while `isSkeleton`. */
export const SkeletonWidth: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="InlineIconLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `skeletonWidth`"
                reason="The label's shimmer bar width is handed straight to Typography as a fraction of the row, so a caller can size the placeholder to roughly the length of the real text that will land — a short eyebrow shimmers narrower than a long comment count."
                states={(["w-1/4", "w-1/3", "w-1/2", "w-2/3", "w-3/4"] as const).map((width) => ({
                    name: `skeletonWidth = "${width}"${width === "w-1/4" ? " (default)" : ""}`,
                    why: `The label's shimmer bar spans ${width.replace("w-", "")} of the row's width while the icon keeps its own fixed circular shimmer, unaffected by this prop.`,
                    code: width === "w-1/4"
                        ? "<InlineIconLabel icon={SparkleIcon} isSkeleton />          // w-1/4 = default"
                        : `<InlineIconLabel icon={SparkleIcon} isSkeleton skeletonWidth="${width}" />`,
                    render: <InlineIconLabel icon={SparkleIcon} isSkeleton skeletonWidth={width} />,
                }))}
            />
        </div>
    ),
}
