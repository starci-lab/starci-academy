import type { Meta, StoryObj } from "@storybook/nextjs"
import { PinnedTrack } from "@sb-components/frames/PinnedTrack/PinnedTrack"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * FRAME — `PinnedTrack`: a vertical track of exactly two roles — a member that PINS to
 * the top of its own scroll region (`pinned`), and a member that FILLS whatever height
 * is left below it (`body`).
 *
 * One prop = one leaf beyond the two required slots: `landmark` is the one structural
 * choice a caller actually makes (whether `body` renders as `<main>` or a plain
 * `<div>`). `isSkeleton` is a bare pass-through with no leaf of its own — the same
 * restraint every other frame in this folder already takes (`Container`,
 * `SplitWorkspace`, `RailShell`, `Grid`): skeleton is a data-owning tier's concern
 * (`story.md`), and this frame owns no data, it only forwards the flag to `pinned`/
 * `body`. `classNames` (placement only), `principle`/`explain` (the caller's own seam
 * vocabulary) and `identity` (a caller wearing this track as its own root) are the same
 * infra props every other frame in this folder already skips a leaf for.
 *
 * No `annotate`: `pinned`/`body` are caller slots with no badge of their own — the same
 * restraint `SplitWorkspace`'s `main`/`aside` and `RailShell`'s `rail`/`body` already
 * take. There is no `PinnedTrack`-owned part to declare.
 */
const meta: Meta<typeof PinnedTrack> = {
    title: "Frames/PinnedTrack/PinnedTrack",
    component: PinnedTrack,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PinnedTrack>

/** The member that pins — a real header, not a bare label, so the sticky edge is visible. */
const PinnedHeader = () => (
    <div data-tier="fixture" className="bg-surface p-3 text-sm font-medium text-foreground shadow-surface">
        Pinned header
    </div>
)

/** Props for the {@link ScrollBody} fixture. */
interface ScrollBodyProps {
    /** Label shown above the placeholder rows, so a state can say what it's demonstrating. */
    label: string
    /** Number of placeholder rows — enough to overflow the track and force real scrolling. */
    rows: number
}

/** A stand-in for whatever the caller fills the track's remaining height with. */
const ScrollBody = ({ label, rows }: ScrollBodyProps) => (
    <div data-tier="fixture" className="flex flex-col gap-2 p-3 text-sm text-foreground">
        <span className="text-muted">{label}</span>
        {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="rounded-xl border border-default bg-surface p-3">
                Row {index + 1}
            </div>
        ))}
    </div>
)

/** Bare leaf — `pinned` sticks to the top, `body` fills and scrolls underneath it. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PinnedTrack"
                tier="frame"
                leaf="No prop turned on"
                reason="The pin-then-fill shape `InnerLayout` used to hand-roll twice over — once for the sticky nav, once for the filling `children` — collapsed into one named frame instead of two unrelated `className` strings living in different files."
                states={[
                    {
                        name: "pinned set, body set, track scrolled to the middle",
                        why: "`pinned` holds `sticky top-0 z-40` and stays glued to the top of the track's own scroll region while `body` — holding `min-w-0 flex-1` — scrolls underneath it. The track has 8 rows, enough to overflow the 320px viewport this fixture gives it, so the pin is doing real work, not just sitting still because there was nothing to scroll past.",
                        code: `<PinnedTrack
    pinned={PinnedHeader}
    body={() => <ScrollBody label="Scrollable body" rows={8} />}
/>`,
                        render: (
                            <div data-tier="fixture" className="h-80 overflow-auto border border-default">
                                <PinnedTrack
                                    pinned={PinnedHeader}
                                    body={() => <ScrollBody label="Scrollable body" rows={8} />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `landmark` — whether `body` renders as `<main>` or a plain `<div>`. */
export const Landmark: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PinnedTrack"
                tier="frame"
                leaf="Prop `landmark`"
                reason="A document needs exactly one `<main>` landmark (WAI-ARIA). The one caller that owns the page's shell sets `landmark`; a `PinnedTrack` nested inside another track's own `body` leaves it `false` so it never mints a second one. `pinned` content stays the same across both states in this leaf — only the wrapping tag around `body` is what's changing."
                states={[
                    {
                        name: "landmark = false (default)",
                        why: "`body` renders inside a plain `<div>`. This is the shape for a `PinnedTrack` nested inside another track's own `body` slot — it must never mint a second `<main>` on the page.",
                        code: `<PinnedTrack
    pinned={PinnedHeader}
    body={() => <ScrollBody label="body wrapped in <div> (default)" rows={4} />}
/>`,
                        render: (
                            <div data-tier="fixture" className="h-64 overflow-auto border border-default">
                                <PinnedTrack
                                    pinned={PinnedHeader}
                                    body={() => <ScrollBody label="body wrapped in <div> (default)" rows={4} />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "landmark = true",
                        why: "`body` renders inside a `<main>` element instead. Set this on the ONE `PinnedTrack` that owns the page's own shell, so the document gets its single `<main>` landmark from the track that actually holds the page's primary content.",
                        code: `<PinnedTrack
    landmark
    pinned={PinnedHeader}
    body={() => <ScrollBody label="body wrapped in <main> (landmark)" rows={4} />}
/>`,
                        render: (
                            <div data-tier="fixture" className="h-64 overflow-auto border border-default">
                                <PinnedTrack
                                    landmark
                                    pinned={PinnedHeader}
                                    body={() => <ScrollBody label="body wrapped in <main> (landmark)" rows={4} />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
