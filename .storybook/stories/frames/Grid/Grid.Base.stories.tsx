import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Grid.Base` is a two-dimensional REPEATED-LIST FRAME. The state it
 * produces = `columns` (column count by CONTAINER breakpoint — a distinctive state no
 * other frame has), and `gap` (§10). No `align`/`justify`: a grid cell stretches to
 * fill by default, aligning content inside the cell is the job of the component
 * inside it. An empty list → an empty track, the "nothing here yet" copy belongs to
 * the caller (§13 — a frame carries no content).
 */
const meta: Meta<typeof Grid.Base> = {
    title: "Frames/Grid/Grid.Base",
    component: Grid.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Grid.Base>

/** A frame carries no content — the fixture is a real card so cells and seams are visible. */
const cellItems = (labels: ReadonlyArray<string>) =>
    labels.map((label) => ({
        key: label,
        content: (
            <SurfaceCard.Base>
                <Typography.Base size="sm" text={label} />
            </SurfaceCard.Base>
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
        <Typography.Base size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** The six VALID steps of §10 — `gap` is a literal union so there's no seventh step. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — a card grid: 1 column narrow → 2 columns from `@app-sm` → 3 columns from `@app-md`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid.Base"
                tier="frame"
                leaf="Default"
                reason="A two-dimensional repeated list ⇒ `items` is DATA, `children` is FORBIDDEN (§13b) — the grid's premise is that every cell is the same kind of thing. The reflow breakpoint is a CONTAINER QUERY `@app-*`, not `md:`: the app shell has a left rail that the AI panel can squeeze at any time, so the grid must listen to its own column, not the viewport."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 1, sm: 2, md: 3 }}
  items={modules.map((m) => ({ key: m, content: <ModuleCard name={m} /> }))}
/>`}
            >
                <Frame width="48rem" label="container 768px — @app-md breakpoint → 3 columns">
                    <Grid.Base showAnatomy gap={3} columns={{ base: 1, sm: 2, md: 3 }} items={cellItems(MODULES)} />
                </Frame>
            </BlockAnatomy>
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
                    name="Grid.Base"
                    tier="frame"
                    leaf="Span"
                    note="The first cell `span: 2` occupies two columns in the 3-column grid; the rest keep the default `span` (1). A spanned cell always has a real wrapper to carry `col-span-2`, even when `showAnatomy` is off."
                    code={`<Grid.Base
  gap={3}
  columns={{ base: 1, sm: 2, md: 3 }}
  items={[
    { key: "hero", span: 2, content: <HeroCard /> },
    { key: "a", content: <ModuleCard /> },
    …
  ]}
/>`}
                >
                    <Frame width="48rem" label="container 768px — @app-md → 3 columns, first cell spans 2">
                        <Grid.Base showAnatomy gap={3} columns={{ base: 1, sm: 2, md: 3 }} items={items} />
                    </Frame>
                </BlockAnatomy>
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
                name="Grid.Base"
                tier="frame"
                leaf="Columns"
                note="Column count is CAPPED per breakpoint by the TYPE (`sm` max 3, `base` max 2): 4 columns in a narrow shell is unreadable, so the type rejects it outright instead of leaving it for review to catch."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    <Frame width="20rem" label="container 320px — below @app-sm → base = 1 column">
                        <Grid.Base showAnatomy gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="40rem" label="container 640px — @app-sm → 2 columns">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="48rem" label="container 768px — @app-md → 3 columns">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                    <Frame width="64rem" label="container 1024px — @app-lg → 4 columns">
                        <Grid.Base gap={3} columns={{ base: 1, sm: 2, md: 3, lg: 4 }} items={cellItems(MODULES.slice(0, 4))} />
                    </Frame>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Gaps — `gap` accepts EXACTLY the six steps `0·1·2·3·6·8` (§10c) and is
 * REQUIRED; `gap={4}` is a COMPILE ERROR. Applied to BOTH axes so the gap
 * between rows equals the gap between columns.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Grid.Base"
                tier="frame"
                leaf="Gaps"
                note="A regular card grid sits at `grouped(3)`; `section(6)` is for grids of large REGIONS (§10b), not for a plain card grid."
                code={`<Grid.Base
  gap={3}
  columns={{ base: 2 }}
  items={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {SCALE.map((step, index) => (
                        <Frame key={step.gap} width="32rem" label={step.name}>
                            <Grid.Base
                                showAnatomy={index === 0}
                                gap={step.gap}
                                columns={{ base: 2 }}
                                items={cellItems(MODULES.slice(0, 4))}
                            />
                        </Frame>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
