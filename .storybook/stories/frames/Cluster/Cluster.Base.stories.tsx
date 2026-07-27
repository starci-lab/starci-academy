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
                reason="The content is N repeating elements of the SAME KIND, so by the §13b test the API is `items` DATA and `children` is FORBIDDEN, because children would let a stray node into a row whose whole premise is uniformity. `gap` applies to both axes, so wrapped rows stay evenly spaced too."
                states={[
                    {
                        name: "peers in one set, wrapped onto two lines",
                        why: "The chips wrap at the container's edge and every pair keeps the same seam on both axes, so a chip beside another and a chip below another make the same claim. Peers in one set is the relationship a tag row always has, which is why this is the standard step for this frame.",
                        code: `<Cluster.Base
    gap="related"
    items={tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))}
/>`,
                        render: surface(<Cluster.Base showAnatomy gap="related" items={tagItems(TAGS)} />),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` names a RELATIONSHIP and is REQUIRED, so a number
 * like `gap={4}` is a COMPILE ERROR (§10c). For a chip cluster the chips are peers in one set,
 * which makes `related` the correct step; every state below is titled by the relationship it
 * claims, so a wrong claim is visible without measuring anything.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="frame"
                leaf="Gaps"
                parts={ITEM_PARTS}
                reason="`gap` is REQUIRED and type-forced onto the six `SeamScale` words (§10c), so a number is a compile error rather than a runtime choice. This is the reason the frame exists at all instead of a hand-typed `flex flex-wrap gap-*`."
                states={[
                    {
                        name: "one continuous thing",
                        why: "The chips sit edge to edge and read as one continuous strip rather than separate tags. For chips this is almost always the wrong claim, and it is shown here so the wrong end of the ladder stays recognisable.",
                        code: "<Cluster.Base gap=\"flush\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="flush" items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "a mark and its label",
                        why: "A hairline seam tells the chips apart while the row still reads as one unit. It fits an icon sitting against its own text, not a set of independent tags.",
                        code: "<Cluster.Base gap=\"tight\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="tight" items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "peers in one set",
                        why: "Each chip is a whole thing and none of them owns the others, which is exactly the relationship this frame is built for and the rhythm `Default` demonstrates. This is the honest step for any tag cluster.",
                        code: "<Cluster.Base gap=\"related\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="related" items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "rows inside one surface",
                        why: "The seam grows until the chips read as separately grouped items rather than one flowing set. It fits a horizontal row of small cards, where each item is a surface of its own.",
                        code: "<Cluster.Base gap=\"grouped\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="grouped" items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "regions of one page",
                        why: "The chips break apart into individually placed elements, a false signal for items of the same kind. It is kept here to show that the ladder can be climbed too far, not as a usable choice for a cluster.",
                        code: "<Cluster.Base gap=\"section\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="section" items={tagItems(TAGS.slice(0, 4))} />),
                    },
                    {
                        name: "features standing apart",
                        why: "The widest step pulls each chip so far apart that the row stops being a cluster and becomes separate things sharing a line. This extreme exists to bound the ladder, not as a realistic choice for this frame.",
                        code: "<Cluster.Base gap=\"page\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="page" items={tagItems(TAGS.slice(0, 4))} />),
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
                        code: "<Cluster.Base gap=\"related\" justify=\"start\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="related" justify="start" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"center\"",
                        why: "The three chips gather at the row's midpoint with equal empty space on both sides. This suits a cluster that stands alone as a centred group rather than reading in-line with other content.",
                        code: "<Cluster.Base gap=\"related\" justify=\"center\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="related" justify="center" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"end\"",
                        why: "The three chips pack against the trailing edge instead, leaving the leading side empty. This mirrors `start` for a right-aligned context.",
                        code: "<Cluster.Base gap=\"related\" justify=\"end\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="related" justify="end" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                    {
                        name: "justify = \"between\"",
                        why: "The three chips spread with equal space carved out between them, touching both edges of the row. This distribution only makes sense once the cluster spans the full width of its container — squeezed into a narrow box it would look identical to `start`.",
                        code: "<Cluster.Base gap=\"related\" justify=\"between\" items={…} />",
                        render: surface(<Cluster.Base showAnatomy gap="related" justify="between" items={tagItems(TAGS.slice(0, 3))} />),
                    },
                ]}
            />
        </div>
    ),
}
