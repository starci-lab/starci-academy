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
 *
 * ⚠️ SELF-CONTAINED `@container`: this frame opens its OWN container query context
 * rather than trusting an ancestor to have opened one — the `dashboard` real `src`
 * mounts it inside a bare `<div>` (no `Container`), so if the switch depended on an
 * ancestor `@container`, `@app-md:flex-row` never fires and the shell is stuck in
 * its stacked shape at every width, `side="end"` included. TWO layers, the same
 * split `Container` uses and for the same reason: a container query can only be
 * answered by a DESCENDANT of the element that opens it, never by that element
 * itself, so the OUTER node opens `@container` (identity + `classNames` live here)
 * and the INNER node — a real descendant — carries the `flex`/`gap`/switch classes
 * that actually answer `@app-md`.
 *
 * ⚠️ APP-WIRE HANDOFF — the EXACT two things apps/app must have for this to render
 * as a right rail instead of the stacked list the shell shipped with:
 * 1. The class this component now puts on its own outer node — the Tailwind v4
 *    utility `@container` (compiles to `container-type: inline-size`). Nothing
 *    ELSE needs to open a container context; `RailShell` no longer trusts an
 *    ancestor for this (see the note above) — it is self-contained as of this fix.
 * 2. The `--container-app-sm/md/lg/xl` custom properties, declared inside an
 *    `@theme { }` block in THIS book's `src/app/globals.css` (40rem / 48rem / 64rem
 *    / 80rem — pinned to the viewport `sm/md/lg/xl` pixel values, see that file's
 *    comment for why). These are what make the `@app-sm:`/`@app-md:`/`@app-lg:`/
 *    `@app-xl:` utility CLASSES exist in the compiled CSS at all — Tailwind only
 *    generates a `@app-md:` variant where `--container-app-md` is defined somewhere
 *    in the build's `@theme`. Point 1 without point 2 compiles fine and renders
 *    stacked forever with NO error, because the `@app-md:flex-row` class name is
 *    real but matches nothing. apps/app must declare the SAME four custom
 *    properties (identical rem values) in its own global stylesheet — either by
 *    literally copying the `@theme { --container-app-* }` block, or by importing a
 *    stylesheet that does — before `RailShell`/`DashboardShell` will lay out
 *    correctly there. This is the one step this book fix CANNOT do on apps/app's
 *    behalf; the story fixtures below only work because `.storybook/preview.tsx`
 *    imports this book's `src/app/globals.css`, which already carries that
 *    `@theme` block.
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

/**
 * The SAME fixture as {@link Frame}, deliberately WITHOUT `@container` on the
 * wrapper — the exact shape `DashboardShell` mounts `RailShell` in (a bare `<div>`,
 * never a `Container`). Proves the frame answers `@app-md` on its own: if it still
 * depended on an ancestor opening the query context, every state rendered here
 * would be stuck in its stacked shape regardless of `width`.
 */
const BareFrame = ({ width, label, children }: FrameProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Props for the {@link Box} fixture. */
interface BoxProps {
    /** label rendered above the placeholder lines */
    label: string
    /** number of placeholder lines to render */
    lines: number
}

/** A stand-in for whatever the caller puts in a slot — never real content. */
const Box = ({ label, lines }: BoxProps) => (
    <StackV gap={4} items={[
        () => <Typography size="sm" text={label} weight="medium" />,
        ...Array.from({ length: lines }, () => () => (
            <div data-tier="fixture" className="h-10 rounded-2xl bg-surface-secondary" />
        )),
    ]} />
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

                                    rail={() => <Box label="rail — identity, 288px, never shrinks" lines={2} />}
                                    body={() => <Box label="body — the open tab, absorbs the rest" lines={4} />}
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

                                    rail={() => <Box label="rail on top, full width" lines={1} />}
                                    body={() => <Box label="body below" lines={3} />}
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

                                    rail={() => <Box label="rail — 288px" lines={1} />}
                                    body={() => <Box label="body — the rest" lines={3} />}
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

                                    rail={() => <Box label="rail — scrolls away" lines={1} />}
                                    body={() => <Box label="body" lines={3} />}
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
                                    rail={() => <Box label="rail — pinned" lines={1} />}
                                    body={() => <Box label="body" lines={3} />}
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
 * Side — which END of the row the rail sits at. Every self-owned number (the 288px
 * width, the `@app-md` threshold, `shrink-0` on the rail, `min-w-0` on the body) is
 * identical either way; `"end"` only re-orders the two named columns, so it is a
 * mirror of `"start"`, not a second layout. The nivo dashboard shell mounts its nav
 * rail on the trailing edge through this prop.
 */
export const Side: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="Side"
                reason="A rail is not always a LEADING column. `side` moves the same rail to the trailing edge without duplicating the shell: the rail keeps `shrink-0` and its fixed width, the body keeps `min-w-0` and absorbs the rest — only the DOM order of the two flips. Because the stacked (below-`at`) order follows the DOM, `'end'` also drops the rail below the body when narrow, which is the honest reading order for a trailing rail."
                states={[
                    {
                        name: "side = \"start\" (default)",
                        why: "The rail LEADS: first in the DOM and on the left once the two sit side by side. This is the unchanged default — identity or navigation the reader meets before the content. Leaving `side` unset is identical to this.",
                        code: `<RailShell
  rail={<DashboardIdentity />}
  body={<OverviewTab />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail on the LEFT (leads)">
                                <RailShell

                                    rail={() => <Box label="rail — leads, on the left" lines={1} />}
                                    body={() => <Box label="body — absorbs the rest" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "side = \"end\"",
                        why: "The rail FOLLOWS: last in the DOM and on the right. The nivo dashboard shell uses this so its navigation sits on the trailing edge with the route content leading in the centre — content first for a keyboard/screen-reader, nav after.",
                        code: `<RailShell
  side="end"
  rail={<NivoSidebar />}
  body={<RouteContent />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail on the RIGHT (follows)">
                                <RailShell

                                    side="end"
                                    rail={() => <Box label="rail — follows, on the right" lines={1} />}
                                    body={() => <Box label="body — leads, in the centre" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "side = \"end\", isRailSticky — the nivo dashboard shape",
                        why: "The exact props + mount `DashboardShell` uses: `RailShell` sitting directly in a bare `<div>` (`BareFrame`, no `@container` on the wrapper) — proving the self-contained fix. Body leads min-w-0 in the centre; the rail is a real 288px column pinned to the RIGHT, sticky as the body scrolls past it, never a full-width list dumped above or below the content.",
                        code: `<RailShell
  side="end"
  isRailSticky
  rail={<NivoSidebar />}
  body={<RouteContent />}
/>`,
                        render: (
                            <BareFrame width="60rem" label="bare wrapper (no @container) — 960px, at or above @app-md">
                                <RailShell

                                    side="end"
                                    isRailSticky
                                    rail={() => <Box label="rail — 288px, sticky, on the RIGHT" lines={6} />}
                                    body={() => <Box label="body — min-w-0, leads in the centre" lines={3} />}
                                />
                            </BareFrame>
                        ),
                    },
                    {
                        name: "side = \"end\", narrow — bare wrapper, below @app-md",
                        why: "The SAME bare-wrapper mount as the row above, only the container shrank below the threshold. `side=\"end\"` follows the DOM order when stacked, so the rail drops BELOW the body instead of above it — the honest reading order for a trailing rail (content first, nav after) and the opposite of the `side=\"start\"` stack in the Breakpoint story. This is the shape a narrow window or a docked chat rail squeezing the app column produces; it must stay a clean stacked column here, never the collapsed-into-nowhere failure the shell shipped with.",
                        code: `<RailShell side="end" isRailSticky rail={<NivoSidebar />} body={<RouteContent />} />`,
                        render: (
                            <BareFrame width="24rem" label="bare wrapper (no @container) — 384px, below @app-md">
                                <RailShell

                                    side="end"
                                    isRailSticky
                                    rail={() => <Box label="rail — full width, BELOW the body" lines={2} />}
                                    body={() => <Box label="body — full width, leads on top" lines={3} />}
                                />
                            </BareFrame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
