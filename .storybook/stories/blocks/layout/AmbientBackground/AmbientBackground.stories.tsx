import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { AmbientBackground } from "@/components/blocks/layout/AmbientBackground"
import { BackgroundEffect } from "@/modules/types/enums/background-effect"
import { PREVIEW_CLASS, effects } from "./components"

const meta: Meta<typeof AmbientBackground> = {
    title: "Core/Layout/AmbientBackground",
    component: AmbientBackground,
}
export default meta
type Story = StoryObj<typeof AmbientBackground>

/** A comparison table of all 9 background effects the user picks in Settings → Appearance — use it to weigh motion level and particle density across the options, especially to see which effects still run when the user enables reduced motion (5 of the 9 turn off entirely). Each cell is a preview anchored to its frame, exactly like the Appearance page: the block is natively `fixed inset-0 -z-10` covering the whole shell, so it has to be overridden with `absolute inset-0 -z-0` to be visible inside a small frame. */
export const AllEffects: Story = {
    parameters: { usage: "A comparison table of all 9 background effects the user picks in Settings → Appearance — use it to weigh motion level and particle density across the options, especially to see which effects still run when the user enables reduced motion (5 of the 9 turn off entirely). Each cell is a preview anchored to its frame, exactly like the Appearance page: the block is natively `fixed inset-0 -z-10` covering the whole shell, so it has to be overridden with `absolute inset-0 -z-0` to be visible inside a small frame." },
    render: () => (
        <div className="flex flex-col gap-6">
            {effects.map(({ effect, label, when }) => (
                <div key={effect} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{label}</Label>
                        <Typography type="body-sm" color="muted">
                            {when}
                        </Typography>
                    </div>
                    <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                        <AmbientBackground effect={effect} className={PREVIEW_CLASS} />
                    </div>
                </div>
            ))}
        </div>
    ),
}

/** The system default, and also the choice when the user turns off all effects — use it to confirm the block returns null rather than painting a transparent layer over the page background. */
export const None: Story = {
    name: "None",
    parameters: { usage: "The system default, and also the choice when the user turns off all effects — use it to confirm the block returns null rather than painting a transparent layer over the page background." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>None</Label>
                <Typography type="body-sm" color="muted">
                    the state when the effect is None: the frame below must be completely empty, no glow, no overlay — seeing anything at all means the block is painting extra layers over the page background.
                </Typography>
            </div>
            <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                <AmbientBackground effect={BackgroundEffect.None} className={PREVIEW_CLASS} />
            </div>
        </div>
    ),
}
