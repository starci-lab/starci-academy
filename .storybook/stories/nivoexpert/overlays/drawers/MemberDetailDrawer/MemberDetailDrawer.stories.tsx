import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    MemberDetailDrawer,
    type MemberDetailDrawerLabels,
    type MemberDetailDrawerProps,
} from "@sb-components/nivoexpert/overlays/drawers/MemberDetailDrawer/MemberDetailDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MemberDetailDrawer` — the read view over one community member: identity (via
 * the shell's own title/description), a few key/value rows, and the two actions
 * that hand off to the sibling overlays in this set — "Change role" opens
 * `SetMemberRoleModal`, "Ban member" opens `BanMemberModal`. The drawer never runs
 * a mutation itself; "Unban member" is the one direct action, since reversing a
 * ban needs no audit reason.
 */
const meta: Meta<typeof MemberDetailDrawer> = {
    title: "NivoExpert/Overlays/Drawers/MemberDetailDrawer/MemberDetailDrawer",
    component: MemberDetailDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MemberDetailDrawer>

const LABELS: MemberDetailDrawerLabels = {
    roleFieldLabel: "Role",
    statusFieldLabel: "Status",
    progressFieldLabel: "Current course",
    joinedFieldLabel: "Joined",
    purchasedFieldLabel: "Courses purchased",
    notEnrolledLabel: "Not enrolled",
    roleLabels: { member: "Member", moderator: "Moderator", admin: "Admin" },
    statusLabels: { active: "Active", banned: "Banned" },
    changeRoleLabel: "Change role",
    banLabel: "Ban member",
    unbanLabel: "Unban member",
}

// Real DOM: Drawer.CloseTrigger + Drawer.Header > StackV(title/description) >
// Typography + Typography > Drawer.Body > StackV(rows) > StackH(kv row)[×4] +
// StackV(progress row) > Typography + ProgressMeter > Drawer.Footer > StackH >
// Button[×2].
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "StackV (title/description)": { tier: "frame", role: "the shell's own title (name) above description (email)", storyId: "frames-stack-stackv--default" },
    "StackV (rows)": { tier: "frame", role: "the vertical track holding every key/value row", storyId: "frames-stack-stackv--default" },
    "StackH (kv row)": { tier: "frame", role: "one label/value row — role, status, courses purchased, or joined date", storyId: "frames-stack-stackh--default" },
    "StackV (progress row)": { tier: "frame", role: "the progress field's own label above its bar, when enrolled", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "every row label and plain-text value, plus the shell's title/description", storyId: "atoms-text-typography-typography--overview" },
    "Chip": { tier: "atom", role: "the role and status values, shown as badges instead of plain text", storyId: "atoms-chips-chip-chip--tones" },
    "ProgressMeter": { tier: "composite", role: "the current course's completion bar, when the member is enrolled", storyId: "composites-stats-progressmeter-progressmeter--default" },
    "Button": { tier: "atom", role: "\"Change role\" (opens SetMemberRoleModal) and \"Ban member\"/\"Unban member\" (opens BanMemberModal, or reverses a ban directly)", storyId: "atoms-buttons-button-button--default" },
}

/** Controlled wrapper — the trigger reopens the drawer after it closes. */
const ControlledMemberDetailDrawer = ({
    triggerLabel,
    ...drawerProps
}: { triggerLabel: string } & Omit<MemberDetailDrawerProps, "isOpen" | "onOpenChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"

                onPress={() => setIsOpen(true)}
            />
            <MemberDetailDrawer isOpen={isOpen} onOpenChange={setIsOpen} {...drawerProps} />
        </div>
    )
}

/** ONE LEAF. The row shape never changes — only which fields it carries and the footer's Ban/Unban swap. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="MemberDetailDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A read view over one member: role, status, current-course progress, purchased-course count, and join date, each a plain key/value row. It owns none of the mutations that change those fields — Change role and Ban member both hand off to a sibling overlay; only Unban member runs directly, since reversing a ban needs no audit reason."
            states={[
                {
                    name: "active member — enrolled",
                    why: "The common case: an active member partway through a course. The footer offers \"Change role\" and \"Ban member\" (danger-soft) — banning always routes through `BanMemberModal` for its required audit reason.",
                    code: `<MemberDetailDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  name="Hoang Nam"
  email="nam@nivo.vn"
  role="moderator"
  status="active"
  courseProgress={{ courseName: "System Design", percent: 62 }}
  joinedLabel="12 Jul 2026"
  purchasedCourseCount={2}
  onChangeRole={openRoleModal}
  onBan={openBanModal}
  onUnban={unban}
  labels={labels}
/>`,
                    render: (
                        <ControlledMemberDetailDrawer
                            triggerLabel="Open — active, enrolled"
                            name="Hoang Nam"
                            email="nam@nivo.vn"
                            role="moderator"
                            status="active"
                            courseProgress={{ courseName: "System Design", percent: 62 }}
                            joinedLabel="12 Jul 2026"
                            purchasedCourseCount={2}
                            onChangeRole={() => {}}
                            onBan={() => {}}
                            onUnban={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "member not yet enrolled",
                    why: "No course started yet — the progress row falls to \"Not enrolled\" instead of a bar with nothing to show.",
                    code: `<MemberDetailDrawer
  role="member"
  status="active"
  courseProgress={null}
  purchasedCourseCount={0}
  …
/>`,
                    render: (
                        <ControlledMemberDetailDrawer
                            triggerLabel="Open — not enrolled"
                            name="Quoc Bao"
                            email="bao@nivo.vn"
                            role="member"
                            status="active"
                            courseProgress={null}
                            joinedLabel="30 Jul 2026"
                            purchasedCourseCount={0}
                            onChangeRole={() => {}}
                            onBan={() => {}}
                            onUnban={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "banned member",
                    why: "The status chip switches to its danger tone and the footer swaps \"Ban member\" for \"Unban member\" (outline) — reversing a ban is a direct action, no audit reason required.",
                    code: "<MemberDetailDrawer status=\"banned\" role=\"member\" … onUnban={unban} />",
                    render: (
                        <ControlledMemberDetailDrawer
                            triggerLabel="Open — banned"
                            name="Le Vy"
                            email="vy@nivo.vn"
                            role="member"
                            status="banned"
                            courseProgress={{ courseName: "DevOps Foundations", percent: 28 }}
                            joinedLabel="03 Jun 2026"
                            purchasedCourseCount={1}
                            onChangeRole={() => {}}
                            onBan={() => {}}
                            onUnban={() => {}}
                            labels={LABELS}
                        />
                    ),
                },
                {
                    name: "isBusy = true",
                    why: "A mutation for this member is already in flight (e.g. the unban just fired) — both footer actions lock until it resolves.",
                    code: "<MemberDetailDrawer isBusy … />",
                    render: (
                        <ControlledMemberDetailDrawer
                            triggerLabel="Open — busy"
                            name="Le Vy"
                            email="vy@nivo.vn"
                            role="member"
                            status="banned"
                            courseProgress={{ courseName: "DevOps Foundations", percent: 28 }}
                            joinedLabel="03 Jun 2026"
                            purchasedCourseCount={1}
                            onChangeRole={() => {}}
                            onBan={() => {}}
                            onUnban={() => {}}
                            isBusy
                            labels={LABELS}
                        />
                    ),
                },
            ]}
        />
    ),
}
