import type { Meta, StoryObj } from "@storybook/nextjs"
import { AlertDialogRoot } from "@sb-components/atoms/feedback/AlertDialog/AlertDialog"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof AlertDialogRoot> = {
    title: "Atoms/Feedback/AlertDialogRoot/AlertDialogRoot",
    component: AlertDialogRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AlertDialogRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AlertDialogRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<AlertDialogRoot />",
                    render: (<AlertDialogRoot isOpen={false} onOpenChange={() => {}}><span data-tier="fixture">closed</span></AlertDialogRoot>),
                }]}
            />
        </div>
    ),
}
