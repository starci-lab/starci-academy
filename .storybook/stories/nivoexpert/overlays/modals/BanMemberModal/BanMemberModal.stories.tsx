import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    BanMemberModal,
    type BanMemberModalLabels,
    type BanMemberModalProps,
} from "@sb-components/nivoexpert/overlays/modals/BanMemberModal/BanMemberModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `BanMemberModal` — the danger gate for banning a community member: a warning
 * callout naming the consequence, a required audit-reason field, and a red
 * Confirm disabled until a reason is entered. Confirm does NOT close the modal
 * itself (same rule `ConfirmDialog` follows) — the caller closes it via
 * `onOpenChange` once `setMemberStatus` resolves, keeping it open (`isBanning`)
 * while the mutation is in flight.
 */
const meta: Meta<typeof BanMemberModal> = {
    title: "NivoExpert/Overlays/Modals/BanMemberModal/BanMemberModal",
    component: BanMemberModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof BanMemberModal>

const LABELS: BanMemberModalLabels = {
    reasonFieldLabel: "Reason (written to the audit log)",
    reasonPlaceholder: "e.g. Repeated spam in the community feed",
    cancelLabel: "Cancel",
    confirmLabel: "Ban member",
}

// Real DOM (size="sm"): Modal.CloseTrigger + Modal.Header > StackV(title) >
// Typography + Modal.Body > StackV > Callout(status=danger) > Alert + InputTextarea
// > FieldFrame > HeroTextField > HeroTextArea + Modal.Footer > StackH > Button[×2].
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "the modal's title — \"Ban member? · <member name>\"", storyId: "atoms-text-typography-typography--overview" },
    "StackV": { tier: "frame", role: "the vertical track holding the warning callout above the reason field", storyId: "frames-stack-stackv--default" },
    "Callout": { tier: "composite", role: "the danger-toned warning naming the consequence of banning", storyId: "composites-feedback-callout-callout--statuses" },
    "InputTextarea": { tier: "atom", role: "the required audit-reason field — Confirm stays disabled while it's empty", storyId: "atoms-forms-input-inputtextarea--default" },
    "StackH": { tier: "frame", role: "the footer's Cancel/Confirm button row", storyId: "frames-stack-stackh--default" },
    "Button": { tier: "atom", role: "Cancel and the red Confirm — Confirm runs `setMemberStatus` with the audit reason and shows a spinner while banning", storyId: "atoms-buttons-button-button--tones" },
}

/** Controlled wrapper — open on mount, the reason text is real state, the trigger reopens after a close. */
const ControlledBanMemberModal = ({
    triggerLabel,
    initialReason = "",
    ...modalProps
}: {
    triggerLabel: string
    initialReason?: string
} & Omit<BanMemberModalProps, "isOpen" | "onOpenChange" | "reason" | "onReasonChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    const [reason, setReason] = useState(initialReason)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"

                onPress={() => setIsOpen(true)}
            />
            <BanMemberModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                reason={reason}
                onReasonChange={setReason}
                {...modalProps}
            />
        </div>
    )
}

/** ONE LEAF. The wrapper shape never changes; the reason text and `isBanning` only vary the CONTENT inside it. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="BanMemberModal"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A danger gate with one required field: an audit reason, written to the log alongside the ban. Confirm is disabled until the reason is non-empty AND stays open on press — the caller closes it through `onOpenChange` only once `setMemberStatus` resolves, so `isBanning` keeps the dialog up (spinner on Confirm, both buttons and the field locked) while the mutation is in flight."
            states={[
                {
                    name: "reason empty — Confirm disabled",
                    why: "The gate a viewer sees right after opening: no audit reason typed yet, so Confirm is disabled — banning cannot proceed without one.",
                    code: `<BanMemberModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  memberName="Le Vy"
  reason=""
  onReasonChange={setReason}
  onConfirm={ban}
  labels={labels}
/>`,
                    render: (
                        <ControlledBanMemberModal
                            triggerLabel="Open — reason empty"
                            memberName="Le Vy"
                            onConfirm={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "reason entered — Confirm enabled",
                    why: "Once the viewer types a reason, Confirm turns pressable — the exact text typed here is what lands in the audit log.",
                    code: "<BanMemberModal reason=\"Repeated spam in the community feed\" … />",
                    render: (
                        <ControlledBanMemberModal
                            triggerLabel="Open — reason entered"
                            initialReason="Repeated spam in the community feed, three warnings given."
                            memberName="Le Vy"
                            onConfirm={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "isBanning = true",
                    why: "Confirm was just pressed — the `setMemberStatus` mutation is in flight, so Confirm shows a spinner and Cancel plus the reason field lock. The modal stays open until the caller closes it.",
                    code: "<BanMemberModal isBanning … />",
                    render: (
                        <ControlledBanMemberModal
                            triggerLabel="Open — banning"
                            initialReason="Repeated spam in the community feed, three warnings given."
                            memberName="Le Vy"
                            onConfirm={() => {}}
                            isBanning
                            labels={LABELS}
                        />
                    ),
                },
            ]}
        />
    ),
}
