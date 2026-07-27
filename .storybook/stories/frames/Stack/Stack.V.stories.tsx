import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Stack.V` is a single-axis VERTICAL frame. The state it PRODUCES =
 * whatever it decides itself: `gap` (the §10 scale — the reason this frame exists),
 * `align` (the horizontal axis), `divider` (a line between children). `wrap` is NOT here
 * (a column doesn't overflow into rows — that's `Stack.H`'s state), and `justify` is only
 * readable when the column has extra height, so leave it to `Stack.H`'s demo — don't
 * repeat another member's state.
 */
const meta: Meta<typeof Stack.V> = {
    title: "Frames/Stack/Stack.V",
    component: Stack.V,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.V>

/** The frame carries no content — the fixture is a real card so the seam between two children is visible. */
/** Props for the `Panel` fixture helper. */
interface PanelProps {
    /** label text shown inside the panel */
    text: string
}

const Panel = ({ text }: PanelProps) => (
    <SurfaceCard.Base>
        <Typography.Base size="sm" text={text} />
    </SurfaceCard.Base>
)

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the vertical flex axis, owning gap (§10), align, and justify" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the vertical flex axis, owning gap (§10)" },
    { name: "Line", tier: "atom", role: "a Divider.Base inserted between two children, so N children produce N minus 1 lines" },
]

/** Default — a column with a `grouped(3)` seam: the default rhythm between blocks inside a card. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="A single-axis VERTICAL frame: it only decides direction, seam, and alignment, carrying no content or function of its own (§13). It's a WRAPPING frame so it takes `children` (a single axis has EXACTLY ONE slot, so there's no header/body/footer set to name)."
                states={[
                    {
                        name: "rows inside one surface",
                        why: "Three panels stack as rows of one card, the grouped relationship most stacked content has. This is the shape every gap state below either narrows down from or opens up from.",
                        code: `<Stack.V gap="grouped">
  <Panel text="Tổng quan" />
  <Panel text="Lộ trình" />
  <Panel text="Bài tập" />
</Stack.V>`,
                        render: (
                            <div className="w-96 max-w-full">
                                <Stack.V gap="grouped" showAnatomy>
                                    <Panel text="Tổng quan" />
                                    <Panel text="Lộ trình" />
                                    <Panel text="Bài tập" />
                                </Stack.V>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` names a RELATIONSHIP, never a number. The six
 * words are the whole vocabulary (§10c), and a number like `gap={4}` is a COMPILE ERROR rather
 * than a review comment. Each state below is titled by the relationship that earns the step,
 * because a caller picking a seam is answering what these two things are to each other.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Gaps"
                parts={TRACK_PARTS}
                reason="`gap` is a required `SeamScale` word, with no default, so a seam can't be picked wrong by accident (§10a: every seam has exactly one owner, chosen on purpose). Naming the relationship instead of the number is what makes a wrong seam READABLE in review: a page seam between a label and its value is visibly the wrong claim, while `gap={8}` is just a number someone typed."
                states={[
                    {
                        name: "one continuous thing",
                        why: "The two panels touch with no seam at all, so they read as a single surface rather than two children. Reach for flush only when a seam would be a lie about the content, as in a table body or a stack of rows sharing one border.",
                        code: "<Stack.V gap=\"flush\">…</Stack.V>   // flush",
                        render: (
                            <Stack.V gap="flush" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "a mark and its label",
                        why: "The seam is just wide enough to keep the two apart while the pair still reads as one thing, the relationship a badge has with the text it sits against. If either child could be read on its own, tight is too close.",
                        code: "<Stack.V gap=\"tight\">…</Stack.V>",
                        render: (
                            <Stack.V gap="tight" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "peers in one set",
                        why: "The two panels read as members of the same set, each one whole but none of them standing alone. This is the step for a title with its supporting line, where the two are siblings rather than one unit.",
                        code: "<Stack.V gap=\"related\">…</Stack.V>",
                        render: (
                            <Stack.V gap="related" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "rows inside one surface",
                        why: "The two panels are separate rows that happen to live in the same card, the most common relationship in the whole system and the step `Default` above uses. Order matters here: if swapping the two children would confuse a reader they are peers, and peers belong at related instead.",
                        code: "<Stack.V gap=\"grouped\">…</Stack.V>",
                        render: (
                            <Stack.V gap="grouped" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "regions of one page",
                        why: "The seam is wide enough that each panel reads as its own region with its own heading, no longer rows of a shared surface. Use it between the parts of a screen a reader would name separately.",
                        code: "<Stack.V gap=\"section\">…</Stack.V>   // section",
                        render: (
                            <Stack.V gap="section" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "features standing apart",
                        why: "The widest step, for two things that merely share a page and have no relationship beyond that. If a reader can explain how the two connect, the honest step is narrower than page.",
                        code: "<Stack.V gap=\"page\">…</Stack.V>",
                        render: (
                            <Stack.V gap="page" showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * WithDivider — `divider` inserts `Divider.Base` (an ATOM) BETWEEN children: N children →
 * N−1 lines, none at the start/end. The frame does NOT draw the line itself (§13c: overlaps
 * an atom ⇒ use the atom).
 */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                reason="The horizontal line, cutting across the vertical axis, is drawn by `Divider.Base`; the frame only inserts it in between. `gap` still applies to both children and the line, so both sides of the line always balance."
                states={[
                    {
                        name: "divider = true, 3 children",
                        why: "Two lines grow between the three children, one before the second and one before the third, with none at the very start or end. Three text rows read as one bounded group when the seams between them are visibly marked, instead of only implied by whitespace.",
                        code: `<Stack.V gap="grouped" divider>
  <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
  <Typography.Base size="sm" text="Chuỗi 5 ngày" />
  <Typography.Base size="sm" text="Xếp hạng 34/120" />
</Stack.V>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Stack.V gap="grouped" divider showAnatomy>
                                    <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
                                    <Typography.Base size="sm" text="Chuỗi 5 ngày" />
                                    <Typography.Base size="sm" text="Xếp hạng 34/120" />
                                </Stack.V>
                            </div>
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
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Align"
                parts={TRACK_PARTS}
                reason="The fixture is a button with its own natural width, so the difference reads clearly: `stretch` overrides that natural width, the other three values keep it."
                states={[
                    {
                        name: "align = stretch (default)",
                        why: "Both buttons grow to the full width of the dashed frame around them. This is the alignment a column gets without passing `align` at all.",
                        code: `<Stack.V gap="related" align="stretch">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap="related" align="stretch" showAnatomy>
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = start",
                        why: "Both buttons keep their natural width and sit flush against the left edge of the frame. Neither button stretches to fill the column.",
                        code: `<Stack.V gap="related" align="start">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap="related" align="start">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = center",
                        why: "Both buttons keep their natural width and sit centered inside the frame. Neither button stretches, but both share the same horizontal midpoint.",
                        code: `<Stack.V gap="related" align="center">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap="related" align="center">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = end",
                        why: "Both buttons keep their natural width and sit flush against the right edge of the frame. Neither button stretches to fill the column.",
                        code: `<Stack.V gap="related" align="end">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap="related" align="end">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
