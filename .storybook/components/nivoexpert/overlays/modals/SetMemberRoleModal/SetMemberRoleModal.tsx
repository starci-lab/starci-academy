import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ChoiceRadioGroup, type ChoiceRadioOption } from "@sb-components/composites/form/ChoiceRadioGroup/ChoiceRadioGroup"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `SetMemberRoleModal` -- the blocking gate for picking a member's new role: a
 * radio group of the three roles, gated behind Save/Cancel. The pending pick is
 * controlled by the caller -- same pattern as `AiQuotaModal`'s `activeTab` -- so
 * the connected layer decides when it becomes the real `setMemberRole` mutation.
 */

/** A community member's role -- mirrors `MembersManager`'s `MemberRole` (kept local: OVERLAY-3, a modal may not import a block). */
export type MemberRole = "member" | "moderator" | "admin"

/** Props for {@link SetMemberRoleModal}. */
export interface SetMemberRoleModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler. Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The member's display name -- shown in the title. */
    memberName: string
    /** The pending role pick (controlled) -- the CALLER owns this, same as `AiQuotaModal`'s `activeTab` (Rule 7: the modal never picks its own value). */
    selectedRole: MemberRole
    /** Fired with the role the viewer just picked in the radio group. */
    onSelectedRoleChange: (role: MemberRole) => void
    /** Fired when Save is pressed -- the connected layer runs `setMemberRole(id, selectedRole)`. */
    onSave: () => void
    /** `true` while the mutation is in flight -- Save shows a spinner and both buttons lock. */
    isSaving?: boolean
    /** Already-resolved copy. */
    labels: SetMemberRoleModalLabels
}

/** Already-resolved copy the modal renders. */
export interface SetMemberRoleModalLabels {
    /** Heading above the radio group. */
    roleGroupLabel: string
    /** The three role labels, keyed by role. */
    roleLabels: Record<MemberRole, string>
    /** Save button label. */
    saveLabel: string
    /** Cancel button label. */
    cancelLabel: string
}

/** Fixed, block-owned title prefix -- real `src` appends the member's name, same convention `SubmissionAttemptsDrawer` uses for its count. */
const MODAL_TITLE = "Change role"

/** Fixed role order -- a 3-way choice, not caller-supplied ordering (§14d.1). */
const ROLE_ORDER: ReadonlyArray<MemberRole> = ["member", "moderator", "admin"]

/**
 * The role-change gate. See the file header for why the pending selection is
 * caller-controlled rather than internal state.
 *
 * @param props - {@link SetMemberRoleModalProps}
 */
const SetMemberRoleModal = ({
    isOpen,
    onOpenChange,
    memberName,
    selectedRole,
    onSelectedRoleChange,
    onSave,
    isSaving = false,
    labels,
}: SetMemberRoleModalProps) => {
    const roleOptions: Array<ChoiceRadioOption> = ROLE_ORDER.map((role) => ({ value: role, label: labels.roleLabels[role] }))

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`${MODAL_TITLE} · ${memberName}`}
                size="sm"
                body={() => (
                    <ChoiceRadioGroup
                        groupLabel={labels.roleGroupLabel}
                        value={selectedRole}
                        onValueChange={(value) => onSelectedRoleChange(value as MemberRole)}
                        options={roleOptions}
                        isDisabled={isSaving}
                    />
                )}
                footer={() => (
                    <StackH
                        gap={2}
                        justify="end"
                        items={[
                            () => <Button variant="secondary" size="sm" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isSaving} />,
                            () => <Button variant="primary" size="sm" label={labels.saveLabel} onPress={onSave} isPending={isSaving} />,
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { SetMemberRoleModal }
