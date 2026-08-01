import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `RailShell` is a frame with a LEADING rail + a shrinking body. The
 * state it produces is the relationship between the TWO NAMED SIDES across the
 * `@app-md` threshold: stacked when narrow, two columns when wide, and whether the
 * rail is pinned or not. The rail width (288px) and the threshold (`@app-md`) are
 * SELF-OWNED by the frame, not a prop — the two real `src` sources agree on both
 * numbers, disagreeing only on sticky.
 */
const meta: Meta<typeof RailShell> = {
    title: "Frames/RailShell/RailShell",
    component: RailShell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RailShell>

/**
 * `@app-md` measures the nearest CONTAINER, not the viewport — demoing the
 * threshold means opening a `@container` at a real width, the same way the app
 * shell does.
 */
interface FrameProps {
    /** width of the simulated `@container`, e.g. `"48rem"` */
    width: string
    /** label rendered above the frame to name the width being demoed */
    label: string
    /** content rendered inside the simulated container */
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

/** A stand-in for whatever the caller puts in a slot — never real content. */
const Box = ({ label, lines }: { label: string; lines: number }) => (
    <StackV gap={4} body={<>
        <Typography size="sm" text={label} weight="medium" />
        {Array.from({ length: lines }, (_, index) => (
            <div data-tier="fixture" key={index} className="h-10 rounded-2xl bg-surface-secondary" />
        ))}
    </>} />
)

/**
 * Default — the rail leads, the body follows. The shape matches the two real
 * spots in `src`: dashboard (identity + the open tab) and settings (nav + panel).
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="Default"
                reason="Not a `SplitWorkspace` reversed: there the reading column leads and the aside is a 360px action rail. Here the rail LEADS — it is who you are or where you are — and the body is what you came to read. Opposite reading order, opposite shrink strategy. Naming the two sides puts `shrink-0` on the rail and `min-w-0` on the body in ONE file instead of at every call site."
                states={[
                    {
                        name: "rail leads, body follows",
                        why: "The rail holds identity or navigation at a fixed 288px and never shrinks; the body takes every remaining pixel and shrinks without limit, so long content truncates inside it instead of pushing the rail off screen. This is the shape both `features/dashboard/index.tsx` and `Settings/SettingsLayout/index.tsx` wrote by hand before this khung existed.",
                        code: `<RailShell
  rail={<DashboardIdentity />}
  body={<OverviewTab />}
/>`,
                        render: (
                            <Frame width="60rem" label="container 960px, at or above @app-md, two columns">
                                <RailShell

                                    rail={<Box label="rail — identity, 288px, never shrinks" lines={2} />}
                                    body={<Box label="body — the open tab, absorbs the rest" lines={4} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Breakpoint — below `@app-md` the two sides become a COLUMN, the rail moves on
 * top. The threshold measures the CONTAINER's width, not the viewport, and it is
 * DECLARED — not a `wrap` left to hope for the best.
 */
export const Breakpoint: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="Breakpoint"
                reason="The threshold is declared, not hoped for. `wrap` carries no threshold at all: the body shrinks without limit so a wrapped row almost never actually wraps, which is how two screens shipped with their columns glued together at every width including mobile."
                states={[
                    {
                        name: "container 640px, below @app-md",
                        why: "The two sides stack into a column with the rail on top, each full width. This is what a phone gets, and what any container narrower than the breakpoint gets — the AI rail can squeeze the app column at any window size.",
                        code: `<RailShell rail={…} body={…} />`,
                        render: (
                            <Frame width="40rem" label="container 640px, below @app-md, stacks">
                                <RailShell

                                    rail={<Box label="rail on top, full width" lines={1} />}
                                    body={<Box label="body below" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "container 960px, at or above @app-md",
                        why: "Same component, same props — only the container crossed the breakpoint. The rail becomes a fixed 288px column and the body takes the remainder.",
                        code: `<RailShell rail={…} body={…} />`,
                        render: (
                            <Frame width="60rem" label="container 960px, at or above @app-md, two columns">
                                <RailShell

                                    rail={<Box label="rail — 288px" lines={1} />}
                                    body={<Box label="body — the rest" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * IsRailSticky — the ONLY prop this frame has, and it exists because the two real
 * `src` sources disagree exactly here: dashboard scrolls the rail with the page,
 * settings pins the rail to the viewport.
 */
export const IsRailSticky: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="IsRailSticky"
                reason="A number becomes a prop when a real consumer disagrees, not before. Both real sources agree on the 288px rail and the `@app-md` threshold, so those stay hard-owned. They disagree on sticky — dashboard scrolls its rail with the page, settings pins its nav — so that one, and only that one, is a prop."
                states={[
                    {
                        name: "isRailSticky = false (default)",
                        why: "The rail scrolls away with the page. This is right when the rail is a snapshot the reader glances at once — an identity card, a standing — rather than something they keep returning to.",
                        code: `<RailShell
  rail={<DashboardIdentity />}
  body={<OverviewTab />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail scrolls with the page">
                                <RailShell

                                    rail={<Box label="rail — scrolls away" lines={1} />}
                                    body={<Box label="body" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "isRailSticky",
                        why: "The rail pins to the viewport once the two sit side by side, and scrolls internally when it outgrows the screen. This is right when the rail is navigation the reader returns to while the body scrolls past it.",
                        code: `<RailShell
  isRailSticky
  rail={<SettingsNav />}
  body={<SettingsPanel />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail pinned to the viewport">
                                <RailShell

                                    isRailSticky
                                    rail={<Box label="rail — pinned" lines={1} />}
                                    body={<Box label="body" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
