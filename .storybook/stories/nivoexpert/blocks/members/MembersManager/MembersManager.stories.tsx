import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    MembersManager,
    type MemberRowView,
    type MembersManagerLabels,
} from "@sb-components/nivoexpert/blocks/members/MembersManager/MembersManager"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MembersManager` — the expert's community roster: one row per member (identity,
 * current-course progress, role, status), filtered by a tab strip (all / learning /
 * completed / banned). A row press opens `MemberDetailDrawer`; role changes and
 * bans route through `SetMemberRoleModal` and `BanMemberModal` from there, so this
 * table keeps to one quick inline action (`Grant access`).
 */
const meta: Meta<typeof MembersManager> = {
    title: "NivoExpert/Blocks/Members/MembersManager/MembersManager",
    component: MembersManager,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MembersManager>

const LABELS: MembersManagerLabels = {
    title: "Members",
    addLabel: "Add member",
    memberColumn: "Member",
    progressColumn: "Progress",
    statusColumn: "Status",
    roleColumn: "Role",
    actionsColumn: "Actions",
    roleLabels: { member: "Member", moderator: "Moderator", admin: "Admin" },
    statusLabels: { active: "Active", banned: "Banned" },
    notEnrolledLabel: "Not enrolled",
    grantLabel: "Grant access",
    tableAriaLabel: "Community members",
    tabsAriaLabel: "Filter members",
    tabAllLabel: "All",
    tabLearningLabel: "Learning",
    tabCompletedLabel: "Completed",
    tabBannedLabel: "Banned",
    emptyTitle: "No members yet",
    emptyDescription: "Members appear here when people join your community or you add them by email.",
}

const MEMBERS: Array<MemberRowView> = [
    { id: "m-1", name: "Mai Trang", email: "mai@nivo.vn", role: "admin", status: "active", courseProgress: { courseName: "Advanced React", percent: 100 } },
    { id: "m-2", name: "Hoang Nam", email: "nam@nivo.vn", role: "moderator", status: "active", courseProgress: { courseName: "System Design", percent: 62 } },
    { id: "m-3", name: "Le Vy", email: "vy@nivo.vn", role: "member", status: "banned", courseProgress: { courseName: "DevOps Foundations", percent: 28 } },
    { id: "m-4", name: "Quoc Bao", email: "bao@nivo.vn", role: "member", status: "active", courseProgress: null },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the roster card with its Add-member action" },
    Tabs: { tier: "atom", role: "the all / learning / completed / banned filter strip" },
    Table: { tier: "composite", role: "one row per member — identity, progress, status, and role" },
    UserCell: { tier: "composite", role: "the member identity (name + email handle)" },
    ProgressMeter: { tier: "composite", role: "the member's current-course progress bar" },
    Chip: { tier: "atom", role: "the status and role badges" },
    Button: { tier: "atom", role: "the add-member and grant-access actions" },
    EmptyState: { tier: "composite", role: "shown when the filtered roster is empty" },
}

/** LEAF — one shape; the pictures are DATA (empty / with-members / filtered / loading) ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MembersManager"
                tier="block"
                leaf="Roster"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: the block owns the member roster and its tab filter, so its pictures are states of one shape. A row press opens `MemberDetailDrawer` (out of this block's scope); `Grant access` maps onto `grantCourseAccess`, the only mutation this table still runs inline — role changes and bans route through the drawer's own `SetMemberRoleModal` / `BanMemberModal`."
                states={[
                    {
                        name: "members = []",
                        why: "A community with no members yet: the roster table gives way to an empty state, while the Add-member action stays available in the header.",
                        code: "<MembersManager members={[]} onAddMember={add} onViewMember={view} onGrantAccess={grant} labels={labels} />",
                        render: (
                            <MembersManager
                                members={[]}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantAccess={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "members present — All tab",
                        why: "A populated roster across every role, both statuses, and every progress shape: a completed course, a course in progress, a banned member, and a member not yet enrolled in anything (\"Not enrolled\").",
                        code: "<MembersManager members={members} … />",
                        render: (
                            <MembersManager
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantAccess={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The roster's own first fetch is in flight, so the card keeps its title and tab strip and draws a fixed count of member-shaped rows — identity, progress, status, and role all shimmering — while the Add action falls away, so nothing jumps when the members land.",
                        code: "<MembersManager members={[]} … labels={labels} isSkeleton />",
                        render: (
                            <MembersManager
                                members={[]}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantAccess={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
