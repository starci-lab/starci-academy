import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ConfirmDialog } from "@/components/blocks/feedback/ConfirmDialog"
import { Controlled } from "./components"

/**
 * `ConfirmDialog` — a confirmation dialog for irreversible actions (cancel
 * enrollment, delete a submission) built on HeroUI `AlertDialog`. Controlled:
 * `isOpen` + `onOpenChange` are held by the call-site. `tone="danger"` turns the
 * confirm button into a destructive button (variant `danger`) for delete/undo.
 * Tier-3, purely presentational — the confirm button does NOT close the dialog
 * itself; the call-site closes it via `onOpenChange` after the action completes
 * (async keeps the dialog open via `isConfirming`).
 */
const meta: Meta<typeof ConfirmDialog> = {
    title: "Overlays/ConfirmDialog",
    component: ConfirmDialog,
}
export default meta
type Story = StoryObj<typeof ConfirmDialog>

/** Regular confirmation: default tone, primary confirm button — for a non-destructive choice. */
export const DefaultConfirm: Story = {
    parameters: {
        usage:
            "Regular confirmation (non-destructive) — `tone=\"default\"`, the confirm button is primary. Use when you need " +
            "to lock in an important but still reversible choice. `title` is a short question, `description` spells out " +
            "what will happen. The confirm button does not close the dialog itself — the call-site closes it via `onOpenChange` after handling.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Regular confirmation</Label>
                <Typography type="body-sm" color="muted">
                    Click the button to open the dialog — an important but non-destructive choice.
                </Typography>
            </div>
            <Controlled
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
    parameters: {
        usage:
            "Destructive action (delete / irreversible undo) — `tone=\"danger\"` turns the confirm button into the " +
            "`danger` variant and the icon red. `description` must spell out the CONSEQUENCE (\"cannot be recovered\") so the " +
            "choice is informed. For async, pass `isConfirming` so the button shows a spinner and blocks repeat clicks.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Destructive confirmation</Label>
                <Typography type="body-sm" color="muted">
                    Click the button to open the dialog — a permanent delete, with a red confirm button.
                </Typography>
            </div>
            <Controlled
                tone="danger"
                triggerLabel="Delete submission"
                title="Delete this submission?"
                description="The submission will be permanently deleted and cannot be recovered."
                confirmLabel="Delete submission"
            />
        </div>
    ),
}
