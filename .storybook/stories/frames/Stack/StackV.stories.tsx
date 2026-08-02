import type { Meta, StoryObj } from "@storybook/nextjs"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `StackV` is a single-axis VERTICAL frame. The state it PRODUCES =
 * whatever it decides itself: `gap` (the §10 scale — the reason this frame exists),
 * `align` (the horizontal axis), `divider` (a line between children). `wrap` is NOT here
 * (a column doesn't overflow into rows — that's `StackH`'s state), and `justify` is only
 * readable when the column has extra height, so leave it to `StackH`'s demo — don't
 * repeat another member's state.
 */
const meta: Meta<typeof StackV> = {
    title: "Frames/Stack/StackV",
    component: StackV,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StackV>

/** The frame carries no content — the fixture is a real card so the seam between two children is visible. */
/** Props for the `Panel` fixture helper. */
interface PanelProps {
    /** label text shown inside the panel */
    text: string
}

const Panel = ({ text }: PanelProps) => (
    <SurfaceCard body={() => <Typography size="sm" text={text} />} />
)

const threePanels = (
    <>
        <Panel text="Overview" />
        <Panel text="Roadmap" />
        <Panel text="Exercises" />
    </>
)

const twoPanels = (
    <>
        <Panel text="One" />
        <Panel text="Two" />
    </>
)

const continueAndSaveButtons = (
    <>
        <Button label="Continue learning" variant="secondary" size="sm" />
        <Button label="Save" variant="secondary" size="sm" />
    </>
)

// No `Flex` node here: the track's own root does not self-badge with the
// internal box's name — `Flex` has no story of its own (it's not a public frame, see its
// own file), so a node pointing there would never be clickable. `StackV`'s identity is already
// the panel header; the only REAL nested part this frame ever composes is the divider below.
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "Divider",
        tier: "atom",
        role: "a Divider inserted between two children, so N children produce N minus 1 lines",
        storyId: "atoms-display-divider-divider--default",
    },
]

/** Default — a column with a `gap={4}` seam: the default rhythm between blocks inside a card. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackV"
                tier="frame"
                leaf="Default"
                reason="A single-axis VERTICAL frame: it only decides direction, seam, and alignment, carrying no content or function of its own (§13). It's a WRAPPING frame so it takes `children` (a single axis has EXACTLY ONE slot, so there's no header/body/footer set to name)."
                states={[
                    {
                        name: "rows inside one surface",
                        why: "Three panels stack as rows of one card, step `4` on the seam scale — between groups inside one surface — which most stacked content reaches for. This is the shape every gap state below either narrows down from or opens up from.",
                        code: `<StackV gap={4} body={<>
  <Panel text="Overview" />
  <Panel text="Roadmap" />
  <Panel text="Exercises" />
</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full">
                                <StackV gap={4} body={threePanels} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` is a STEP on an eight-rung scale
 * (`AllowedGap`), never a raw measurement. The number is the whole vocabulary a reader
 * has, so every state below is titled by its step and shows the sentence that earns it,
 * straight from `gap.md`.
 */
export const Gaps: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackV"
                tier="frame"
                leaf="Gaps"
                reason="`gap` is a required `AllowedGap` step, with no default, so a seam can't be picked wrong by accident (§10a: every seam has exactly one owner, chosen on purpose). A number buys unambiguity — nobody argues over whether two things are `related` or `grouped` — and the sentence each step carries is what keeps a wrong step checkable against something other than taste."
                states={[
                    {
                        name: "1 — must touch",
                        why: "The two panels touch with no seam at all: one is not beside the other, it is part of it. Reach for step `1` only when a seam would be a lie about the content, as in a table body or a stack of rows sharing one border.",
                        code: "<StackV gap={1} body={<>…</>} />",
                        render: (
                            <StackV gap={1} body={twoPanels} />
                        ),
                    },
                    {
                        name: "2 — a joint, not a seam",
                        why: "The seam is just wide enough to keep the two apart while the pair still reads as one thing, the same relationship an icon has with the word it belongs to. If either child could be read on its own, step `2` is too close.",
                        code: "<StackV gap={2} body={<>…</>} />",
                        render: (
                            <StackV gap={2} body={twoPanels} />
                        ),
                    },
                    {
                        name: "3 — the house default",
                        why: "The two panels read as members of the same set, each one whole but none of them standing alone — the seam a title over its subtitle, or the rows of one list, reach for first.",
                        code: "<StackV gap={3} body={<>…</>} />",
                        render: (
                            <StackV gap={3} body={twoPanels} />
                        ),
                    },
                    {
                        name: "4 — between groups inside one surface",
                        why: "The two panels are separate rows that happen to live in the same card, the most common relationship in the whole system and the step `Default` above uses. Order matters here: if swapping the two children would confuse a reader they are peers, and peers belong at step `3` instead.",
                        code: "<StackV gap={4} body={<>…</>} />",
                        render: (
                            <StackV gap={4} body={twoPanels} />
                        ),
                    },
                    {
                        name: "5 — open, no sentence yet",
                        why: "`gap.md` is explicit that this rung has no sentence: 56 call sites in the app chose it, which is enough to earn the step, but nobody has read those 56 yet to say what relationship it claims. Shown here so the gap in the vocabulary stays visible instead of getting papered over with an invented rule.",
                        code: "<StackV gap={5} body={<>…</>} />",
                        render: (
                            <StackV gap={5} body={twoPanels} />
                        ),
                    },
                    {
                        name: "6 — between sections of a page",
                        why: "The seam is wide enough that each panel reads as its own region with its own heading, no longer rows of a shared surface. Use it between the parts of a screen a reader would name separately — one card and the next, a filter bar and the results under it.",
                        code: "<StackV gap={6} body={<>…</>} />",
                        render: (
                            <StackV gap={6} body={twoPanels} />
                        ),
                    },
                    {
                        name: "7 — page bands",
                        why: "A hero and the content beneath it, or the last section and the footer — wider than step `6` because the two things share only the page, not a heading. This step replaces the old `page` word: the old word rendered `gap-8` (8 real uses in the app), while `gap-10` — this step — has 55, so the renumbering moved the name to the class that actually earned it.",
                        code: "<StackV gap={7} body={<>…</>} />",
                        render: (
                            <StackV gap={7} body={twoPanels} />
                        ),
                    },
                    {
                        name: "8 — marketing air",
                        why: "The widest rung, for full-width bands on a page that is selling rather than teaching — `Landing`, `Footer`, `TalentMarketplace`. Two panels in a card are a poor fixture for it; it is shown here only to bound the ladder, not as a realistic choice for content stacked inside a surface.",
                        code: "<StackV gap={8} body={<>…</>} />",
                        render: (
                            <StackV gap={8} body={twoPanels} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * WithDivider — `divider` inserts `Divider` (an ATOM) BETWEEN children: N children →
 * N−1 lines, none at the start/end. The frame does NOT draw the line itself (§13c: overlaps
 * an atom ⇒ use the atom).
 */
export const WithDivider: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackV"
                tier="frame"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                reason="The horizontal line, cutting across the vertical axis, is drawn by `Divider`; the frame only inserts it in between. `gap` still applies to both children and the line, so both sides of the line always balance."
                states={[
                    {
                        name: "divider = true, 3 children",
                        why: "Two lines grow between the three children, one before the second and one before the third, with none at the very start or end. Three text rows read as one bounded group when the seams between them are visibly marked, instead of only implied by whitespace.",
                        code: `<StackV gap={4} divider body={<>
  <Typography size="sm" text="12 lessons completed" />
  <Typography size="sm" text="5-day streak" />
  <Typography size="sm" text="Ranked 34/120" />
</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <StackV gap={4} divider body={<>
                                    <Typography size="sm" text="12 lessons completed" />
                                    <Typography size="sm" text="5-day streak" />
                                    <Typography size="sm" text="Ranked 34/120" />
                                </>} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Nested — `border-l` + a matching indent, for a track that is ONE LEVEL DEEPER than
 * its caller (a threaded reply, a nested tree row). Same vocabulary as `SurfaceCard`'s
 * `variant="nested"`.
 */
export const Nested: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackV"
                tier="frame"
                leaf="Nested"
                reason={"The border marks \"this track is inside a parent\" the same way `SurfaceCard`'s `variant=\"nested\"` does for a card face — a caller never writes `border-l`/`pl-*` itself."}
                states={[
                    {
                        name: "nested = true",
                        why: "A reply one level deeper than its parent comment gets a left guide + indent, so the thread's depth reads at a glance without the caller touching a single className.",
                        code: `<StackV gap={4} nested body={<Typography size="sm" text="That's right, a missing COPY --from is the most common cause." />} />`,
                        render: (
                            <StackV gap={4} nested body={<Typography size="sm" text="That's right, a missing COPY --from is the most common cause." />} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Align — on the VERTICAL axis, `align` aligns along the HORIZONTAL direction. `stretch`
 * (default) stretches children to full width; `start`/`center`/`end` let children keep
 * their natural width.
 */
export const Align: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackV"
                tier="frame"
                leaf="Align"
                reason="The fixture is a button with its own natural width, so the difference reads clearly: `stretch` overrides that natural width, the other three values keep it."
                states={[
                    {
                        name: "align = stretch (default)",
                        why: "Both buttons grow to the full width of the dashed frame around them. This is the alignment a column gets without passing `align` at all.",
                        code: `<StackV gap={3} align="stretch" body={<>…</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <StackV gap={3} align="stretch" body={continueAndSaveButtons} />
                            </div>
                        ),
                    },
                    {
                        name: "align = start",
                        why: "Both buttons keep their natural width and sit flush against the left edge of the frame. Neither button stretches to fill the column.",
                        code: `<StackV gap={3} align="start" body={<>…</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <StackV gap={3} align="start" body={continueAndSaveButtons} />
                            </div>
                        ),
                    },
                    {
                        name: "align = center",
                        why: "Both buttons keep their natural width and sit centered inside the frame. Neither button stretches, but both share the same horizontal midpoint.",
                        code: `<StackV gap={3} align="center" body={<>…</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <StackV gap={3} align="center" body={continueAndSaveButtons} />
                            </div>
                        ),
                    },
                    {
                        name: "align = end",
                        why: "Both buttons keep their natural width and sit flush against the right edge of the frame. Neither button stretches to fill the column.",
                        code: `<StackV gap={3} align="end" body={<>…</>} />`,
                        render: (
                            <div data-tier="fixture" className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <StackV gap={3} align="end" body={continueAndSaveButtons} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
