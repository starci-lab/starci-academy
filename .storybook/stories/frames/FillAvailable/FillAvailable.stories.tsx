import type { Meta, StoryObj } from "@storybook/nextjs"
import { FillAvailable } from "@sb-components/frames/FillAvailable/FillAvailable"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FillAvailable` — parent-owned flex participation (`base` width fill / `lg` height fill).
 */

const meta: Meta<typeof FillAvailable> = {
    title: "Frames/FillAvailable/FillAvailable",
    component: FillAvailable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FillAvailable>

/** Demo body for the `lg` flex-fill switch. */
const RailBody = () => (
    <div data-tier="fixture" className="h-full overflow-y-auto rounded-xl border border-default bg-surface p-3 text-sm">
        Rail body (fills remaining height from `lg` up)
    </div>
)

/** Demo body for the `base` flex-fill-base switch. */
const RowBody = () => (
    <div data-tier="fixture" className="truncate rounded-xl border border-default bg-surface px-3 py-2 text-sm">
        Truncating title column that claims remaining row width
    </div>
)

/** LEAF prop `at` — `base` → `min-w-0 flex-1`; `lg` → `min-h-0 @app-lg:flex-1`. */
export const At: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FillAvailable"
                tier="frame"
                leaf="Prop `at`"
                parts={[]}
                reason="FRAME-10: name the container step as a prop. `base` owns parent flex width participation; `lg` owns rail column height fill. Each mode emits one principle."
                states={[
                    {
                        name: "at = 'base' · flex row seam",
                        why: "Parent is a horizontal flex row; FillAvailable claims remaining width so the title can truncate without overflowing.",
                        code: `<div className="flex items-center gap-3">
  <div className="shrink-0">Tile</div>
  <FillAvailable at="base" body={RowBody} />
  <div className="shrink-0">Action</div>
</div>`,
                        render: (
                            <div data-tier="fixture" className="flex w-full max-w-md items-center gap-3">
                                <div data-tier="fixture" className="size-12 shrink-0 rounded-xl bg-accent-soft" />
                                <FillAvailable at="base" body={RowBody} />
                                <div data-tier="fixture" className="shrink-0 rounded-lg border border-default px-2 py-1 text-xs">
                                    Action
                                </div>
                            </div>
                        ),
                    },
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
