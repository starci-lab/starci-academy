import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `StackH` is the single-axis HORIZONTAL frame. Its own states =
 * `at` (only a horizontal row reflows onto new lines, and only below a NAMED
 * container threshold — FRAME-10, 2026-08-01: the old `wrap?: boolean` is gone with
 * no deprecated stage) and `justify` (legible because a row always has leftover
 * width), plus the VERTICAL rule from `divider`. `gap` (the seam scale) and `align`
 * were already demoed in `StackV`, same prop, not repeated here.
 */
const meta: Meta<typeof StackH> = {
    title: "Frames/Stack/StackH",
    component: StackH,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StackH>

const startAndOverview = (
    <>
        <Button label="Get started" />
        <Button label="View syllabus" variant="secondary" />
    </>
)

const filterButtons = (
    <>
        <Button label="All" variant="secondary" size="sm" />
        <Button label="In progress" variant="secondary" size="sm" />
        <Button label="Completed" variant="secondary" size="sm" />
        <Button label="Saved" variant="secondary" size="sm" />
    </>
)

const cancelSaveActions = (
    <>
        <Button label="Cancel" variant="secondary" size="sm" />
        <Button label="Save" size="sm" />
    </>
)

/**
 * `@app-sm` measures the NEAREST CONTAINER, not the viewport — demoing a threshold means
 * opening a real `@container` at the right width, same as the app shell does.
 * `--container-app-sm = 40rem`.
 */
interface FrameProps {
    /** CSS width of the demo container */
    width: string
    /** caption printed above the container */
    label: string
    /** content rendered inside the container */
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

// No `Flex` node here (2026-07-28): same reasoning as `StackV` — the track's own root no
// longer self-badges with the internal box's name, since `Flex` has no story of its own.
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "Divider",
        tier: "atom",
        role: "a vertical Divider (`self-stretch`) inserted between two children",
        storyId: "atoms-display-divider-divider--default",
    },
]

/** Default — a horizontal row, seam `gap={3}`: elements belonging to the SAME cluster. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackH"
                tier="frame"
                leaf="Default"
                reason="The same single-axis frame as `StackV`, turned into a row, and only a row gets `at`. It accepts ARBITRARY `children`; when the content is N repeating elements of the same kind, that calls for `Cluster`/`Grid` (§13b) instead of this frame."
                states={[
                    {
                        name: "2 buttons, gap = 3",
                        why: "Two buttons sit in a single row with a `gap={3}` seam between them, the spacing for elements that belong to the same cluster. A row this size needs nothing more than the default axis: no reflow threshold, no justify, no divider.",
                        code: "<StackH gap={3} body={<>\n  <Button label=\"Get started\" />\n  <Button label=\"View syllabus\" variant=\"secondary\" />\n</>} />",
                        render: (
                            <StackH gap={3} showAnatomy body={startAndOverview} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * At — a state ONLY `StackH` has: below a NAMED container threshold, children flow
 * onto a new line instead of shrinking; from that width up, the row stays single-line.
 * `gap` applies to BOTH axes, so the space between lines matches the space between
 * children.
 *
 * 2026-08-01 (wave-3 numeric-scale migration, FRAME-10): `wrap?: boolean` is gone with
 * no deprecated stage. A boolean said only THAT the row could reflow, never WHERE — the
 * same row broke at a different width on every screen depending on the string, the
 * translation, the font. `at` names the width instead, the same fix `RailShell` already
 * made for its own stack↔row switch.
 */
export const At: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackH"
                tier="frame"
                leaf="At"
                reason="The threshold is declared, not hoped for. Below `@app-sm` the four filter buttons don't fit on one line, so the row reflows; at or above it, the same row has room and stays single-line. Same component, same props — only the container's width crosses the named step."
                states={[
                    {
                        name: "container 320px, below @app-sm — reflows",
                        why: "Below the `@app-sm` threshold the four filter buttons flow onto a second line instead of shrinking or spilling past the frame, and each button keeps its own natural width. `gap` applies to both axes, so the space between the two lines matches the space between the buttons on each line.",
                        code: "<StackH gap={3} at=\"sm\" body={<>…</>} />",
                        render: (
                            <Frame width="20rem" label="container 320px — below @app-sm, reflows">
                                <StackH gap={3} at="sm" showAnatomy body={filterButtons} />
                            </Frame>
                        ),
                    },
                    {
                        name: "container 768px, at or above @app-sm — single line",
                        why: "Crossing `@app-sm` gives the identical row enough width to hold all four buttons on one line, so nothing reflows. The `at` prop never changed — only the container around it did, which is the whole point of naming the threshold instead of reacting to whatever the content happens to do.",
                        code: "<StackH gap={3} at=\"sm\" body={<>…</>} />",
                        render: (
                            <Frame width="48rem" label="container 768px — at or above @app-sm, single line">
                                <StackH gap={3} at="sm" showAnatomy body={filterButtons} />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Justify — distributes along the MAIN axis (horizontal). `between` pushes both
 * ends to the edges; when a row has EXACTLY TWO named sides, use `Split` (a
 * separate frame) instead of this one.
 */
export const Justify: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackH"
                tier="frame"
                leaf="Justify"
                reason="`justify` only reads legibly when the main axis has leftover space to distribute, which is why this state belongs to a row and has no equivalent on `StackV`. Every render below shares the same `w-96` frame and the same two buttons, so only the distribution changes."
                states={[
                    {
                        name: "justify = start",
                        why: "The two buttons pack against the left edge of the row, leaving the leftover space empty on the right. Use it when the row's content should read as one left-aligned cluster instead of spreading across the available width.",
                        code: "<StackH gap={3} justify=\"start\" body={<>…</>} />",
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <StackH gap={3} justify="start" showAnatomy body={cancelSaveActions} />
                            </div>
                        ),
                    },
                    {
                        name: "justify = center",
                        why: "The two buttons shift to the middle of the row, with equal empty space left on both sides. Centering suits a row that is not the layout's primary focus, so it does not need to claim either edge.",
                        code: "<StackH gap={3} justify=\"center\" body={<>…</>} />",
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <StackH gap={3} justify="center" showAnatomy body={cancelSaveActions} />
                            </div>
                        ),
                    },
                    {
                        name: "justify = end",
                        why: "The two buttons pack against the right edge of the row, mirroring `start`. A form's cancel/save pair often sits here, aligned under content that itself reads out to the same edge.",
                        code: "<StackH gap={3} justify=\"end\" body={<>…</>} />",
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <StackH gap={3} justify="end" showAnatomy body={cancelSaveActions} />
                            </div>
                        ),
                    },
                    {
                        name: "justify = between",
                        why: "The two buttons are pushed to opposite ends of the row, with all the leftover space landing between them instead of around them. `between` only reads legibly because a row always has space left over to distribute, which is exactly why this state lives on `StackH` and not `StackV`.",
                        code: "<StackH gap={3} justify=\"between\" body={<>…</>} />",
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <StackH gap={3} justify="between" showAnatomy body={cancelSaveActions} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * WithDivider — on a horizontal row, the rule is VERTICAL and `self-stretch`
 * (as tall as the row) even while the row is `items-center`. Same `divider` prop,
 * but the rule's shape is decided by the AXIS.
 */
export const WithDivider: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StackH"
                tier="frame"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                states={[
                    {
                        name: "divider = true, 3 children",
                        why: "A vertical rule appears between each pair of the three text items, standing the row's full height even though the row itself is `items-center`. `align-self: stretch` wins over that centering on purpose, so the rule always spans the row's full height without the caller ever having to set one.",
                        code: "<StackH gap={4} divider body={<>\n  <Typography size=\"sm\" text=\"12 lessons\" />\n  <Typography size=\"sm\" text=\"4 hours\" />\n  <Typography size=\"sm\" text=\"Intermediate\" />\n</>} />",
                        render: (
                            <div data-tier="fixture" className="w-fit rounded-3xl bg-surface p-3 shadow-surface">
                                <StackH gap={4} divider showAnatomy body={<>
                                    <Typography size="sm" text="12 lessons" color="muted" />
                                    <Typography size="sm" text="4 hours" color="muted" />
                                    <Typography size="sm" text="Intermediate" color="muted" />
                                </>} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
