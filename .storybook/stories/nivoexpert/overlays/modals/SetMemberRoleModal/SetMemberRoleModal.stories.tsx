import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    SetMemberRoleModal,
    type MemberRole,
    type SetMemberRoleModalLabels,
    type SetMemberRoleModalProps,
} from "@sb-components/nivoexpert/overlays/modals/SetMemberRoleModal/SetMemberRoleModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SetMemberRoleModal` — the blocking gate for picking a member's new role: a
 * radio group of the three roles, gated behind Save/Cancel. The pending pick is
 * controlled by the caller — same pattern as `AiQuotaModal`'s `activeTab` — so
 * the connected layer decides when it becomes the real `setMemberRole` mutation.
 */
const meta: Meta<typeof SetMemberRoleModal> = {
    title: "NivoExpert/Overlays/Modals/SetMemberRoleModal/SetMemberRoleModal",
    component: SetMemberRoleModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SetMemberRoleModal>

const LABELS: SetMemberRoleModalLabels = {
    roleGroupLabel: "Role",
    roleLabels: { member: "Member", moderator: "Moderator", admin: "Admin" },
    saveLabel: "Save role",
    cancelLabel: "Cancel",
}

// Real DOM (size="sm"): Modal.CloseTrigger + Modal.Header > StackV(title) >
// Typography + Modal.Body > ChoiceRadioGroup > FieldFrame > HeroRadioGroup >
// ChoiceRadio[×3] + Modal.Footer > StackH > Button[×2].
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "the modal's title — \"Change role · <member name>\"", storyId: "atoms-text-typography-typography--overview" },
    "ChoiceRadioGroup": { tier: "composite", role: "the three-way role choice, controlled by the caller's `selectedRole`", storyId: "composites-form-choiceradiogroup-choiceradiogroup--default" },
    "StackH": { tier: "frame", role: "the footer's Cancel/Save button row", storyId: "frames-stack-stackh--default" },
    "Button": { tier: "atom", role: "Cancel and Save — Save runs `setMemberRole` and shows a spinner while saving", storyId: "atoms-buttons-button-button--default" },
}

/** Controlled wrapper — open on mount, the radio selection is real state, the trigger reopens after a close. */
const ControlledSetMemberRoleModal = ({
    triggerLabel,
    initialRole,
    ...modalProps
}: {
    triggerLabel: string
    initialRole: MemberRole
} & Omit<SetMemberRoleModalProps, "isOpen" | "onOpenChange" | "selectedRole" | "onSelectedRoleChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedRole, setSelectedRole] = useState<MemberRole>(initialRole)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"

                onPress={() => setIsOpen(true)}
            />
            <SetMemberRoleModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                selectedRole={selectedRole}
                onSelectedRoleChange={setSelectedRole}
                {...modalProps}
            />
        </div>
    )
}

/** ONE LEAF. The wrapper shape never changes; `selectedRole`/`isSaving` only vary the CONTENT inside it. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="SetMemberRoleModal"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A blocking gate over one decision — which of the three roles a member holds. The modal owns the fixed role order and its title text; the CALLER owns the pending selection (`selectedRole`/`onSelectedRoleChange`), so nothing here decides on its own when a pick becomes the real mutation — only pressing Save does, via `onSave`."
            states={[
                {
                    name: "editing — currently \"Moderator\"",
                    why: "The common case: a member already holding a role, the radio group opened on their current value so the change reads as a delta, not a fresh pick.",
                    code: `<SetMemberRoleModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  memberName="Hoang Nam"
  selectedRole={selectedRole}
  onSelectedRoleChange={setSelectedRole}
  onSave={saveRole}
  labels={labels}
/>`,
                    render: (
                        <ControlledSetMemberRoleModal
                            triggerLabel="Open — editing Moderator"
                            initialRole="moderator"
                            memberName="Hoang Nam"
                            onSave={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "isSaving = true",
                    why: "Save was just pressed — the `setMemberRole` mutation is in flight, so Save shows a spinner and both buttons (plus the radio group) lock until it resolves.",
                    code: "<SetMemberRoleModal isSaving … />",
                    render: (
                        <ControlledSetMemberRoleModal
                            triggerLabel="Open — saving"
                            initialRole="member"
                            memberName="Quoc Bao"
                            onSave={() => {}}
                            isSaving
                            labels={LABELS}
                        />
                    ),
                },
            ]}
        />
    ),
}
