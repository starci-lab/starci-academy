import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { PaperclipIcon } from "@phosphor-icons/react"
import { Composer } from "@/components/blocks/feed/Composer"
import { Controlled } from "./components"

const meta: Meta<typeof Composer> = {
    title: "Blocks/Feed/Composer",
    component: Composer,
}
export default meta
type Story = StoryObj<typeof Composer>

/** Use when the composer is still empty: the Send button is disabled until there's content, preventing empty sends. */
export const Empty: Story = {
    parameters: { usage: "Use for the composer's initial state: with nothing typed the Send button is locked, and only enables once you type. Ctrl/Cmd+Enter also sends once there's content." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Empty composer</Label>
                <Typography type="body-sm" color="muted">
                    With no content the Send button is disabled; type any character and the button enables again.
                </Typography>
            </div>
            <Controlled initialValue="" />
        </div>
    ),
}

/** Use when the viewer is mid-way through typing a multi-line message: the field auto-grows with the content, the Send button is enabled. */
export const Typing: Story = {
    parameters: { usage: "Use when there's already draft content: the Send button is enabled and the field auto-grows in height with the number of lines instead of scrolling internally. The attachment slot sits before the Send button." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Typing</Label>
                <Typography type="body-sm" color="muted">
                    With multi-line content: the textarea grows to fit exactly, the Send button is ready, and there's an attachment button in the action cluster.
                </Typography>
            </div>
            <Controlled
                initialValue={"I have a question about the data denormalization part of this week's lesson.\nI'm not sure when I should split the table out."}
                attachSlot={(
                    <Button size="sm" variant="tertiary" isIconOnly aria-label="Attach">
                        <PaperclipIcon aria-hidden focusable="false" className="size-4" />
                    </Button>
                )}
            />
        </div>
    ),
}

/** Use while a message is being sent: the Send button shows a spinner and is locked, and Ctrl/Cmd+Enter is also blocked to prevent duplicate sends. */
export const Submitting: Story = {
    parameters: { usage: "Use while a send is in flight: the Send button switches to a spinner and is disabled, and the Ctrl/Cmd+Enter shortcut is ignored to prevent duplicate sends." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Sending</Label>
                <Typography type="body-sm" color="muted">
                    While sending, the button turns into a spinner and locks; the user can't click or use the shortcut to send again.
                </Typography>
            </div>
            <Controlled initialValue="I'll send this question, thank you." isSubmitting />
        </div>
    ),
}
