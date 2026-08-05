import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ConfirmDialog } from "@sb-components/composites/feedback/ConfirmDialog/ConfirmDialog"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConfirmDialog` — a blocking dialog shell for an irreversible action (unenroll, delete a
 * submission). Builds Header/Body/Footer; content goes through `title`/`description` + the two
 * button labels, not `children`. Purely presentational: `isOpen` and every callback come via
 * props. The Confirm button does not close the dialog — the caller closes it through
 * `onOpenChange` once the action finishes, so `isConfirming` keeps it open while waiting.
 */
const meta: Meta<typeof ConfirmDialog> = {
    title: "Composites/Feedback/ConfirmDialog",
    component: ConfirmDialog,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

/**
 * The real tree: every level of the shell is a HEROUI component (`AlertDialog.*`,
 * tier `heroui`, no `storyId` — we have no story of our own to point to). The
 * nodes WITH their own story to jump to are `Typography` (the description) and
 * `Button` (the two buttons, built by `ButtonGroup`).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "AlertDialog.Backdrop": { tier: "heroui", role: "the modal overlay/backdrop." },
    "AlertDialog.Container": { tier: "heroui", role: "sizes and places the dialog (`size=\"sm\"`)." },
    "AlertDialog.Dialog": { tier: "heroui", role: "the dialog surface itself." },
    "AlertDialog.Header": { tier: "heroui", role: "wraps the heading." },
    "AlertDialog.Heading": { tier: "heroui", role: "the question text (`title`)." },
    "AlertDialog.Body": { tier: "heroui", role: "wraps the consequence line — only when `description` is set." },
    "Typography": {
        tier: "atom",
        role: "the consequence sentence under the question",
        storyId: "atoms-text-typography-typography--colors",
    },
    "AlertDialog.Footer": { tier: "heroui", role: "wraps the button row." },
    "Button": {
        tier: "atom",
        role: "Cancel (secondary) plus Confirm (primary or danger), right-aligned — built by `ButtonGroup`, which is not itself a DOM node.",
        storyId: "atoms-buttons-button-button--variants",
    },
}

/**
 * Controlled trigger wrapper — a button that opens the dialog so its content
 * shows up on the canvas (ConfirmDialog is an overlay). The dialog closes
 * itself on Cancel / Confirm via `onOpenChange`.
 */
type DemoProps = {
    tone?: "default" | "danger"
    triggerLabel: string
    title: string
    description?: string
    confirmLabel?: string
}
const Demo = ({
    tone = "default",
    triggerLabel,
    title,
    description,
    confirmLabel,
}: DemoProps) => {
    const [isOpen, setOpen] = React.useState(false)
    return (
        <>
            <Button
                label={triggerLabel}
                variant={tone === "danger" ? "danger" : "primary"}
                onPress={() => setOpen(true)}
            />
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

/** A regular confirm: default tone, the Confirm button is primary — a choice that destroys nothing. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConfirmDialog"
                tier="composite"
                leaf="Default"
                annotate={ANNOTATE}
                reason="The blocking frame: an irreversible action must pause on the same shape everywhere, the question in the Header, the consequence in the Body, and the two ways out in the Footer. Press the trigger to open; the anatomy panel measures the dialog body once it is open."
                states={[
                    {
                        name: "tone = \"default\", description set",
                        why: "The dialog shows a Header question, a Body consequence sentence, and a Footer with Cancel and a primary Confirm button. This tone is for a choice that does not destroy anything, which is why Confirm stays primary rather than danger.",
                        code: `<ConfirmDialog
    isOpen={isOpen}
    onOpenChange={setOpen}
    title="Submit this quiz?"
    description="Once submitted, you won't be able to change your answers until results are in."
    confirmLabel="Submit"
    onConfirm={submit}
/>`,
                        render: (
                            <Demo
                                triggerLabel="Submit"
                                title="Submit this quiz?"
                                description="Once submitted, you won't be able to change your answers until results are in."
                                confirmLabel="Submit"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `tone="danger"` — delete / undo: the Confirm button switches to danger, the composition doesn't change. */
export const Danger: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConfirmDialog"
                tier="composite"
                leaf="Danger"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "tone = \"danger\"",
                        why: "Only the Confirm button's variant swaps to danger, while Header, Body, and Footer keep the exact same composition as the Default leaf. This tone is for deletes and undo actions, where the button's colour is the one signal that this choice cannot be walked back.",
                        code: `<ConfirmDialog
    tone="danger"
    title="Delete this submission?"
    confirmLabel="Delete submission"
    …
/>`,
                        render: (
                            <Demo
                                tone="danger"
                                triggerLabel="Delete submission"
                                title="Delete this submission?"
                                description="The submission will be permanently deleted and cannot be recovered."
                                confirmLabel="Delete submission"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Edge case: no `description` → Body disappears, the shell keeps only Header + Footer. */
export const TitleOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConfirmDialog"
                tier="composite"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "description not set",
                        why: "The Body node disappears entirely, leaving only the Header question and the Footer buttons, with no empty gap left where the Body would have been. Drop description only when the consequence is already obvious from the question alone.",
                        code: `<ConfirmDialog
    isOpen
    title="Leave this practice session?"
    confirmLabel="Leave"
    …
/>`,
                        render: (
                            <ConfirmDialog
                                isOpen
                                onOpenChange={() => {}}
                                title="Leave this practice session?"
                                confirmLabel="Leave"
                                onConfirm={() => {}}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `isConfirming` — the action is running: the Confirm button spins, the Cancel button locks, the dialog stays open. */
export const Confirming: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConfirmDialog"
                tier="composite"
                leaf="Confirming"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isConfirming = true, tone = \"danger\"",
                        why: "Both Footer buttons still render, but Confirm turns pending with its own spinner and Cancel becomes disabled, while the dialog stays open rather than auto-closing. Keeping the dialog open during the async action is what lets isConfirming show the reader their delete is actually in flight.",
                        code: `<ConfirmDialog
    isOpen
    isConfirming
    tone="danger"
    title="Deleting submission…"
    …
/>`,
                        render: (
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
                        ),
                    },
                ]}
            />
        </div>
    ),
}
