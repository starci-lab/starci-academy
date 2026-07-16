import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd, Label, Typography } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { InputButtonLike } from "@/components/blocks/buttons/InputButtonLike"

const meta: Meta<typeof InputButtonLike> = {
    title: "Blocks/Form/InputButtonLike",
    component: InputButtonLike,
}
export default meta
type Story = StoryObj<typeof InputButtonLike>

/** Use when you need a field that looks like an input but is actually a button that opens an overlay, for example opening a global search dialog. */
export const Default: Story = {
    parameters: { usage: "Use when you need a field that looks like an input but is actually a button that opens an overlay, for example opening a global search dialog." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    You need a field that LOOKS like an input but is actually a button that opens an overlay. You can't type into it — if you need real typing, use Input.
                </Typography>
            </div>
            <InputButtonLike
                placeholder="Search courses..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Add a muted magnifying-glass icon in front when this field plays the role of a search box, so users recognize the function right away. */
export const WithIcon: Story = {
    parameters: { usage: "Add a muted magnifying-glass icon in front when this field plays the role of a search box, so users recognize the function right away." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With icon</Label>
                <Typography type="body-sm" color="muted">
                    A field acting as search — the magnifying-glass icon lets users recognize the function before they even read the text.
                </Typography>
            </div>
            <InputButtonLike
                icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                placeholder="Search courses, lessons..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Attach a keyboard-shortcut hint (Kbd) on the right edge when the overlay can be opened quickly from the keyboard, for example Cmd K for global search. */
export const WithShortcutSuffix: Story = {
    parameters: { usage: "Attach a keyboard-shortcut hint (Kbd) on the right edge when the overlay can be opened quickly from the keyboard, for example Cmd K for global search." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With shortcut hint</Label>
                <Typography type="body-sm" color="muted">
                    The overlay can be opened from the keyboard — the Kbd on the right edge teaches the shortcut right there, instead of making users hunt for it.
                </Typography>
            </div>
            <InputButtonLike
                icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                placeholder="Quick search..."
                suffix={(
                    <Kbd>
                        <Kbd.Content>⌘K</Kbd.Content>
                    </Kbd>
                )}
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** When the placeholder label is longer than the allowed width, the text truncates to a single line instead of breaking the layout. */
export const LongPlaceholderTruncates: Story = {
    parameters: { usage: "When the placeholder label is longer than the allowed width, the text truncates to a single line instead of breaking the layout." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long placeholder truncates</Label>
                <Typography type="body-sm" color="muted">
                    Checking a placeholder longer than the allowed width: it truncates to a single line instead of breaking the layout.
                </Typography>
            </div>
            <InputButtonLike
                icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                placeholder="Search Fullstack, System Design, DevOps courses and much more..."
                onPress={() => {}}
                className="w-64"
            />
        </div>
    ),
}
