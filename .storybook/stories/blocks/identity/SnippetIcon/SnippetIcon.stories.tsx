import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, userEvent, waitFor } from "storybook/test"
import { Typography } from "@heroui/react"
import { SnippetIcon } from "./SnippetIcon"

const meta: Meta<typeof SnippetIcon> = {
    title: "Primitives/Identity/SnippetIcon",
    component: SnippetIcon,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SnippetIcon>

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                <Typography type="body-sm" className="font-mono">
                    npm install @starciacademy/playground-agent
                </Typography>
                <SnippetIcon copyString="npm install @starciacademy/playground-agent" />
            </div>
        </div>
    ),
}

export const CustomIconColors: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                <Typography type="body-sm" className="font-mono">
                    sk-live-51H8x2KJ9mQwErTyUiOp
                </Typography>
                <SnippetIcon
                    copyString="sk-live-51H8x2KJ9mQwErTyUiOp"
                    classNames={{ copyIcon: "text-accent", checkIcon: "text-success" }}
                />
            </div>
        </div>
    ),
}

export const Copied: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                <Typography type="body-sm" className="font-mono">
                    git clone https://github.com/StarCi-Academy/rag-from-scratch
                </Typography>
                <SnippetIcon
                    copyString="git clone https://github.com/StarCi-Academy/rag-from-scratch"
                    className="copy-trigger"
                    classNames={{ checkIcon: "check-icon" }}
                />
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const trigger = canvasElement.querySelector(".copy-trigger") as HTMLElement
        await userEvent.click(trigger)
        await waitFor(() => expect(canvasElement.querySelector(".check-icon")).toBeInTheDocument())
    },
}
