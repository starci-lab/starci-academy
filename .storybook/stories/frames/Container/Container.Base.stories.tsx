import type { Meta, StoryObj } from "@storybook/nextjs"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
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
    title: "Frames/Container/Container.Base",
    component: Container.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Container.Base>

/** Bare leaf — default `md` column, padding `6`, `body` only. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="frame"
                leaf="Default"
                reason="A content column is a real concept, so it gets a frame with a name. Before this, every page hand-wrote the same `mx-auto w-full max-w-3xl` string — 72 of them across the app."
                states={[
                    {
                        name: "size = \"md\" (default), padding = 6 (default)",
                        why: "The tile centers inside a 48rem column with `p-6` padding — the grey band around it is the parent, not part of the frame itself. This is the column width every page gets for free without hand-writing `mx-auto w-full max-w-3xl` again.",
                        code: "<Container.Base body={<Tile label=\"Body\" />} />",
                        render: (
                            <Bleed>
                                <Container.Base showAnatomy body={<Tile label="Body — max-w-app-md, centred" />} />
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
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="frame"
                leaf="Prop `size`"
                reason="Each step points at the same `--container-app-*` token that drives the `@app-*` breakpoints, so the column width and the breakpoint scale can never drift apart. Picking `md` means 'exactly one app-md wide', not 'about 48rem' — and inside a `md` column the `@app-lg` step can never fire, so asking a grid for 4 columns there is asking for a step that never arrives."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The column caps at 40rem, the narrowest of the five steps. This is the tightest reading column, for content that reads worse wide, like a single-column form.",
                        code: "<Container.Base size=\"sm\" body={<Tile label='size=\"sm\" · 40rem' />} />",
                        render: (
                            <Bleed>
                                <Container.Base size="sm" padding={3} showAnatomy body={<Tile label='size="sm" · 40rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "The column caps at 48rem, one step wider than `sm`. This is the default column used across most pages when no narrower or wider reading width is called for.",
                        code: "<Container.Base size=\"md\" body={<Tile label='size=\"md\" · 48rem — default' />} />",
                        render: (
                            <Bleed>
                                <Container.Base size="md" padding={3} body={<Tile label='size="md" · 48rem — default' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The column caps at 64rem. A page that needs to hold a wider table or a two-column layout inside the column reaches for this step instead of `md`.",
                        code: "<Container.Base size=\"lg\" body={<Tile label='size=\"lg\" · 64rem' />} />",
                        render: (
                            <Bleed>
                                <Container.Base size="lg" padding={3} body={<Tile label='size="lg" · 64rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"xl\"",
                        why: "The column caps at 80rem, the widest bounded step. A dashboard or a data-dense screen that genuinely needs the extra room reaches this step.",
                        code: "<Container.Base size=\"xl\" body={<Tile label='size=\"xl\" · 80rem' />} />",
                        render: (
                            <Bleed>
                                <Container.Base size="xl" padding={3} body={<Tile label='size="xl" · 80rem' />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "size = \"full\"",
                        why: "No cap applies at all — the column stretches to fill its parent completely. This step is for a region that must bleed to the edge of whatever holds it, like a full-width hero band.",
                        code: "<Container.Base size=\"full\" body={<Tile label='size=\"full\" · no cap' />} />",
                        render: (
                            <Bleed>
                                <Container.Base size="full" padding={3} body={<Tile label='size="full" · no cap' />} />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `padding` — the §10c scale, default `6` (the web column). Migrated to `states` 2026-07-27. */
export const Padding: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="frame"
                leaf="Prop `padding`"
                states={[
                    {
                        name: "padding = 0",
                        why: "The tile sits flush against the column's own edge, with no inset at all. Drop to 0 when a child already owns the edge itself, like a full-bleed cover image or a table that scrolls sideways.",
                        code: "<Container.Base padding={0} body={<Tile label=\"padding={0}\" />} />",
                        render: (
                            <Bleed>
                                <Container.Base padding={0} showAnatomy body={<Tile label="padding={0}" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 3",
                        why: "A moderate inset separates the tile from the column edge. This step suits a card-like region that still wants some breathing room without the full page gutter.",
                        code: "<Container.Base padding={3} body={<Tile label=\"padding={3}\" />} />",
                        render: (
                            <Bleed>
                                <Container.Base padding={3} body={<Tile label="padding={3}" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 6 (default)",
                        why: "The default page gutter applies, the widest inset most pages ever need. This is what every page gets automatically without passing the prop at all.",
                        code: "<Container.Base body={<Tile label=\"padding={6} — default\" />} />",
                        render: (
                            <Bleed>
                                <Container.Base body={<Tile label="padding={6} — default" />} />
                            </Bleed>
                        ),
                    },
                    {
                        name: "padding = 8",
                        why: "An even wider inset applies, shortening the readable line further inside the same column cap. Content that wants extra breathing room on top of the size cap reaches for this step.",
                        code: "<Container.Base padding={8} body={<Tile label=\"padding={8}\" />} />",
                        render: (
                            <Bleed>
                                <Container.Base padding={8} body={<Tile label="padding={8}" />} />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf slot — three regions `header`/`body`/`footer`, spaced by the PAGE rhythm. Migrated to `states` 2026-07-27. */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="frame"
                leaf="Slots `header` / `body` / `footer`"
                states={[
                    {
                        name: "header, body, footer all set",
                        why: "Three tiles stack with the page rhythm (`gap-8`) between them instead of the tighter gap used inside a card. With neither `header` nor `footer` passed, the body renders raw with no extra wrapper at all, so a `children`-only call produces the exact same DOM as before this slot set existed.",
                        code: `<Container.Base
  header={<Page.Header title="Courses" />}
  body={<CourseList />}
  footer={<Pagination />}
/>`,
                        render: (
                            <Bleed>
                                <Container.Base
                                    showAnatomy
                                    header={<Tile label="Header" />}
                                    body={<Tile label="Body" />}
                                    footer={<Tile label="Footer" />}
                                />
                            </Bleed>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Part `Grid.Base` has its own story ⇒ `storyId` is declared so it's clickable. */
const QUERY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Grid.Base": {
        tier: "frame",
        role: "Same grid, same columns prop — it just measures the column it lands in.",
        storyId: "frames-grid-grid-base--default",
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
            <div className="p-8">
                <BlockAnatomy
                    name="Container.Base"
                    tier="frame"
                    leaf="Opening `@container`"
                    annotate={QUERY_ANNOTATE}
                    reason="The `@app-*` breakpoints are container queries — they measure the nearest container. This frame opens one, so a grid inside answers to the column it actually sits in instead of to the whole app shell."
                    states={[
                        {
                            name: "size = \"md\" (48rem column)",
                            why: "The grid inside settles at 2 columns because the column only reaches the `@app-md` step — `@app-lg` never fires inside 48rem. Asking this same grid for `lg: 4` here is asking for a breakpoint that never arrives, not a bug — the page is just too narrow for four.",
                            code: `const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container.Base size="md" body={<Grid.Base columns={columns} gap="grouped" items={cells} />} />`,
                            render: (
                                <Bleed>
                                    <Container.Base size="md" padding={3} showAnatomy>
                                        <span className="block" data-anat-part="Grid.Base">
                                            <Grid.Base columns={columns} gap="grouped" items={cells} />
                                        </span>
                                    </Container.Base>
                                </Bleed>
                            ),
                        },
                        {
                            name: "size = \"xl\" (80rem column)",
                            why: "The identical grid with the identical `columns` prop settles at 4 columns instead, because this wider column reaches the `@app-lg` step. Same grid, same props — the only thing that changed is which container it's measuring against.",
                            code: `const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container.Base size="xl" body={<Grid.Base columns={columns} gap="grouped" items={cells} />} />`,
                            render: (
                                <Bleed>
                                    <Container.Base size="xl" padding={3}>
                                        <span className="block" data-anat-part="Grid.Base">
                                            <Grid.Base columns={columns} gap="grouped" items={cells} />
                                        </span>
                                    </Container.Base>
                                </Bleed>
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}
