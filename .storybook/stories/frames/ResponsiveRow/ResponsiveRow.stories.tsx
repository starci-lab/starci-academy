import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { ResponsiveRow } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ResponsiveRow` — a repeat-list FRAME: a fixed grid below its switch step, an
 * equal-share flex row from it up, going flush (`gap-0`) the moment it becomes a row
 * (the caller marks the seam itself, e.g. `StatRibbon`'s per-cell `border-l`). Built
 * for `StatRibbon`, which is exactly the fixture below — a padded 2-column grid on a
 * narrow shell, one un-padded divided row from `@app-sm` up.
 */
const meta: Meta<typeof ResponsiveRow> = {
    title: "Frames/ResponsiveRow/ResponsiveRow",
    component: ResponsiveRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ResponsiveRow>

/** A frame carries no content — a real value+label cell so the switch is visible. */
const cell = (label: string, value: string) =>
    ({ isSkeleton }: SkeletonProps) => (
        <div className="flex min-w-0 flex-col gap-1 @app-sm:flex-1 @app-sm:px-6 @app-sm:py-3 @app-sm:first:pl-3 @app-sm:last:pr-3">
            <Typography size="h4" weight="semibold" isSkeleton={isSkeleton} text={value} />
            <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={label} />
        </div>
    )

const CELLS = [cell("Passed", "12"), cell("XP", "1,204"), cell("Top", "8%"), cell("Rank", "#3")]

/** `@app-*` measures the NEAREST CONTAINER, not the viewport. */
interface FrameProps {
    width: string
    label: string
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Default — the switch itself, at the two container widths that straddle `at="sm"`. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ResponsiveRow"
                tier="frame"
                leaf="Default"
                reason="A repeating list ⇒ `items` DATA, `children` FORBIDDEN (§13b) — every cell is the same kind of thing. No gap above the switch step: a divided row has one seam mechanism, not two, so it goes flush (`gap-0`) once flex takes over and the caller marks the seam with its own `border-l`, exactly as `StatRibbon` does."
                states={[
                    {
                        name: "container = 320px (below @app-sm) — fixed 2-column grid",
                        why: "Below the switch step the four cells lay out as a `columns=2` grid with a real `gap`, since a divided row would be too cramped this narrow. This is the shape `StatRibbon` falls back to on mobile.",
                        code: `<ResponsiveRow
    columns={2}
    at="sm"
    gap={4}
    items={cells}
/>`,
                        render: (
                            <Frame width="20rem" label="container 320px — below @app-sm → 2-column grid">
                                <ResponsiveRow columns={2} at="sm" gap={4} items={CELLS} />
                            </Frame>
                        ),
                    },
                    {
                        name: "container = 640px (@app-sm) — equal-share flush row",
                        why: "Once the container crosses `@app-sm` the same four cells switch to an equal-share flex row with `gap-0` — the `columns`/`gap` props never changed, only the container's width did. A caller marks the seam between cells itself (here, a `border-l` on every cell but the first).",
                        code: `<ResponsiveRow
    columns={2}
    at="sm"
    gap={4}
    items={cells}
/>`,
                        render: (
                            <Frame width="40rem" label="container 640px — @app-sm → equal-share row, flush">
                                <ResponsiveRow columns={2} at="sm" gap={4} items={CELLS} />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Columns — the fixed-grid column count BELOW the switch step, capped at `1 | 2` (§ file header: a shell wide enough for 3+ columns is wide enough for the flex row instead). */
export const Columns: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ResponsiveRow"
                tier="frame"
                leaf="Columns"
                reason="`columns` is capped at `1 | 2` — a narrow shell wide enough for a 3+ column grid is wide enough for the equal-share flex row instead, so a caller needing more belongs on `Grid`, not here."
                states={[
                    {
                        name: "columns = 1 (container = 320px)",
                        why: "Every cell stacks in a single column below the switch step — for a pair whose fixed grid would otherwise squeeze two cells uncomfortably into one narrow row.",
                        code: "<ResponsiveRow columns={1} at=\"sm\" gap={4} items={cells.slice(0, 2)} />",
                        render: (
                            <Frame width="20rem" label="container 320px — columns=1 → single column">
                                <ResponsiveRow columns={1} at="sm" gap={4} items={CELLS.slice(0, 2)} />
                            </Frame>
                        ),
                    },
                    {
                        name: "columns = 2 (container = 320px)",
                        why: "The same four cells instead pair up two-per-row below the switch step — the shape `StatRibbon` actually uses.",
                        code: "<ResponsiveRow columns={2} at=\"sm\" gap={4} items={cells} />",
                        render: (
                            <Frame width="20rem" label="container 320px — columns=2 → 2-column grid">
                                <ResponsiveRow columns={2} at="sm" gap={4} items={CELLS} />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
