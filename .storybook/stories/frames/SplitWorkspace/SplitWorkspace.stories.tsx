import type { Meta, StoryObj } from "@storybook/nextjs"
import { SplitWorkspace } from "@sb-components/frames/SplitWorkspace/SplitWorkspace"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SplitWorkspace` — the read-column + sticky-aside workspace layout frame.
 * Every size is hard-owned. `main`/`aside` stack full-width below `@app-xl`
 * (mobile/tablet) and go side-by-side only from `@app-xl` (1280px) up.
 */

/** Props for the demo tile. */
interface TileProps {
    /** Text shown inside the tile. */
    label: string
    /** Extra height so the aside's sticky/scroll behaviour has room to show. */
    tall?: boolean
}

/** A sample tile — just to see the two regions, carries no domain content (§13). */
const Tile = ({ label, tall = false }: TileProps) => (
    <div data-tier="fixture" className={`rounded-xl border border-default bg-surface p-3 text-sm text-foreground ${tall ? "h-40" : ""}`}>{label}</div>
)

const meta: Meta<typeof SplitWorkspace> = {
    title: "Frames/SplitWorkspace/SplitWorkspace",
    component: SplitWorkspace,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SplitWorkspace>

/** LEAF — the split, at 3 container widths. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SplitWorkspace"
                tier="frame"
                leaf="Default"
                parts={[]}
                reason="Real `src` has this exact split TWICE (`ChallengeView`, `PersonalProjectWorkspace`) — a reading column that grows, beside a sticky action column, STACKED below `@app-xl` and side-by-side from it up. Two screens had been hand-rolling a `StackH…wrap` stand-in that never actually stacked; this frame is the real mechanism."
                states={[
                    {
                        name: "Mobile — 375px (stacked)",
                        why: "Below @app-xl the workspace is a single column: `main` renders first, full width, `aside` follows directly below it, also full width — the same reading order a mobile reader gets on any single-column page.",
                        code: `<div style={{ width: 375 }}>
    <SplitWorkspace main={<Brief />} aside={<Actions />} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 375 }}>
                                <SplitWorkspace

                                    main={() => <Tile label="main — reading column" tall />}
                                    aside={() => <Tile label="aside — action column" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "Tablet — 768px (still stacked)",
                        why: "768px is still below the `@app-xl` (1280px) step, so the workspace stays stacked — a tablet reader gets the SAME single-column order as mobile, not a cramped side-by-side squeeze. This is the exact case the old `StackH…wrap` stand-in got wrong: its `min-w-0 flex-1` main column let it keep sitting beside the aside instead of dropping below it.",
                        code: `<div style={{ width: 768 }}>
    <SplitWorkspace main={<Brief />} aside={<Actions />} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 768 }}>
                                <SplitWorkspace
                                    main={() => <Tile label="main — reading column" tall />}
                                    aside={() => <Tile label="aside — action column" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "Desktop — 1280px (side by side)",
                        why: "At the `@app-xl` step the workspace switches to a row: `main` grows to fill the remaining width (`min-w-0 flex-1`), `aside` pins to a `360px` sticky rail beside it. This is the ONE width where `flex-row` is correct — everything narrower reads as a single column.",
                        code: `<div style={{ width: 1280 }}>
    <SplitWorkspace main={<Brief />} aside={<Actions />} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 1280 }}>
                                <SplitWorkspace
                                    main={() => <Tile label="main — reading column" tall />}
                                    aside={() => <Tile label="aside — action column" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
