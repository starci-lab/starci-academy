import type { Meta, StoryObj } from "@storybook/nextjs"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Cluster` — a repeating-list frame: a wrapping row of N elements of the same kind
 * (chip/tag/button). Produces `gap`, `justify`, `align`. A cluster always wraps by definition
 * (a row that may or may not wrap is `StackH`); an empty list just leaves an empty track, since
 * a frame carries no content.
 */
const meta: Meta<typeof Cluster> = {
    title: "Frames/Cluster/Cluster",
    component: Cluster,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Cluster>

const ITEM_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "composite", role: "one element of the repeating list — comes from `items` DATA, not children" },
]

/** DATA list — `items`, not child JSX (§13b). */
const TAGS = ["Docker", "Kubernetes", "CI/CD", "Terraform", "Observability", "GitOps", "Helm"]

const tagItems = (tags: ReadonlyArray<string>) =>
    tags.map((tag) => ({ key: tag, content: <Chip text={tag} /> }))

/** The wrapping surface every state below renders inside, so the wrap boundary reads the same across all of them. */
const surface = (node: React.ReactNode) => (
    <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">{node}</div>
)

/** Default — a wrapping chip row at the `gap={3}` seam: the standard rhythm for a same-kind cluster. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Cluster"
                tier="frame"
                leaf="Default"
                parts={ITEM_PARTS}
                reason="The content is N repeating elements of the SAME KIND, so by the §13b test the API is `items` DATA and `children` is FORBIDDEN, because children would let a stray node into a row whose whole premise is uniformity. `gap` applies to both axes, so wrapped rows stay evenly spaced too."
                states={[
                    {
                        name: "peers in one set, wrapped onto two lines",
                        why: "The chips wrap at the container's edge and every pair keeps the same seam on both axes, so a chip beside another and a chip below another make the same claim. Peers in one set is the relationship a tag row always has, which is why this is the standard step for this frame.",
                        code: `<Cluster
    gap={3}
    items={tags.map((tag) => ({ key: tag, content: <Chip text={tag} /> }))}
/>`,
                        render: surface(<Cluster gap={3} items={tagItems(TAGS)} />),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` is REQUIRED and type-forced onto the eight-rung
 * `AllowedGap` scale, so a value like `gap={4.5}` or `gap={9}` is a COMPILE ERROR. The number
 * is the whole vocabulary — every state below is titled by its step, with the sentence from
 * `gap.md` that earns it, so a wrong step is still checkable against something other than taste.
 */
export const Gaps: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Cluster"
                tier="frame"
                leaf="Gaps"
                parts={ITEM_PARTS}
                reason="`gap` is REQUIRED and type-forced onto the eight `AllowedGap` steps, so an off-scale value is a compile error rather than a runtime choice. This is the reason the frame exists at all instead of a hand-typed `flex flex-wrap gap-*`."
                states={[
                    {
                        name: "1 — must touch",
                        why: "The chips sit edge to edge and read as one continuous strip rather than separate tags. For chips this is almost always the wrong step, and it is shown here so the tight end of the ladder stays recognisable.",
                        code: "<Cluster gap={1} items={…} />",
                        render: surface(<Cluster gap={1} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "2 — a joint, not a seam",
                        why: "A hairline seam tells the chips apart while the row still reads as one unit. It fits an icon sitting against its own text, not a set of independent tags.",
                        code: "<Cluster gap={2} items={…} />",
                        render: surface(<Cluster gap={2} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "3 — the house default",
                        why: "Each chip is a whole thing and none of them owns the others, which is exactly the relationship this frame is built for and the rhythm `Default` demonstrates. This is the honest step for any tag cluster.",
                        code: "<Cluster gap={3} items={…} />",
                        render: surface(<Cluster gap={3} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "4 — between groups inside one surface",
                        why: "The seam grows until the chips read as separately grouped items rather than one flowing set. It fits a horizontal row of small cards, where each item is a surface of its own.",
                        code: "<Cluster gap={4} items={…} />",
                        render: surface(<Cluster gap={4} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "5 — open, no sentence yet",
                        why: "`gap.md` records this rung as chosen by 56 call sites in the app but not yet read, so it has no sentence to check a chip cluster against. Shown here for completeness, not as a usable choice — inventing a reason now would be guessing and citing the count as if it had spoken.",
                        code: "<Cluster gap={5} items={…} />",
                        render: surface(<Cluster gap={5} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "6 — between sections of a page",
                        why: "The chips break apart into individually placed elements, a false signal for items of the same kind. It is kept here to show that the ladder can be climbed too far, not as a usable choice for a cluster.",
                        code: "<Cluster gap={6} items={…} />",
                        render: surface(<Cluster gap={6} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "7 — page bands",
                        why: "The chips pull apart far enough to read as separate features sharing a line rather than a cluster at all. This step exists for a hero-to-content seam, not for chips — kept here only to bound the ladder.",
                        code: "<Cluster gap={7} items={…} />",
                        render: surface(<Cluster gap={7} items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "8 — marketing air",
                        why: "The widest rung pulls each chip so far apart that the row stops being a cluster and becomes separate things sharing a line. This extreme is for full-width marketing bands, not this frame, and exists here only to bound the ladder.",
                        code: "<Cluster gap={8} items={…} />",
                        render: surface(<Cluster gap={8} items={tagItems(TAGS.slice(0, 4))} />),
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Cluster"
                tier="frame"
                leaf="Justify"
                parts={ITEM_PARTS}
                reason="`justify` distributes elements on EACH wrapped row independently, so once a cluster has wrapped onto more than one line the last row can look uneven under `between` — that is flexbox's own behaviour, not a bug in the frame. Only three items are used here so there is leftover space to actually read the distribution."
                states={[
                    {
                        name: "justify = \"start\" (default)",
                        why: "The three chips pack against the leading edge, leaving the remaining space empty on the trailing side. This is the default because most clusters read left-to-right with no reason to spread out.",
                        code: "<Cluster gap={3} justify=\"start\" items={…} />",
                        render: surface(<Cluster gap={3} justify="start" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"center\"",
                        why: "The three chips gather at the row's midpoint with equal empty space on both sides. This suits a cluster that stands alone as a centred group rather than reading in-line with other content.",
                        code: "<Cluster gap={3} justify=\"center\" items={…} />",
                        render: surface(<Cluster gap={3} justify="center" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"end\"",
                        why: "The three chips pack against the trailing edge instead, leaving the leading side empty. This mirrors `start` for a right-aligned context.",
                        code: "<Cluster gap={3} justify=\"end\" items={…} />",
                        render: surface(<Cluster gap={3} justify="end" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"between\"",
                        why: "The three chips spread with equal space carved out between them, touching both edges of the row. This distribution only makes sense once the cluster spans the full width of its container — squeezed into a narrow box it would look identical to `start`.",
                        code: "<Cluster gap={3} justify=\"between\" items={…} />",
                        render: surface(<Cluster gap={3} justify="between" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                ]}
            />
        </div>
    ),
}
