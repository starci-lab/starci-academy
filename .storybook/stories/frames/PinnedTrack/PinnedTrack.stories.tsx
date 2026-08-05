import type { Meta, StoryObj } from "@storybook/nextjs"
import { PinnedTrack } from "@sb-components/frames/PinnedTrack/PinnedTrack"

const meta: Meta<typeof PinnedTrack> = {
    title: "Frames/PinnedTrack/PinnedTrack",
    component: PinnedTrack,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PinnedTrack>

/** Pin-then-fill track -- `pinned` sticks to the top, `body` fills the rest. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="h-80 overflow-auto border border-default">
            <PinnedTrack
                pinned={() => (
                    <div data-tier="fixture" className="bg-surface p-3 text-sm text-foreground shadow-surface">
                        Pinned header
                    </div>
                )}
                body={() => (
                    <div data-tier="fixture" className="p-3 text-sm text-foreground">
                        Scrollable body that fills the remaining height of the track.
                    </div>
                )}
            />
        </div>
    ),
}
