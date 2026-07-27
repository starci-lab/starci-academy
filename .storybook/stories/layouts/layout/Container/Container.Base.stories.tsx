import type { Meta, StoryObj } from "@storybook/nextjs"
import { Container, type ContainerSize } from "@sb-components/layouts/layout/Container/Container"
import { Grid } from "@sb-components/layouts/layout/Grid/Grid"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT (frame) — `Container.Base`: the CONTENT COLUMN (centered + width cap + padding).
 *
 * ⭐ The most notable leaf is `ContainerQuery`: this frame OPENS `@container`, so a
 * grid inside it measures the COLUMN WIDTH instead of the app's column anymore. Two
 * columns with a different `size` wrapping the SAME `Grid` with the same `columns`
 * end up with a DIFFERENT column count — that's exactly why the teacher decided to
 * open the container (2026-07-26).
 *
 * Leaves at the frame tier split by the frame's STRUCTURE/prop axis (§14d.2), not by
 * the atom tier's 1-prop-1-leaf rule (§12g).
 */

/** Props for the demo tile. */
interface TileProps {
    /** Text shown inside the tile. */
    label: string
}

/** A sample tile — just to see the column edge and count, carries no domain content (§13). */
const Tile = ({ label }: TileProps) => (
    <div className="rounded-xl border border-default bg-surface p-3 text-sm text-foreground">{label}</div>
)

/** Props for the demo bleed band. */
interface BleedProps {
    /** Content centered inside the bleed band. */
    children: React.ReactNode
}

/** A ruled background band, to see the column centered inside a wider parent area. */
const Bleed = ({ children }: BleedProps) => (
    <div className="w-full bg-default/40 py-4">{children}</div>
)

const meta: Meta<typeof Container.Base> = {
    title: "Layouts/Layout/Container/Container.Base",
    component: Container.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Container.Base>

/** One row of the size demo grid. */
interface SizeRow {
    /** The `ContainerSize` value this row demonstrates. */
    size: ContainerSize
    /** The token width this size resolves to. */
    width: string
}

/** FULL `ContainerSize` union, with the token width alongside for comparing against the `@app-*` steps. */
const SIZES: Array<SizeRow> = [
    { size: "sm", width: "40rem" },
    { size: "md", width: "48rem — default" },
    { size: "lg", width: "64rem" },
    { size: "xl", width: "80rem" },
    { size: "full", width: "no cap" },
]

/** Bare leaf — default `md` column, padding `6`, `body` only. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Default"
                reason="A content column is a real concept, so it gets a frame with a name. Before this, every page hand-wrote the same `mx-auto w-full max-w-3xl` string — 72 of them across the app."
                note="Defaults to the 48rem column with p-6 padding, centred in whatever it sits in. The grey band is the parent, not part of the frame."
                code={"<Container.Base body={<Tile label=\"Body\" />} />"}
            >
                <Bleed>
                    <Container.Base showAnatomy body={<Tile label="Body — max-w-app-md, centred" />} />
                </Bleed>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — FULL 5 steps, each pointing straight at a `--container-app-*` token. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Prop `size`"
                reason="Each step points at the same `--container-app-*` token that drives the `@app-*` breakpoints, so the column width and the breakpoint scale can never drift apart. Picking `md` means 'exactly one app-md wide', not 'about 48rem'."
                note="Read it the other way round too: inside a `md` column the `@app-lg` step can never fire, so asking a grid for 4 columns there is asking for a step that never arrives."
                code={`<Container.Base size="sm" … />   // 40rem
<Container.Base size="md" … />   // 48rem — default
<Container.Base size="lg" … />   // 64rem
<Container.Base size="xl" … />   // 80rem
<Container.Base size="full" … /> // no cap`}
            >
                <div className="flex flex-col gap-3">
                    {SIZES.map(({ size, width }, index) => (
                        <Bleed key={size}>
                            <Container.Base
                                size={size}
                                padding={3}
                                showAnatomy={index === 0}
                                body={<Tile label={`size="${size}" · ${width}`} />}
                            />
                        </Bleed>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `padding` — the §10c scale, default `6` (the web column). */
export const Padding: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Prop `padding`"
                note="Padding sits inside the width cap, so the readable line shortens as it grows. Drop to 0 when a child owns the edge — a full-bleed cover image or a table that scrolls sideways."
                code={`<Container.Base padding={0} … />
<Container.Base padding={3} … />
<Container.Base … />            // 6 = default
<Container.Base padding={8} … />`}
            >
                <div className="flex flex-col gap-3">
                    {([0, 3, 6, 8] as const).map((padding, index) => (
                        <Bleed key={padding}>
                            <Container.Base
                                padding={padding}
                                showAnatomy={index === 0}
                                body={<Tile label={`padding={${padding}}`} />}
                            />
                        </Bleed>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf slot — three regions `header`/`body`/`footer`, spaced by the PAGE rhythm. */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Slots `header` / `body` / `footer`"
                note="With neither header nor footer the body renders raw — a children-only call produces no extra wrapper at all. The gap between regions defaults to the page rhythm (8), deliberately wider than the rhythm inside a card."
                code={`<Container.Base
  header={<Page.Header title="Courses" />}
  body={<CourseList />}
  footer={<Pagination />}
/>`}
            >
                <Bleed>
                    <Container.Base
                        showAnatomy
                        header={<Tile label="Header" />}
                        body={<Tile label="Body" />}
                        footer={<Tile label="Footer" />}
                    />
                </Bleed>
            </BlockAnatomy>
        </div>
    ),
}

/** Part `Grid.Base` has its own story ⇒ `storyId` is declared so it's clickable. */
const QUERY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Grid.Base": {
        tier: "primitive",
        role: "Same grid, same columns prop — it just measures the column it lands in.",
        storyId: "layouts-layout-grid-grid-base--default",
    },
}

/**
 * Leaf ⭐ — the evidence for the decision "this frame OPENS `@container`".
 *
 * Two columns, the SAME `Grid` with the SAME `columns`, end up with a different
 * column count: the `md` column sits at the `@app-md` step (2 columns), the `xl`
 * column reaches `@app-lg` (4 columns). Before opening the container, both listened
 * to the app column and would jump to 4 columns together even though the left one
 * is only 48rem wide.
 */
export const ContainerQuery: Story = {
    render: () => {
        const cells = ["Alpha", "Beta", "Gamma", "Delta"].map((label) => ({
            key: label,
            content: <Tile label={label} />,
        }))
        const columns = { base: 1, sm: 2, md: 2, lg: 4 } as const
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Container.Base"
                    tier="primitive"
                    leaf="Opening `@container`"
                    annotate={QUERY_ANNOTATE}
                    reason="The `@app-*` breakpoints are container queries — they measure the nearest container. This frame opens one, so a grid inside answers to the column it actually sits in instead of to the whole app shell."
                    note="Both columns hold the identical grid with identical props. The narrow one stops at 2 because `@app-lg` never fires inside 48rem; the wide one reaches 4. Asking for `lg: 4` inside a md column is asking for a step that never arrives — not a bug, just a page too narrow for four."
                    code={`const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container.Base size="md" body={<Grid.Base columns={columns} gap={3} items={cells} />} />
<Container.Base size="xl" body={<Grid.Base columns={columns} gap={3} items={cells} />} />`}
                >
                    <div className="flex flex-col gap-6">
                        {(["md", "xl"] as const).map((size, index) => (
                            <div key={size} className="flex flex-col gap-2">
                                <p className="text-xs text-muted">{`size="${size}"`}</p>
                                <Bleed>
                                    <Container.Base size={size} padding={3} showAnatomy={index === 0}>
                                        <span className="block" data-anat-part="Grid.Base">
                                            <Grid.Base columns={columns} gap={3} items={cells} />
                                        </span>
                                    </Container.Base>
                                </Bleed>
                            </div>
                        ))}
                    </div>
                </BlockAnatomy>
            </div>
        )
    },
}
