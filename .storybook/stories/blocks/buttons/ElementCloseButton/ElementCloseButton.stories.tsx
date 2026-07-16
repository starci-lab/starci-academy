import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ElementCloseButton } from "@/components/blocks/buttons/ElementCloseButton"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Core/Button/ElementCloseButton",
    component: ElementCloseButton,
}
export default meta
type Story = StoryObj<typeof ElementCloseButton>

/** A strip of five tones side by side for a quick comparison: pick the tone that matches the semantic color of the surface being closed. */
export const AllTones: Story = {
    parameters: { usage: "A strip of five tones (neutral, accent, success, warning, danger) side by side for a quick comparison; pick the tone that matches the semantic color of the surface being closed." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        The default — when the host is a banner/panel that carries no semantic color.
                    </Typography>
                </div>
                <ElementCloseButton label="Close banner" onPress={() => {}} tone="neutral" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        When the host is an accent block/chip — the X follows the host's tone, it doesn't pick its own color.
                    </Typography>
                </div>
                <ElementCloseButton label="Close card" onPress={() => {}} tone="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        When the host is a success callout (done, saved).
                    </Typography>
                </div>
                <ElementCloseButton label="Close notification" onPress={() => {}} tone="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        When the host is a warning callout (needs attention, about to expire).
                    </Typography>
                </div>
                <ElementCloseButton label="Close warning" onPress={() => {}} tone="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        When the host is a danger callout (error, broken).
                    </Typography>
                </div>
                <ElementCloseButton label="Close error" onPress={() => {}} tone="danger" />
            </div>
        </div>
    ),
}
