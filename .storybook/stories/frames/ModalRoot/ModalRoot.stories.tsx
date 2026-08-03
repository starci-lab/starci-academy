import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModalRoot } from "@sb-components/frames/ModalRoot/ModalRoot"

/**
 * `ModalRoot` — the identity root of a modal-tier component. It emits
 * `data-tier="modal"` and the caller's `data-component`, the modal-side twin of
 * `DrawerRoot`: a frame standing in for the modal's own root element so the raw
 * identity `<div>` is written ONCE here rather than in every modal.
 */
const meta: Meta<typeof ModalRoot> = {
    title: "Frames/ModalRoot/ModalRoot",
    component: ModalRoot,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ModalRoot>

/** Default — a modal root carrying the caller's `data-component`, wrapping a placeholder child. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ModalRoot data-component="ExampleModal">
                <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-4 text-sm text-foreground">
                    Placeholder modal content
                </div>
            </ModalRoot>
        </div>
    ),
}
