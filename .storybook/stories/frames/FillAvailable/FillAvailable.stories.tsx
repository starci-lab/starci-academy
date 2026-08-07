import type { Meta, StoryObj } from "@storybook/nextjs"
import { FillAvailable } from "@sb-components/frames/FillAvailable/FillAvailable"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FillAvailable` — remaining column height from a named container step upward.
 */

const meta: Meta<typeof FillAvailable> = {
    title: "Frames/FillAvailable/FillAvailable",
    component: FillAvailable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FillAvailable>

/** Demo body for the flex-fill switch. */
const RailBody = () => (
    <div data-tier="fixture" className="h-full overflow-y-auto rounded-xl border border-default bg-surface p-3 text-sm">
        Rail body (fills remaining height from `lg` up)
    </div>
)

/** LEAF prop `at` — `min-h-0` always, `flex-1` from `@app-lg` up. */
export const At: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FillAvailable"
                tier="frame"
                leaf="Prop `at`"
                parts={[]}
                reason="FRAME-10: name the container step as a prop, never bury `min-h-0 @app-lg:flex-1` on a rail child. LearnShellLayout and Architecture/Practice rails share this exact fill."
                states={[
                    {
                        name: "at = 'lg' · flex column shell",
                        why: "Parent is a tall flex column; FillAvailable claims remaining height so the body can scroll.",
                        code: `<div className="@container flex h-80 flex-col">
  <div className="shrink-0 p-2">Rail header</div>
  <FillAvailable at="lg" body={RailBody} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container flex h-80 flex-col gap-2">
                                <div data-tier="fixture" className="shrink-0 rounded-lg border border-default bg-default px-3 py-2 text-xs">
                                    Rail header
                                </div>
                                <FillAvailable at="lg" body={RailBody} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
