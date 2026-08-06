import type { Meta, StoryObj } from "@storybook/nextjs"
import { HideAbove } from "@sb-components/frames/HideAbove/HideAbove"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HideAbove` — hides its body once the nearest `@container` reaches a named step.
 */

const meta: Meta<typeof HideAbove> = {
    title: "Frames/HideAbove/HideAbove",
    component: HideAbove,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HideAbove>

/** Demo body for the visibility switch. */
const Nudge = () => (
    <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-3 text-sm">
        Practice nudge (visible below `lg`)
    </div>
)

/** LEAF prop `at` — show below `lg`, hide from `lg` up (ContentPage practice nudge). */
export const At: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HideAbove"
                tier="frame"
                leaf="Prop `at`"
                parts={[]}
                reason="FRAME-10: name the container step as a prop, never bury `@app-*:hidden` in a caller className. ContentPage's practice nudge and LeaderboardPage's chip row both need hide-from-lg-up without a second tree."
                states={[
                    {
                        name: "at = 'lg' · container 375px",
                        why: "Below `@app-lg`, the body stays visible.",
                        code: `<div className="@container" style={{ width: 375 }}>
  <HideAbove at="lg" body={Nudge} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 375 }}>
                                <HideAbove at="lg" body={Nudge} />
                            </div>
                        ),
                    },
                    {
                        name: "at = 'lg' · container 1280px",
                        why: "Past `@app-lg`, the body is hidden — same boundary ContentPage uses for the mobile practice nudge.",
                        code: `<div className="@container" style={{ width: 1280 }}>
  <HideAbove at="lg" body={Nudge} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 1280 }}>
                                <HideAbove at="lg" body={Nudge} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
