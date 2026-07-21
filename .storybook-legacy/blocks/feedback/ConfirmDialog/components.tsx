import React from "react"
import { Button } from "@heroui/react"
import { ConfirmDialog } from "@/components/blocks/feedback/ConfirmDialog"

/** Controlled wrapper for the demo — the button opens the dialog, which closes itself on confirm/cancel. */
export const Controlled = ({
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
