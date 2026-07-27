import type { Meta, StoryObj } from "@storybook/nextjs"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Cluster.Base` is a REPEATING-LIST FRAME — a wrapping row of N
 * elements of the SAME KIND (chip/tag/button). The state it produces = `gap`
 * (§10), `justify`, `align`. `wrap` is NOT a state here: a cluster ALWAYS wraps
 * (that's its definition) — a row that may-or-may-not wrap is `Stack.H`. An
 * EMPTY list just leaves an empty track: the "nothing here" copy belongs to the
 * caller, not the frame (§13 — a frame carries no content).
 *
 * 2026-07-27: migrated to the `states` API (§8) — the `Gaps`/`Justify` demo rows
 * are now `states[]` entries, one per scale step, instead of a hand-stacked column
 * under a single shared `note`.
 */
const meta: Meta<typeof Cluster.Base> = {
    title: "Frames/Cluster/Cluster.Base",
    component: Cluster.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Cluster.Base>

const ITEM_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "composite", role: "one element of the repeating list — comes from `items` DATA, not children" },
]

/** DATA list — `items`, not child JSX (§13b). */
const TAGS = ["Docker", "Kubernetes", "CI/CD", "Terraform", "Observability", "GitOps", "Helm"]

const tagItems = (tags: ReadonlyArray<string>) =>
    tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))

/** The wrapping surface every state below renders inside, so the wrap boundary reads the same across all of them. */
const surface = (node: React.ReactNode) => (
    <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">{node}</div>
)

/** Default — a wrapping chip row at the `related(2)` seam: the standard rhythm for a same-kind cluster. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="frame"
                leaf="Default"
                parts={ITEM_PARTS}
                reason="The content is N repeating elements of the SAME KIND ⇒ per the §13b test, the API is `items` DATA and `children` is FORBIDDEN — children would allow sneaking a stray node into a row whose premise is uniformity. `gap` applies to both axes, so wrapped rows stay evenly spaced too."
                states={[
                    {
                        name: "gap = 2 (related)",
                        why: "The chips wrap onto a second line at the container's edge, each pair spaced at the `related(2)` step on both axes. This is the standard rhythm for a same-kind cluster like a tag row.",
                        code: `<Cluster.Base
    gap={2}
    items={tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))}
/>`,
                        render: surface(<Cluster.Base showAnatomy gap={2} items={tagItems(TAGS)} />),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` accepts EXACTLY six steps
 * `0·1·2·3·6·8` (§10c) and is REQUIRED; `gap={4}` is a COMPILE ERROR. For a chip
 * cluster, `related(2)` is the correct step.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="frame"
                leaf="Gaps"
                parts={ITEM_PARTS}
                reason="`gap` is REQUIRED and type-forced onto exactly six steps `0·1·2·3·6·8` (§10c) — `gap={4}` is a compile error, not a runtime choice. This is the reason the frame exists at all instead of a hand-typed `flex flex-wrap gap-*`."
                states={[
                    {
                        name: "gap = 0 (flush)",
                        why: "The chips sit edge to edge with no space between them. At this step the elements read as one continuous strip rather than a cluster of separate tags.",
                        code: "<Cluster.Base gap={0} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={0} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "gap = 1 (tight)",
                        why: "A hairline gap separates each chip, just enough to tell them apart without reading as loose. This step still keeps the cluster feeling like one unit.",
                        code: "<Cluster.Base gap={1} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={1} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "gap = 2 (related)",
                        why: "The spacing widens to the step this frame is built for — the correct default for a chip or tag cluster, the same rhythm `Default` demonstrates.",
                        code: "<Cluster.Base gap={2} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={2} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "gap = 3 (grouped)",
                        why: "The gap grows enough that the chips start to read as separately grouped rather than one flowing set. Still legible as a cluster, but visually looser than the related step.",
                        code: "<Cluster.Base gap={3} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={3} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "gap = 6 (section)",
                        why: "The chips break apart into loose, individually-spaced elements — a false signal for a cluster of the SAME kind, kept here only to show why the scale is a stepped set rather than an arbitrary number.",
                        code: "<Cluster.Base gap={6} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={6} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "gap = 8 (page)",
                        why: "The gap widens to the largest step on the scale, pulling each chip far enough apart that the row no longer reads as a cluster at all. This extreme exists to bound the scale, not as a realistic choice for this frame.",
                        code: "<Cluster.Base gap={8} items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={8} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Justify — distributes elements on EACH row. `start` (default) reads naturally
 * by default; `between` only makes sense when the cluster spans the full width.
 */
export const Justify: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="frame"
                leaf="Justify"
                parts={ITEM_PARTS}
                reason="`justify` distributes elements on EACH wrapped row independently, so once a cluster has wrapped onto more than one line the last row can look uneven under `between` — that is flexbox's own behaviour, not a bug in the frame. Only three items are used here so there is leftover space to actually read the distribution."
                states={[
                    {
                        name: "justify = \"start\" (default)",
                        why: "The three chips pack against the leading edge, leaving the remaining space empty on the trailing side. This is the default because most clusters read left-to-right with no reason to spread out.",
                        code: "<Cluster.Base gap={2} justify=\"start\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={2} justify="start" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"center\"",
                        why: "The three chips gather at the row's midpoint with equal empty space on both sides. This suits a cluster that stands alone as a centred group rather than reading in-line with other content.",
                        code: "<Cluster.Base gap={2} justify=\"center\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={2} justify="center" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"end\"",
                        why: "The three chips pack against the trailing edge instead, leaving the leading side empty. This mirrors `start` for a right-aligned context.",
                        code: "<Cluster.Base gap={2} justify=\"end\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={2} justify="end" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"between\"",
                        why: "The three chips spread with equal space carved out between them, touching both edges of the row. This distribution only makes sense once the cluster spans the full width of its container — squeezed into a narrow box it would look identical to `start`.",
                        code: "<Cluster.Base gap={2} justify=\"between\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap={2} justify="between" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                ]}
            />
        </div>
    ),
}
