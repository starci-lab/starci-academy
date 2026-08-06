import type { Meta, StoryObj } from "@storybook/nextjs"
import { LockedContentMask } from "@sb-components/composites/layout/LockedContentMask/LockedContentMask"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LockedContentMask` — positioning context + locked-tail fade for a paywalled reading body.
 */

const meta: Meta<typeof LockedContentMask> = {
    title: "Composites/Layout/LockedContentMask/LockedContentMask",
    component: LockedContentMask,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LockedContentMask>

/** Tall fake lesson body so the fade has something to cover. */
const LessonBody = () => (
    <div data-tier="fixture" className="space-y-3 p-3 text-sm">
        {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>Lesson paragraph {i + 1}. Layers accumulate; deleting a file later does not reclaim earlier space.</p>
        ))}
    </div>
)

/** LEAF prop `isLocked` — open vs faded locked tail. */
export const IsLocked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LockedContentMask"
                tier="composite"
                leaf="Prop `isLocked`"
                parts={[]}
                reason="position.md: absolute/relative belong to a named composite. Owns the paywall tail fade and select-none so ContentPage never writes those classes."
                states={[
                    {
                        name: "isLocked = false",
                        why: "Open lesson — body only, selection allowed.",
                        code: "<LockedContentMask body={LessonBody} />",
                        render: (
                            <div data-tier="fixture" className="max-w-md overflow-hidden rounded-3xl border border-default bg-surface">
                                <LockedContentMask body={LessonBody} />
                            </div>
                        ),
                    },
                    {
                        name: "isLocked = true",
                        why: "Paywalled — selection off, tail fades into the surface; body stays mounted.",
                        code: "<LockedContentMask isLocked body={LessonBody} />",
                        render: (
                            <div data-tier="fixture" className="max-w-md overflow-hidden rounded-3xl border border-default bg-surface">
                                <LockedContentMask isLocked body={LessonBody} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
