import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { ConfirmDialog } from "./ConfirmDialog"

const meta: Meta<typeof ConfirmDialog> = {
    title: "Primitives/Feedback/ConfirmDialog",
    component: ConfirmDialog,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

/**
 * Controlled trigger wrapper — the button opens the dialog so its content shows
 * on the canvas (ConfirmDialog is an overlay). The dialog closes itself on
 * confirm/cancel via `onOpenChange`.
 */
const Demo = ({
    tone = "default",
    triggerLabel,
    title,
    description,
    confirmLabel,
}: {
    tone?: "default" | "danger"
    triggerLabel: string
    title: React.ReactNode
    description?: React.ReactNode
    confirmLabel?: string
}) => {
    const [isOpen, setOpen] = React.useState(false)
    return (
        <>
            <Button
                variant={tone === "danger" ? "danger" : "primary"}
                onPress={() => setOpen(true)}
            >
                {triggerLabel}
            </Button>
            <ConfirmDialog
                isOpen={isOpen}
                onOpenChange={setOpen}
                tone={tone}
                title={title}
                description={description}
                confirmLabel={confirmLabel}
                onConfirm={() => setOpen(false)}
            />
        </>
    )
}

/** Regular confirmation: default tone, primary confirm button — for a non-destructive choice. */
export const DefaultConfirm: Story = {
    render: () => (
        <div className="p-8">
            <Demo
                triggerLabel="Submit test"
                title="Submit this test?"
                description="Once submitted, you can't edit your answers until the results are graded."
                confirmLabel="Submit"
            />
        </div>
    ),
}

/** Destructive confirmation: `tone="danger"`, danger confirm button — for delete / undo. */
export const DestructiveDelete: Story = {
    render: () => (
        <div className="p-8">
            <Demo
                tone="danger"
                triggerLabel="Delete submission"
                title="Delete this submission?"
                description="The submission will be permanently deleted and cannot be recovered."
                confirmLabel="Delete submission"
            />
        </div>
    ),
}

/** In-flight async: `isConfirming` — the confirm button shows a spinner and both buttons block. Rendered open. */
export const Confirming: Story = {
    render: () => (
        <div className="p-8">
            <ConfirmDialog
                isOpen
                onOpenChange={() => {}}
                tone="danger"
                title="Deleting submission…"
                description="The submission is being permanently deleted."
                confirmLabel="Delete submission"
                isConfirming
                onConfirm={() => {}}
            />
        </div>
    ),
}
