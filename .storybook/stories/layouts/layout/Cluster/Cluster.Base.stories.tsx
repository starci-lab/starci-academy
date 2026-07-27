import type { Meta, StoryObj } from "@storybook/nextjs"
import { Cluster } from "@sb-components/layouts/layout/Cluster/Cluster"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Cluster.Base` is a REPEATING-LIST FRAME — a wrapping row of N
 * elements of the SAME KIND (chip/tag/button). The state it produces = `gap`
 * (§10), `justify`, `align`. `wrap` is NOT a state here: a cluster ALWAYS wraps
 * (that's its definition) — a row that may-or-may-not wrap is `Stack.H`. An
 * EMPTY list just leaves an empty track: the "nothing here" copy belongs to the
 * caller, not the frame (§13 — a frame carries no content).
 */
const meta: Meta<typeof Cluster.Base> = {
    title: "Layouts/Layout/Cluster/Cluster.Base",
    component: Cluster.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Cluster.Base>

const ITEM_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "primitive", role: "one element of the repeating list — comes from `items` DATA, not children" },
]

/** DATA list — `items`, not child JSX (§13b). */
const TAGS = ["Docker", "Kubernetes", "CI/CD", "Terraform", "Observability", "GitOps", "Helm"]

const tagItems = (tags: ReadonlyArray<string>) =>
    tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))

/** The six VALID steps of §10 — `gap` is a union literal so there's no seventh step. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — a wrapping chip row at the `related(2)` seam: the standard rhythm for a same-kind cluster. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Cluster.Base"
                tier="primitive"
                leaf="Default"
                parts={ITEM_PARTS}
                reason="The content is N repeating elements of the SAME KIND ⇒ per the §13b test, the API is `items` DATA and `children` is FORBIDDEN — children would allow sneaking a stray node into a row whose premise is uniformity. `gap` applies to both axes, so wrapped rows stay evenly spaced too."
                code={`<Cluster.Base
  gap={2}
  items={tags.map((tag) => ({ key: tag, content: <Chip.Base text={tag} /> }))}
/>`}
            >
                <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                    <Cluster.Base showAnatomy gap={2} items={tagItems(TAGS)} />
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="Gaps"
                parts={ITEM_PARTS}
                note="Large steps (6/8) break the cluster apart into loose elements — a false signal for a cluster of the SAME kind; kept here to show why the scale is stepped rather than an arbitrary number."
                code={`<Cluster.Base
  gap={2}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {SCALE.map((step, index) => (
                        <div key={step.gap} className="flex flex-col gap-2">
                            <Typography.Base size="xs" text={step.name} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Cluster.Base showAnatomy={index === 0} gap={step.gap} items={tagItems(TAGS.slice(0, 4))} />
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="Justify"
                parts={ITEM_PARTS}
                note="Few elements so there's leftover space to read the distribution; `between` applies to EACH row, so once a cluster has wrapped the last row will look uneven — that's flexbox behaviour, not a bug in the frame."
                code={`<Cluster.Base
  gap={2}
  justify="between"
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {(["start", "center", "end", "between"] as const).map((justify, index) => (
                        <div key={justify} className="flex flex-col gap-2">
                            <Typography.Base size="xs" text={justify} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Cluster.Base
                                    showAnatomy={index === 0}
                                    gap={2}
                                    justify={justify}
                                    items={tagItems(TAGS.slice(0, 3))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
