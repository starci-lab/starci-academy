import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    NewTicketModal,
    type NewTicketModalLabels,
} from "@sb-components/nivo/blocks/support/NewTicketModal/NewTicketModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NewTicketModal` — overlay modal that opens a new support ticket: a subject
 * line plus the opening message body, handed off as one new
 * `SupportTicketEntity` and its first `TicketMessageEntity`. Never mounted by
 * `SupportView` itself (a page may import blocks/composites/frames, never an
 * overlay) — the route shell above the page owns when this is on screen.
 */
const meta: Meta<typeof NewTicketModal> = {
    title: "Nivo/Blocks/Support/NewTicketModal/NewTicketModal",
    component: NewTicketModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NewTicketModal>

const LABELS: NewTicketModalLabels = {
    title: "Open a support ticket",
    subjectLabel: "Subject",
    subjectPlaceholder: "Briefly describe the issue",
    bodyLabel: "Details",
    bodyPlaceholder: "What happened, and what did you expect instead?",
    cancelLabel: "Cancel",
    submitLabel: "Send request",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    InputText: { tier: "atom", role: "the ticket subject" },
    InputTextarea: { tier: "atom", role: "the opening message body" },
    Button: { tier: "atom", role: "cancel (ghost) and send request (primary, busy while creating, disabled until both fields are filled)" },
}

/** Shared controlled wrapper — one `isOpen`/field state feeds every leaf state below. */
const ControlledNewTicketModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        subject,
        onSubjectChange: setSubject,
        body,
        onBodyChange: setBody,
        onSubmit: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open a support ticket" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="NewTicketModal"
                tier="block"
                leaf="Open a ticket"
                annotate={ANNOTATE}
                reason="A presentational overlay modal that only collects a subject and an opening message — it never mounts inside `SupportView` itself, since a page may import blocks/composites/frames but never an overlay. Submit stays disabled until both fields carry text, so a ticket is never opened with nothing to read."
                states={[
                    {
                        name: "subject = \"\", body = \"\" (submit disabled)",
                        why: "Neither field has text yet — submit stays disabled so an empty ticket can never be sent.",
                        code: `<NewTicketModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  subject=""
  onSubjectChange={setSubject}
  body=""
  onBodyChange={setBody}
  onSubmit={create}
  labels={labels}
/>`,
                        render: <NewTicketModal {...base} />,
                    },
                    {
                        name: "both fields filled in",
                        why: "Once a subject and a body are both entered, submit lights up and creates the ticket.",
                        code: "<NewTicketModal subject=\"Custom domain won't verify\" body=\"...\" … />",
                        render: (
                            <NewTicketModal
                                {...base}
                                subject="Custom domain won't verify"
                                onSubjectChange={() => {}}
                                body="I've pointed the CNAME as instructed but the site still shows unverified after an hour."
                                onBodyChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The create mutation is in flight — both fields lock and the submit button shows its busy state so the user can't double-send the same ticket.",
                        code: "<NewTicketModal isSubmitting … />",
                        render: (
                            <NewTicketModal
                                {...base}
                                subject="Custom domain won't verify"
                                onSubjectChange={() => {}}
                                body="I've pointed the CNAME as instructed but the site still shows unverified after an hour."
                                onBodyChange={() => {}}
                                isSubmitting
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch hasn't resolved yet, so both the subject and the body fields shimmer together.",
                        code: "<NewTicketModal isSkeleton … />",
                        render: <NewTicketModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All four states (disabled, filled, submitting, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledNewTicketModal />,
}
