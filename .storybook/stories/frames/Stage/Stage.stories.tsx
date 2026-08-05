import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stage } from "@sb-components/frames/Stage/Stage"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Stage` — a canvas region with chrome FLOATING OVER it. It owns the positioning
 * context, the anchor positions, the z-order and the edge inset so no caller ever
 * writes `absolute`/`relative` again.
 */

/** Props for the demo canvas fixture. */
interface CanvasProps {
    /** Text shown inside the canvas placeholder. */
    label: string
}

/** A sample canvas — just to see the region, carries no domain content (§13). */
const Canvas = ({ label }: CanvasProps) => (
    <div data-tier="fixture" className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-default bg-surface-secondary text-sm text-foreground">{label}</div>
)

/** Props for the demo chrome fixture. */
interface ChromeProps {
    /** Text shown inside the chrome pill. */
    label: string
}

/** A sample floating-chrome pill — a stand-in for whatever a caller anchors over the canvas. */
const Chrome = ({ label }: ChromeProps) => (
    <div data-tier="fixture" className="rounded-full border border-default bg-surface px-3 py-2 text-xs text-foreground shadow-sm">{label}</div>
)

const meta: Meta<typeof Stage> = {
    title: "Frames/Stage/Stage",
    component: Stage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Stage>

/** LEAF — the canvas alone, no floating chrome. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Stage"
                tier="frame"
                leaf="Default"
                parts={[]}
                reason="A canvas region with chrome floating over it is a real shape `MindMapPage` hand-rolled with `relative`/`absolute` at four call sites, self-flagging the gap in place each time. This frame owns the positioning context once so a caller never reaches for those classes again."
                states={[
                    {
                        name: "canvas only",
                        why: "With no floating slot passed, only `canvas` renders — the frame still opens its positioning context (`relative`) but has no chrome to anchor.",
                        code: "<Stage canvas={<ReactFlowCanvas />} />",
                        render: (
                            <div data-tier="fixture" style={{ height: 320 }}>
                                <Stage canvas={() => <Canvas label="canvas — fills the region" />} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — every anchor slot filled at once, the shape `MindMapPage` hand-rolled four times over. */
export const AnchorsFilled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Stage"
                tier="frame"
                leaf="Anchors filled"
                reason="Real `src` (`MindMapPage/index.tsx`) anchored a continue button top-center, a legend bottom-start and a zoom rail bottom-end, all floating over the same canvas — each `absolute` class hand-written and self-flagged as a vocabulary gap. This state shows all three anchors at once, the exact composition that flagged the gap."
                states={[
                    {
                        name: "canvas + topCenter + bottomStart + bottomEnd",
                        why: "`topCenter` spans the width at `top-4`, `bottomStart` sits at `bottom-4 left-4`, `bottomEnd` sits at `bottom-4 right-4` — three independent anchors, each z-ordered above the canvas, none of them touching the others' inset.",
                        code: `<Stage
  canvas={<ReactFlowCanvas />}
  topCenter={<ContinueButton />}
  bottomStart={<Legend />}
  bottomEnd={<ZoomRail />}
/>`,
                        render: (
                            <div data-tier="fixture" style={{ height: 360 }}>
                                <Stage
                                    canvas={() => <Canvas label="canvas — ReactFlow region" />}
                                    topCenter={() => <Chrome label="topCenter — continue button" />}
                                    bottomStart={() => <Chrome label="bottomStart — legend" />}
                                    bottomEnd={() => <Chrome label="bottomEnd — zoom rail" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `fill` — `"parent"` (default) vs `"viewport"`, the two `MindMapPage` shapes. */
export const Fill: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Stage"
                tier="frame"
                leaf="Prop `fill`"
                reason="`MindMapPage` hand-wrote `h-[calc(100dvh-4rem)]` twice for its `standalone` shape, where the stage is the full screen under the app shell's own 4rem of chrome. Nested inside `workspace`, the same canvas instead fills whatever a row beside the rail gives it. Two real shapes, so `fill` names both."
                states={[
                    {
                        name: "fill = 'parent' (default)",
                        why: "The stage fills whatever box its own caller frame gives it (`h-full w-full`) — the shape used when `Stage` nests inside another frame's own sizing, the more common case.",
                        code: "<Stage canvas={<ReactFlowCanvas />} />",
                        render: (
                            <div data-tier="fixture" style={{ height: 240 }}>
                                <Stage canvas={() => <Canvas label='fill="parent" — fills the given box' />} />
                            </div>
                        ),
                    },
                    {
                        name: "fill = 'viewport'",
                        why: "The stage hard-owns `h-[calc(100dvh-4rem)] w-full` — the viewport minus the app shell's own 4rem of chrome, the exact shape `MindMapPage`'s `standalone` variant hand-wrote twice.",
                        code: "<Stage fill=\"viewport\" canvas={<ReactFlowCanvas />} />",
                        render: (
                            <div data-tier="fixture" className="overflow-hidden rounded-3xl border border-dashed border-default" style={{ height: 240 }}>
                                <Stage fill="viewport" canvas={() => <Canvas label='fill="viewport" — 100dvh minus 4rem shell' />} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
