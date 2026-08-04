import type { Meta, StoryObj } from "@storybook/nextjs"
import { ScrollArea } from "@sb-components/frames/ScrollArea/ScrollArea"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ScrollArea` — a region that SCROLLS its own overflow, on either axis, instead
 * of growing past its box.
 */

/** Props for the demo tall-content fixture (for `axis="y"`/`axis="both"`). */
interface RowsProps {
    /** Number of placeholder rows to render — enough to outgrow a short box. */
    count: number
}

/** A tall stack of rows — outgrows a short box, so a `y` scroll actually scrolls. */
const Rows = ({ count }: RowsProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2 p-3">
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className="h-10 shrink-0 rounded-xl border border-default bg-surface text-sm text-foreground flex items-center px-3">{`row ${index + 1}`}</div>
        ))}
    </div>
)

/** Props for the demo wide-content fixture (for `axis="x"`/`axis="both"`). */
interface ColumnsProps {
    /** Number of placeholder columns to render — enough to outgrow a narrow box. */
    count: number
}

/** A wide row of tiles — outgrows a narrow box, so an `x` scroll actually scrolls. */
const Columns = ({ count }: ColumnsProps) => (
    <div data-tier="fixture" className="flex w-max flex-row gap-2 p-3">
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className="h-24 w-32 shrink-0 rounded-xl border border-default bg-surface text-sm text-foreground flex items-center justify-center">{`col ${index + 1}`}</div>
        ))}
    </div>
)

/** A wide-and-tall grid — outgrows the box on both axes at once. */
const Grid = ({ count }: ColumnsProps) => (
    <div data-tier="fixture" className="grid w-max grid-flow-col grid-rows-4 gap-2 p-3">
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className="h-16 w-28 shrink-0 rounded-xl border border-default bg-surface text-sm text-foreground flex items-center justify-center">{`cell ${index + 1}`}</div>
        ))}
    </div>
)

const meta: Meta<typeof ScrollArea> = {
    title: "Frames/ScrollArea/ScrollArea",
    component: ScrollArea,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ScrollArea>

/** LEAF prop `axis` — all three members, each with content long enough on the relevant axis to actually scroll. */
export const Axis: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ScrollArea"
                tier="frame"
                leaf="Prop `axis`"
                parts={[]}
                reason="Real `src` (`MindMapPage/index.tsx`, ~line 296) hand-rolled `overflow-y-auto` around the search rail's own content, self-flagging the gap in place: no frame carried a scrollable-region flag yet. `axis` defaults to `'y'` — the dominant shape anywhere content outgrows its box — with `'x'`/`'both'` offered up front since `overflow-*` only has those three members for `scroll, don't clip`."
                states={[
                    {
                        name: "axis = 'y' (default)",
                        why: "The box caps its height and scrolls vertically once its rows outgrow it — the exact shape `MindMapPage`'s search rail hand-wrote as raw `overflow-y-auto` markup before this frame existed.",
                        code: `<ScrollArea body={<SearchResultsList />} />`,
                        render: (
                            <div data-tier="fixture" className="overflow-hidden rounded-3xl border border-dashed border-default" style={{ height: 200, width: 280 }}>
                                <ScrollArea body={() => <Rows count={20} />} />
                            </div>
                        ),
                    },
                    {
                        name: "axis = 'x'",
                        why: "The box caps its width and scrolls horizontally once its columns outgrow it — a filmstrip or a wide toolbar that should scroll sideways instead of wrapping or clipping.",
                        code: `<ScrollArea axis="x" body={<Filmstrip />} />`,
                        render: (
                            <div data-tier="fixture" className="overflow-hidden rounded-3xl border border-dashed border-default" style={{ height: 140, width: 280 }}>
                                <ScrollArea axis="x" body={() => <Columns count={12} />} />
                            </div>
                        ),
                    },
                    {
                        name: "axis = 'both'",
                        why: "The box caps both dimensions and scrolls on whichever axis the content overflows, or both at once — a dense grid or canvas-like region that outgrows its box in every direction.",
                        code: `<ScrollArea axis="both" body={<DenseGrid />} />`,
                        render: (
                            <div data-tier="fixture" className="overflow-hidden rounded-3xl border border-dashed border-default" style={{ height: 200, width: 280 }}>
                                <ScrollArea axis="both" body={() => <Grid count={12} />} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
