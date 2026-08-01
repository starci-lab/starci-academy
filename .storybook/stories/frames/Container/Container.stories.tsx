import type { Meta, StoryObj } from "@storybook/nextjs"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT (frame) — `Container`: the CONTENT COLUMN (centered + width cap + padding).
 *
 * ⭐ The most notable leaf is `ContainerQuery`: this frame OPENS `@container`, so a
 * grid inside it measures the COLUMN WIDTH instead of the app's column anymore. Two
 * columns with a different `size` wrapping the SAME `Grid` with the same `columns`
 * end up with a DIFFERENT column count — that's exactly why the teacher decided to
 * open the container (2026-07-26).
 *
 * Leaves at the frame tier split by the frame's STRUCTURE/prop axis (§14d.2), not by
 * the atom tier's 1-prop-1-leaf rule (§12g).
 *
 * MIGRATED TO `states` (2026-07-27): leaves that used to stack several renders by
 * hand in one `children` block (`Sizes`, `Padding`, `ContainerQuery`) now carry one
 * `states[]` entry per rendered value, each with its own `why` and `code`.
 */

/** Props for the demo tile. */
interface TileProps {
    /** Text shown inside the tile. */
    label: string
}

/** A sample tile — just to see the column edge and count, carries no domain content (§13). */
const Tile = ({ label }: TileProps) => (
    <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-3 text-sm text-foreground">{label}</div>
)

/** Props for the demo bleed band. */
interface BleedProps {
    /** Content centered inside the bleed band. */
    children: React.ReactNode
}

/** A ruled background band, to see the column centered inside a wider parent area. */
const Bleed = ({ children }: BleedProps) => (
    <div data-tier="fixture" className="w-full bg-default/40 py-4">{children}</div>
)

const meta: Meta<typeof Container> = {
    title: "Frames/Container/Container",
    component: Container,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Container>

/** Bare leaf — default `md` column, padding `6`, `body` only. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Container"
                tier="frame"
                leaf="Default"
                reason="A content column is a real concept, so it gets a frame with a name. Before this, every page hand-wrote the same `mx-auto w-full max-w-3xl` string — 72 of them across the app."
                states={[
                    {
                        name: "size = \"md\" (default), padding = 6 (default)",
                        why: "The tile centers inside a 48rem column with `p-6` padding — the grey band around it is the parent, not part of the frame itself. This is the column width every page gets for free without hand-writing `mx-auto w-full max-w-3xl` again.",
                        code: "<Container body={<Tile label=\"Body\" />} />",
                        render: (
                            <Bleed>
                                <Container body={<Tile label="Body — max-w-app-md, centred" />} />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — FULL 5 steps, each pointing straight at a `--container-app-*` token. Migrated to `states` 2026-07-27. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Container"
                tier="frame"
                leaf="Prop `size`"
                reason="Each step points at the same `--container-app-*` token that drives the `@app-*` breakpoints, so the column width and the breakpoint scale can never drift apart. Picking `md` means 'exactly one app-md wide', not 'about 48rem' — and inside a `md` column the `@app-lg` step can never fire, so asking a grid for 4 columns there is asking for a step that never arrives."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The column caps at 40rem, the narrowest of the five steps. This is the tightest reading column, for content that reads worse wide, like a single-column form.",
                        code: "<Container size=\"sm\" body={<Tile label='size=\"sm\" · 40rem' />} />",
                        render: (
                            <Bleed>
                                <Container size="sm" padding={4} body={<Tile label='size="sm" · 40rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "The column caps at 48rem, one step wider than `sm`. This is the default column used across most pages when no narrower or wider reading width is called for.",
                        code: "<Container size=\"md\" body={<Tile label='size=\"md\" · 48rem — default' />} />",
                        render: (
                            <Bleed>
                                <Container size="md" padding={4} body={<Tile label='size="md" · 48rem — default' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The column caps at 64rem. A page that needs to hold a wider table or a two-column layout inside the column reaches for this step instead of `md`.",
                        code: "<Container size=\"lg\" body={<Tile label='size=\"lg\" · 64rem' />} />",
                        render: (
                            <Bleed>
                                <Container size="lg" padding={4} body={<Tile label='size="lg" · 64rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"xl\"",
                        why: "The column caps at 80rem, the widest bounded step. A dashboard or a data-dense screen that genuinely needs the extra room reaches this step.",
                        code: "<Container size=\"xl\" body={<Tile label='size=\"xl\" · 80rem' />} />",
                        render: (
                            <Bleed>
                                <Container size="xl" padding={4} body={<Tile label='size="xl" · 80rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"full\"",
                        why: "No cap applies at all — the column stretches to fill its parent completely. This step is for a region that must bleed to the edge of whatever holds it, like a full-width hero band.",
                        code: "<Container size=\"full\" body={<Tile label='size=\"full\" · no cap' />} />",
                        render: (
                            <Bleed>
                                <Container size="full" padding={4} body={<Tile label='size="full" · no cap' />} />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `padding` — the `AllowedPadding` scale, default step `6` (the web column).
 * 2026-08-01 (wave-3 numeric-scale migration): the old five-word union (`flush`…`airy`) is
 * gone with no deprecated stage, replaced by SIX numbered steps — one more than before,
 * because the count behind `padding.md` found real evidence for `p-2` (step `3`) that an
 * earlier, narrower count had missed. The old `airy` (`p-8`) did NOT earn a step; every call
 * site written as `padding="airy"` folds down to step `6` (`p-6`) in this change, a real
 * (not cosmetic) size difference — see the step-`6` state below for the finding.
 */
export const Padding: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Container"
                tier="frame"
                leaf="Prop `padding`"
                states={[
                    {
                        name: "padding = 1",
                        why: "The tile sits flush against the column's own edge, with no inset at all. Reach for step `1` when a child already owns the edge itself, like a full-bleed cover image or a table that scrolls sideways.",
                        code: "<Container padding={1} body={<Tile label=\"padding step 1\" />} />",
                        render: (
                            <Bleed>
                                <Container padding={1} body={<Tile label="padding step 1" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 2",
                        why: "The tightest inset that still reads as chrome at all — an icon button's halo, a dot's hit area. A page measure never needs this step; it is shown so the tight end of the ladder stays recognisable.",
                        code: "<Container padding={2} body={<Tile label=\"padding step 2\" />} />",
                        render: (
                            <Bleed>
                                <Container padding={2} body={<Tile label="padding step 2" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 3",
                        why: "Compact chrome: a chip, a collapsed sidebar row, a dense list row. This step earned its place late — an earlier count that only read the `padding` prop and not the `p-2` class missed the 34 real call sites already sitting here.",
                        code: "<Container padding={3} body={<Tile label=\"padding step 3\" />} />",
                        render: (
                            <Bleed>
                                <Container padding={3} body={<Tile label="padding step 3" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 4",
                        why: "The interior of a card — the house rule. This step suits a card-like region that still wants some breathing room without the full page gutter.",
                        code: "<Container padding={4} body={<Tile label=\"padding step 4\" />} />",
                        render: (
                            <Bleed>
                                <Container padding={4} body={<Tile label="padding step 4" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 5",
                        why: "A card that carries a heading and a body, or a surface a form sits inside — one step roomier than the plain card interior.",
                        code: "<Container padding={5} body={<Tile label=\"padding step 5\" />} />",
                        render: (
                            <Bleed>
                                <Container padding={5} body={<Tile label="padding step 5" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 6 (default)",
                        why: "A page measure or a container — the outermost surface before the viewport, and the widest inset the scale offers. This is what every page gets automatically without passing the prop at all, and it is also where the old `airy` (`p-8`) call sites now land: `p-8` never earned its own step, so every one of them folds down to this rung, a real (not cosmetic) size change worth flagging rather than silently absorbing.",
                        code: "<Container body={<Tile label=\"padding step 6 — default\" />} />",
                        render: (
                            <Bleed>
                                <Container body={<Tile label="padding step 6 — default" />} />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf composition — a measure holds ONE region; rhythm comes from a `StackV` nested
 * inside it. Rewritten 2026-07-27 when `header`/`footer`/`gap` were removed.
 */
export const PageRegions: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Container"
                tier="frame"
                leaf="Page regions via `StackV`"
                states={[
                    {
                        name: "header, body and footer as one nested stack",
                        why: "The measure renders its single region raw and adds no node of its own, so the nested stack is what decides the seam between the three tiles. Keeping the rhythm in one place is what stops a page from having two owners for the same gap, which is exactly how the old `gap` prop came to be written in code and measured as 0px on screen.",
                        code: `<Container
  body={
    <StackV gap={7} body={<>
      <PageHeader title="Courses" />
      <CourseList />
      <Pagination />
    </>} />
  }
/>`,
                        render: (
                            <Bleed>
                                <Container
                                    body={
                                        <StackV gap={7} body={<>
                                            <Tile label="Header" />
                                            <Tile label="Body" />
                                            <Tile label="Footer" />
                                        </>} />
                                    }
                                />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Part `Grid` has its own story ⇒ `storyId` is declared so it's clickable. */
const QUERY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Grid": {
        tier: "frame",
        role: "Same grid, same columns prop — it just measures the column it lands in.",
        storyId: "frames-grid-grid--default",
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
 *
 * Migrated to `states` 2026-07-27: each column width is its own state so the reader
 * can flip between "2 columns" and "4 columns" and read the matching `why` for each.
 */
export const ContainerQuery: Story = {
    render: () => {
        const cells = ["Alpha", "Beta", "Gamma", "Delta"].map((label) => ({
            key: label,
            content: <Tile label={label} />,
        }))
        const columns = { base: 1, sm: 2, md: 2, lg: 4 } as const
        return (
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="Container"
                    tier="frame"
                    leaf="Opening `@container`"
                    annotate={QUERY_ANNOTATE}
                    reason="The `@app-*` breakpoints are container queries — they measure the nearest container. This frame opens one, so a grid inside answers to the column it actually sits in instead of to the whole app shell."
                    states={[
                        {
                            name: "size = \"md\" (48rem column)",
                            why: "The grid inside settles at 2 columns because the column only reaches the `@app-md` step — `@app-lg` never fires inside 48rem. Asking this same grid for `lg: 4` here is asking for a breakpoint that never arrives, not a bug — the page is just too narrow for four.",
                            code: `const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container size="md" body={<Grid columns={columns} gap={4} items={cells} />} />`,
                            render: (
                                <Bleed>
                                    <Container
                                        size="md"
                                        padding={4}
                                        body={
                                            <span data-tier="fixture" className="block">
                                                <Grid columns={columns} gap={4} items={cells} />
                                            </span>
                                        }
                                    />
                                </Bleed>
                            ),
                        },
                        {
                            name: "size = \"xl\" (80rem column)",
                            why: "The identical grid with the identical `columns` prop settles at 4 columns instead, because this wider column reaches the `@app-lg` step. Same grid, same props — the only thing that changed is which container it's measuring against.",
                            code: `const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container size="xl" body={<Grid columns={columns} gap={4} items={cells} />} />`,
                            render: (
                                <Bleed>
                                    <Container
                                        size="xl"
                                        padding={4}
                                        body={
                                            <span data-tier="fixture" className="block">
                                                <Grid columns={columns} gap={4} items={cells} />
                                            </span>
                                        }
                                    />
                                </Bleed>
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}
