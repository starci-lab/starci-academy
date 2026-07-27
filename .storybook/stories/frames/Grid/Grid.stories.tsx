import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Grid` is a two-dimensional REPEATED-LIST FRAME. The state it
 * produces = `columns` (column count by CONTAINER breakpoint — a distinctive state no
 * other frame has), and `gap` (§10). No `align`/`justify`: a grid cell stretches to
 * fill by default, aligning content inside the cell is the job of the component
 * inside it. An empty list → an empty track, the "nothing here yet" copy belongs to
 * the caller (§13 — a frame carries no content).
 */
const meta: Meta<typeof Grid> = {
    title: "Frames/Grid/Grid",
    component: Grid,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Grid>

/** A frame carries no content — the fixture is a real card so cells and seams are visible. */
const cellItems = (labels: ReadonlyArray<string>) =>
    labels.map((label) => ({
        key: label,
        content: (
            <SurfaceCard>
                <Typography size="sm" text={label} />
            </SurfaceCard>
        ),
    }))

const MODULES = ["Nhập môn", "Container", "Orchestration", "CI/CD", "Quan trắc", "Bảo mật"]

/**
 * `@app-*` measures the NEAREST CONTAINER, not the viewport — to demo a breakpoint
 * you have to open your own `@container` at the right width (exactly what the app
 * shell does). `--container-app-sm = 40rem`, `-md = 48rem`, `-lg = 64rem`.
 */
/** Props for the `Frame` fixture helper. */
interface FrameProps {
    /** CSS width of the demo container */
    width: string
    /** caption printed above the container */
    label: string
    /** grid content rendered inside the container */
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** The six VALID steps of §10 — `gap` is a literal union so there's no seventh step. */
/**
 * The six seam steps, each paired with the RELATIONSHIP that earns it. The state name says
 * the relationship rather than the number, because a reader choosing a gap is answering
 * "what are these two things to each other", not "which number looks right".
 */
const SCALE = [
    { gap: "flush", relation: "one unit of meaning" },
    { gap: "tight", relation: "a mark attached to its label" },
    { gap: "related", relation: "peers in one set" },
    { gap: "grouped", relation: "rows stacked in one surface" },
    { gap: "section", relation: "regions of one thing" },
    { gap: "page", relation: "separate features on a page" },
] as const

/** Default — a card grid: 1 column narrow → 2 columns from `@app-sm` → 3 columns from `@app-md`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid"
                tier="frame"
                leaf="Default"
                reason="A two-dimensional repeated list means `items` is DATA and `children` is FORBIDDEN (§13b), since the grid's premise is that every cell is the same kind of thing. The reflow breakpoint is a CONTAINER QUERY `@app-*`, not `md:`, because the app shell has a left rail that the AI panel can squeeze at any time, so the grid must listen to its own column instead of the viewport."
                states={[
                    {
                        name: "columns = { base: 1, sm: 2, md: 3 }, container = 768px",
                        why: "Six module cards lay out in three columns across two rows inside a 768px container, which is past the `@app-md` breakpoint. The same `columns` prop would collapse to fewer columns in a narrower container, the Columns leaf below shows those steps explicitly.",
                        code: `<Grid
  gap="grouped"
  columns={{ base: 1, sm: 2, md: 3 }}
  items={modules.map((m) => ({ key: m, content: <ModuleCard name={m} /> }))}
/>`,
                        render: (
                            <Frame width="48rem" label="container 768px — @app-md breakpoint → 3 columns">
                                <Grid showAnatomy gap="grouped" columns={{ base: 1, sm: 2, md: 3 }} items={cellItems(MODULES)} />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Span — `GridItem.span` (job 1 of the Grid family): one cell spans 2 columns
 * instead of 1, for a cell that needs to stand out (a banner, a summary cell)
 * among regular cells. The union stops at `1 | 2` — the rationale is in the
 * `GridItem.span` JSDoc in `Grid.tsx`.
 */
export const Span: Story = {
    render: () => {
        const items = cellItems(MODULES.slice(0, 4)).map((item, index) => ({
            ...item,
            span: index === 0 ? (2 as const) : undefined,
        }))
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Grid"
                    tier="frame"
                    leaf="Span"
                    states={[
                        {
                            name: "items[0].span = 2, rest span = undefined",
                            why: "The first cell stretches across two columns of the three-column grid while the remaining cells keep their default single-column width. A spanned cell always renders inside a real wrapper carrying `col-span-2`, even when `showAnatomy` is off.",
                            code: `<Grid
  gap="grouped"
  columns={{ base: 1, sm: 2, md: 3 }}
  items={[
    { key: "hero", span: 2, content: <HeroCard /> },
    { key: "a", content: <ModuleCard /> },
    …
  ]}
/>`,
                            render: (
                                <Frame width="48rem" label="container 768px — @app-md → 3 columns, first cell spans 2">
                                    <Grid showAnatomy gap="grouped" columns={{ base: 1, sm: 2, md: 3 }} items={items} />
                                </Frame>
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}

/**
 * Columns — the grid's DISTINCTIVE state: the SAME `columns`, just change the
 * container's width and the column count changes with it. Each breakpoint
 * INHERITS the smaller one right before it, so `{base:1, md:3}` means 1 column
 * up to `@app-md`, then 3 columns from there up.
 */
export const Columns: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid"
                tier="frame"
                leaf="Columns"
                reason="Column count is CAPPED per breakpoint by the TYPE (`sm` max 3, `base` max 2): four columns in a narrow shell is unreadable, so the type rejects it outright instead of leaving it for review to catch."
                states={[
                    {
                        name: "container = 320px (below @app-sm)",
                        why: "The grid falls back to its `base` step and stacks every card in a single column. This is the narrowest container width the demo exercises, below every breakpoint the `columns` prop names.",
                        code: `<Grid
  gap="grouped"
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
  items={…}
/>`,
                        render: (
                            <Frame width="20rem" label="container 320px — below @app-sm → base = 1 column">
                                <Grid showAnatomy gap="grouped" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                            </Frame>
                        ),
                    },
                    {
                        name: "container = 640px (@app-sm)",
                        why: "Once the container crosses the `@app-sm` breakpoint the same cards reflow into two columns. The `columns` prop passed to the grid never changed, only the surrounding container's width did.",
                        code: "<Grid gap=\"grouped\" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={…} />",
                        render: (
                            <Frame width="40rem" label="container 640px — @app-sm → 2 columns">
                                <Grid gap="grouped" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                            </Frame>
                        ),
                    },
                    {
                        name: "container = 768px (@app-md)",
                        why: "Crossing `@app-md` steps the grid up to three columns, one more than the sm step. Each breakpoint inherits the one before it, so this state only differs from the sm state by container width.",
                        code: "<Grid gap=\"grouped\" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={…} />",
                        render: (
                            <Frame width="48rem" label="container 768px — @app-md → 3 columns">
                                <Grid gap="grouped" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                            </Frame>
                        ),
                    },
                    {
                        name: "container = 1024px (@app-lg)",
                        why: "Crossing `@app-lg` steps the grid to its widest column count named by the `columns` prop. This is the last breakpoint the type allows, so the grid stays at four columns for any container wider than this.",
                        code: "<Grid gap=\"grouped\" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={…} />",
                        render: (
                            <Frame width="64rem" label="container 1024px — @app-lg → 4 columns">
                                <Grid gap="grouped" columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — `gap` accepts EXACTLY the six `SeamScale` words (§10c) and is REQUIRED, so a number
 * like `gap={4}` is a COMPILE ERROR. The step applies to BOTH axes, which is why the state
 * names below say the RELATIONSHIP: one seam is claiming the same thing about the row above a
 * cell and the cell beside it, and a word makes that claim readable where a number hides it.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid"
                tier="frame"
                leaf="Gaps"
                reason="A regular card grid sits at `grouped(3)`; `section(6)` is for grids of large REGIONS (§10b), not for a plain card grid."
                states={SCALE.map((step, index) => ({
                    name: step.relation,
                    why: index === 0
                        ? `Cell borders touch with no seam at all, which is what ${"`flush`"} means. Reach for it only when the two things are ONE unit of meaning, because anything else reads as a single continuous block.`
                        : `The seam widens to ${"`" + step.gap + "`"}, the step that fits ${step.relation}. The cells and their content never change across the scale, only the space between them does, so the choice is about the RELATIONSHIP and never about how it looks.`,
                    code: `<Grid
  gap="${step.gap}"
  columns={{ base: 2 }}
  items={…}
/>`,
                    render: (
                        <Frame width="32rem" label={step.relation}>
                            <Grid
                                showAnatomy={index === 0}
                                gap={step.gap}
                                columns={{ base: 2 }}
                                items={cellItems(MODULES.slice(0, 4))}
                            />
                        </Frame>
                    ),
                }))}
            />
        </div>
    ),
}
