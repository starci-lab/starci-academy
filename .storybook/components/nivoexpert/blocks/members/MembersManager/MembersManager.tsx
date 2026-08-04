import { useMemo, useState } from "react"
import { UserCheckIcon, UserPlusIcon, UsersThreeIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MembersManager` — the expert's community roster: one row per member (identity,
 * current-course progress, role, status), filtered by a tab strip (all / learning /
 * completed / banned). A row press opens `MemberDetailDrawer`; role changes and
 * bans route through `SetMemberRoleModal` and `BanMemberModal` from there, so this
 * table keeps to one quick inline action (`Grant access`).
 */

/** A community member's role (`MemberEntity.role`). */
export type MemberRole = "member" | "moderator" | "admin"

/** Whether a member can participate (`MemberEntity.status`). */
export type MemberStatus = "active" | "banned"

/** Which tab of the roster a member falls under. */
export type MembersManagerTab = "all" | "learning" | "completed" | "banned"

/** A member's current/most-recent course and how far they are through it. */
export interface MemberCourseProgress {
    /** Course display name. */
    courseName: string
    /** Completion percent, 0-100. */
    percent: number
}

/** One roster row — a subset of `MemberEntity`. */
export interface MemberRowView {
    /** Member id (`MemberEntity.id`). */
    id: string
    /** Display name (`MemberEntity.name`). */
    name: string
    /** Email — the member's unique identity (`MemberEntity.email`). */
    email: string
    /** Role in the community (`MemberEntity.role`). */
    role: MemberRole
    /** Active or banned (`MemberEntity.status`). */
    status: MemberStatus
    /** Current course + completion percent. `null` → not enrolled in any course yet. */
    courseProgress: MemberCourseProgress | null
}

/** Props for {@link MembersManager}. */
export interface MembersManagerProps {
    /** The FULL roster — this block filters it client-side by the active tab. Empty is the `empty` state. */
    members: Array<MemberRowView>
    /** Open the add-member flow — the connected layer runs `createMember`. */
    onAddMember: () => void
    /** A row was pressed — the connected layer opens `MemberDetailDrawer` for this member id. */
    onViewMember: (id: string) => void
    /** Grant a member course access — the connected layer runs `grantCourseAccess`. */
    onGrantAccess: (id: string) => void
    /** Id of the member whose controls are in flight (they lock), or null. */
    busyId?: string | null
    /**
     * `true` → the roster's own first fetch is in flight: the card keeps its title
     * and renders a fixed count of member-shaped rows with every cell shimmering
     * (§12b), the Add action and per-row controls go inert. Threaded straight down
     * — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: MembersManagerLabels
}

/** The already-resolved copy the block renders. */
export interface MembersManagerLabels {
    /** Card title (e.g. "Members"). */
    title: string
    /** Add-member button label. */
    addLabel: string
    /** Column header for the member identity. */
    memberColumn: string
    /** Column header for the current-course progress. */
    progressColumn: string
    /** Column header for the status. */
    statusColumn: string
    /** Column header for the role. */
    roleColumn: string
    /** Column header for the row actions. */
    actionsColumn: string
    /** The three role labels, keyed by role. */
    roleLabels: Record<MemberRole, string>
    /** The two status labels, keyed by status. */
    statusLabels: Record<MemberStatus, string>
    /** Progress-cell copy for a member with no course yet. */
    notEnrolledLabel: string
    /** Grant-access button label. */
    grantLabel: string
    /** Accessible name for the roster table. */
    tableAriaLabel: string
    /** Accessible name for the tab strip. */
    tabsAriaLabel: string
    /** "All" tab label. */
    tabAllLabel: string
    /** "Learning" tab label — enrolled, not yet at 100%. */
    tabLearningLabel: string
    /** "Completed" tab label — enrolled, at 100%. */
    tabCompletedLabel: string
    /** "Banned" tab label. */
    tabBannedLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { member: "member", progress: "progress", status: "status", role: "role", actions: "actions" } as const

/** Status → chip tone. Active reads healthy, banned reads a failure. */
const STATUS_TONE: Record<MemberStatus, ChipTone> = { active: "success", banned: "danger" }

/** Role → chip tone. Admin reads elevated, the rest read neutral. */
const ROLE_TONE: Record<MemberRole, ChipTone> = { admin: "accent", moderator: "default", member: "default" }

/** How many placeholder rows the loading mirror draws while `members` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder members — sized like a real row so the table's shimmer mirrors the loaded shape. */
const SKELETON_MEMBERS: Array<MemberRowView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Member name",
    email: "member@example.com",
    role: "member",
    status: "active",
    courseProgress: { courseName: "Course name", percent: 50 },
}))

/**
 * Which tab a member falls under. A banned member always sorts to `banned`
 * (regardless of course progress); a member with no course yet only ever shows
 * under `all`, since "not started" has no tab of its own (matches the roster's
 * 4-tab shape: all / learning / completed / banned).
 */
const memberTab = (member: MemberRowView): MembersManagerTab => {
    if (member.status === "banned") return "banned"
    if (member.courseProgress == null) return "all"
    return member.courseProgress.percent >= 100 ? "completed" : "learning"
}

/**
 * The community roster manager. See the file header for why role/ban actions
 * route through the drawer + modals instead of living inline in this table.
 *
 * @param props - {@link MembersManagerProps}
 */
const MembersManager = ({
    members,
    onAddMember,
    onViewMember,
    onGrantAccess,
    busyId,
    isSkeleton = false,
    labels,
}: MembersManagerProps) => {
    const [activeTab, setActiveTab] = useState<MembersManagerTab>("all")

    const tabItems: Array<TabItem> = [
        { key: "all", label: labels.tabAllLabel },
        { key: "learning", label: labels.tabLearningLabel },
        { key: "completed", label: labels.tabCompletedLabel },
        { key: "banned", label: labels.tabBannedLabel },
    ]

    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.member, header: labels.memberColumn },
        { key: COLUMN_KEY.progress, header: labels.progressColumn, width: "220px" },
        { key: COLUMN_KEY.status, header: labels.statusColumn },
        { key: COLUMN_KEY.role, header: labels.roleColumn },
        { key: COLUMN_KEY.actions, header: labels.actionsColumn, align: "end" },
    ]

    // While loading the table renders the SAME shape from a fixed count of
    // placeholder members; `isSkeleton` threads into every cell so the identity,
    // progress bar, status chip, and role chip all shimmer and go inert. Tab
    // filtering only applies once real data is in hand.
    const memberRows = isSkeleton ? SKELETON_MEMBERS : members
    const filteredMembers = useMemo(
        () => (activeTab === "all" ? memberRows : memberRows.filter((member) => memberTab(member) === activeTab)),
        [memberRows, activeTab],
    )

    const rows: ReadonlyArray<TableRowItem> = filteredMembers.map((member): TableRowItem => {
        const isBusy = busyId === member.id
        return {
            key: member.id,
            [COLUMN_KEY.member]: <UserCell username={member.name} handle={member.email} size="sm" isSkeleton={isSkeleton} />,
            [COLUMN_KEY.progress]: member.courseProgress != null ? (
                <div className="min-w-[160px]">
                    <ProgressMeter
                        value={member.courseProgress.percent}
                        label={member.courseProgress.courseName}
                        showValue
                        isSkeleton={isSkeleton}
                    />
                </div>
            ) : (
                <Typography size="sm" color="muted" text={labels.notEnrolledLabel} isSkeleton={isSkeleton} />
            ),
            [COLUMN_KEY.status]: <Chip tone={STATUS_TONE[member.status]} isSkeleton={isSkeleton} text={labels.statusLabels[member.status]} />,
            [COLUMN_KEY.role]: <Chip tone={ROLE_TONE[member.role]} isSkeleton={isSkeleton} text={labels.roleLabels[member.role]} />,
            [COLUMN_KEY.actions]: (
                <StackH
                    gap={2}
                    align="center"
                    justify="end"
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <Button
                                variant="secondary"
                                size="sm"
                                prefixIcon={UserCheckIcon}
                                label={labels.grantLabel}
                                onPress={() => onGrantAccess(member.id)}
                                isDisabled={isBusy}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            ),
        }
    })

    return (
        <div data-tier="block" data-component="MembersManager">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => (
                    <Button variant="primary" size="sm" prefixIcon={UserPlusIcon} label={labels.addLabel} onPress={onAddMember} />
                )}
                body={() => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Tabs items={tabItems} selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as MembersManagerTab)} ariaLabel={labels.tabsAriaLabel} variant="secondary" isSkeleton={isSkeleton} />,
                            () =>
                                !isSkeleton && filteredMembers.length === 0 ? (
                                    <EmptyState icon={UsersThreeIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                                ) : (
                                    <Table
                                        columns={columns}
                                        items={rows}
                                        ariaLabel={labels.tableAriaLabel}
                                        isSkeleton={isSkeleton}
                                        onRowPress={isSkeleton ? undefined : onViewMember}
                                    />
                                ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { MembersManager }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "MembersManager" } as const
