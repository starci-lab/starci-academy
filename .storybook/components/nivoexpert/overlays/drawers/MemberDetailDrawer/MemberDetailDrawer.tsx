import type { ReactNode } from "react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Button, type ButtonBaseProps } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MemberDetailDrawer` — the read view over one community member: identity (via
 * the shell's own title/description), a few key/value rows, and the two actions
 * that hand off to the sibling overlays in this set — "Change role" opens
 * `SetMemberRoleModal`, "Ban member" opens `BanMemberModal`. The drawer never runs
 * a mutation itself; "Unban member" is the one direct action, since reversing a
 * ban needs no audit reason.
 */

/** A community member's role — mirrors `MembersManager`'s `MemberRole` (kept local: OVERLAY-3, a drawer may not import a block). */
export type MemberRole = "member" | "moderator" | "admin"

/** Whether a member can participate — mirrors `MembersManager`'s `MemberStatus`. */
export type MemberStatus = "active" | "banned"

/** A member's current/most-recent course and how far they are through it. */
export interface MemberCourseProgress {
    /** Course display name. */
    courseName: string
    /** Completion percent, 0-100. */
    percent: number
}

/** Props for {@link MemberDetailDrawer}. */
export interface MemberDetailDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** Display name — rendered as the shell's title. */
    name: string
    /** Email — rendered as the shell's description, under the name. */
    email: string
    /** Role in the community. */
    role: MemberRole
    /** Active or banned. */
    status: MemberStatus
    /** Current course + completion percent. `null` → not enrolled in any course yet. */
    courseProgress: MemberCourseProgress | null
    /** Already-formatted join date (e.g. "12 Jul 2026") — date formatting is the connected layer's job. */
    joinedLabel: string
    /** How many courses this member has purchased access to. */
    purchasedCourseCount: number
    /** Opens `SetMemberRoleModal` for this member — the connected layer owns the transition. */
    onChangeRole: () => void
    /** Opens `BanMemberModal` for this member (active members only) — the connected layer owns the transition. */
    onBan: () => void
    /** Reverses a ban directly — the connected layer runs `setMemberStatus(id, "active")`. No audit reason needed to restore access. */
    onUnban: () => void
    /** `true` while a mutation for this member is in flight — locks both footer actions. */
    isBusy?: boolean
    /** Which edge the panel slides in from. @default "right" */
    placement?: "top" | "bottom" | "left" | "right"
    /** Already-resolved copy. */
    labels: MemberDetailDrawerLabels
}

/** Already-resolved copy the drawer renders. */
export interface MemberDetailDrawerLabels {
    /** Row label for the role field. */
    roleFieldLabel: string
    /** Row label for the status field. */
    statusFieldLabel: string
    /** Row label for the course-progress field. */
    progressFieldLabel: string
    /** Row label for the joined-date field. */
    joinedFieldLabel: string
    /** Row label for the purchased-courses field. */
    purchasedFieldLabel: string
    /** Progress-row copy for a member with no course yet. */
    notEnrolledLabel: string
    /** The three role labels, keyed by role. */
    roleLabels: Record<MemberRole, string>
    /** The two status labels, keyed by status. */
    statusLabels: Record<MemberStatus, string>
    /** "Change role" button label. */
    changeRoleLabel: string
    /** "Ban member" button label (shown for an active member). */
    banLabel: string
    /** "Unban member" button label (shown for a banned member). */
    unbanLabel: string
}

/** Status → chip tone. Active reads healthy, banned reads a failure. */
const STATUS_TONE: Record<MemberStatus, ChipTone> = { active: "success", banned: "danger" }

/** Role → chip tone. Admin reads elevated, the rest read neutral. */
const ROLE_TONE: Record<MemberRole, ChipTone> = { admin: "accent", moderator: "default", member: "default" }

/** One label/value row — the row shape every field in this drawer shares. */
const KvRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <StackH
        gap={3}
        align="center"
        justify="between"
        principles={["content-row"]}
        items={[
            () => <Typography size="sm" color="muted" text={label} />,
            () => (typeof value === "string" ? <Typography size="sm" weight="medium" text={value} /> : <>{value}</>),
        ]}
    />
)

/**
 * The member detail drawer. See the file header for why role/ban actions hand
 * off to sibling overlays instead of running their mutation here.
 *
 * @param props - {@link MemberDetailDrawerProps}
 */
const MemberDetailDrawer = ({
    isOpen,
    onOpenChange,
    name,
    email,
    role,
    status,
    courseProgress,
    joinedLabel,
    purchasedCourseCount,
    onChangeRole,
    onBan,
    onUnban,
    isBusy = false,
    placement = "right",
    labels,
}: MemberDetailDrawerProps) => {
    const rows = [
        () => <KvRow label={labels.roleFieldLabel} value={<Chip tone={ROLE_TONE[role]} text={labels.roleLabels[role]} />} />,
        () => <KvRow label={labels.statusFieldLabel} value={<Chip tone={STATUS_TONE[status]} text={labels.statusLabels[status]} />} />,
        () =>
            courseProgress != null ? (
                <StackV
                    gap={2}
                    items={[
                        () => <Typography size="sm" color="muted" text={labels.progressFieldLabel} />,
                        () => <ProgressMeter value={courseProgress.percent} label={courseProgress.courseName} showValue />,
                    ]}
                />
            ) : (
                <KvRow label={labels.progressFieldLabel} value={labels.notEnrolledLabel} />
            ),
        () => <KvRow label={labels.purchasedFieldLabel} value={String(purchasedCourseCount)} />,
        () => <KvRow label={labels.joinedFieldLabel} value={joinedLabel} />,
    ]

    const footerButtons: Array<ButtonBaseProps> = [
        {
            variant: "secondary",
            size: "sm",
            label: labels.changeRoleLabel,
            onPress: onChangeRole,
            isDisabled: isBusy,
        },
        status === "banned"
            ? { variant: "outline", size: "sm", label: labels.unbanLabel, onPress: onUnban, isDisabled: isBusy }
            : { variant: "danger-soft", size: "sm", label: labels.banLabel, onPress: onBan, isDisabled: isBusy },
    ]

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                title={name}
                description={email}
                body={() => <StackV gap={4} items={rows} />}
                footer={() => (
                    <StackH
                        gap={2}
                        justify="end"
                        items={footerButtons.map((buttonProps) => () => <Button {...buttonProps} />)}
                    />
                )}
            />
        </div>
    )
}

export { MemberDetailDrawer }
