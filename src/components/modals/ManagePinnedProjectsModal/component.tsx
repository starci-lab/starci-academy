import React, { useState } from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Button } from "@/components/atoms/buttons/Button"
import { Tabs } from "@/components/atoms/navigation/Tabs"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackV } from "@/components/frames/Stack"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { PinnedProjectCard, type PinnedProjectCardLabels } from "./PinnedProjectCard"
import { ExternalProjectForm } from "./ExternalProjectForm"
import { CourseProjectForm } from "./CourseProjectForm"
import type { QueryUserPinnedProjectItem } from "@/modules/api/graphql/queries/types/user-pinned-projects"

/** Tabs inside the manage-pinned-projects modal. */
type ManagePinsTab = "manage" | "external" | "course"

/** Rows shown while the owner's pinned list is first loading. */
const SKELETON_ROW_COUNT = 3
/** Icon-only footer actions a manage-mode card shows (move-up, move-down, open, remove). */
const SKELETON_BUTTON_COUNT = 4

/**
 * Loading mirror for the "manage" tab's pin list — mirrors {@link PinnedProjectCard}'s
 * `MediaCard` shape (cover, title, meta chip row, description, and a 4-button
 * footer) row-for-row so the tab does not jump when data resolves. Co-located
 * right here (not a separate hand-kept file) since `PinnedProjectCard` takes
 * no `isSkeleton` prop of its own to thread through (`loading-and-skeleton.md`).
 */
const ManagePinnedListSkeleton = () => (
    <StackV
        gap={4}
        items={Array.from({ length: SKELETON_ROW_COUNT }).map(() => () => (
            <Box className="card">
                <StackV
                    gap={4}
                    items={[
                        () => <Skeleton className="aspect-video w-full rounded-xl" />,
                        () => <Skeleton.Typography width="1/2" />,
                        () => (
                            <Cluster
                                gap={3}
                                items={[
                                    () => <Skeleton.Chip />,
                                    () => <Skeleton.Chip />,
                                ]}
                            />
                        ),
                        () => <Skeleton.Typography type="body-sm" width="full" />,
                        () => <Skeleton.Typography type="body-sm" width="2/3" />,
                        () => (
                            <Cluster
                                gap={3}
                                items={Array.from({ length: SKELETON_BUTTON_COUNT }).map(() => () => (
                                    <Button isSkeleton isIconOnly size="sm" />
                                ))}
                            />
                        ),
                    ]}
                />
            </Box>
        ))}
    />
)

/** Already-translated strings {@link _ManagePinnedProjectsModal} renders — resolved by the connected `ManagePinnedProjectsModal`, never `t()` itself. */
export interface ManagePinnedProjectsModalLabels {
    /** Modal header title. */
    manageTitle: string
    /** "Pinned" tab label — already interpolated with the current count + {@link MAX_PINNED_PROJECTS}. */
    tabManage: string
    /** "External" tab label. */
    tabExternal: string
    /** "Course" tab label. */
    tabCourse: string
    /** Empty-state title shown when the owner has no pins yet. */
    emptyOwnerTitle: string
    /** Empty-state description shown when the owner has no pins yet. */
    emptyManage: string
    /** "You've reached the cap" banner — already interpolated with {@link MAX_PINNED_PROJECTS}. */
    full: string
    /** Strings threaded to every {@link PinnedProjectCard}. */
    pinCard: PinnedProjectCardLabels
}

/** Props for {@link _ManagePinnedProjectsModal}. */
export interface ManagePinnedProjectsModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** The signed-in owner's pinned projects (empty until loaded). */
    pins: Array<QueryUserPinnedProjectItem>
    /** `true` → first load, nothing in hand yet: the "Pinned" tab shows {@link ManagePinnedListSkeleton}. */
    isSkeleton?: boolean
    /** `true` → loading has finished and there are no pins: the "Pinned" tab shows the empty state. */
    isEmpty: boolean
    /** Whether the cap has been reached — disables the "External"/"Course" tabs and shows the full banner. */
    isFull: boolean
    /** True while any unpin/reorder mutation is in flight. */
    isBusy: boolean
    /** Remove a pin by id. */
    onRemove: (id: string) => void
    /** Move a pin one slot earlier. */
    onMoveUp: (id: string) => void
    /** Move a pin one slot later. */
    onMoveDown: (id: string) => void
    /** Already-translated strings — see {@link ManagePinnedProjectsModalLabels}. */
    labels: ManagePinnedProjectsModalLabels
}

/**
 * Owner-only modal to manage pinned projects: a "Pinned" tab listing the current
 * pins with reorder + remove controls, an "External" tab with the add-external
 * form, and a "Course" tab for capstone pins. Composes the shared `ModalShell`
 * dialog scaffold; the "External"/"Course" tabs render the CONNECTED
 * {@link ExternalProjectForm}/{@link CourseProjectForm} (each owns its own data —
 * see `tiers/split.md`'s "a screen renders connected children" rule). Tab
 * selection is pure UI state, kept local to this presentational half.
 *
 * @param props - {@link ManagePinnedProjectsModalProps}
 */
export const _ManagePinnedProjectsModal = ({
    isOpen,
    onOpenChange,
    pins,
    isSkeleton = false,
    isEmpty,
    isFull,
    isBusy,
    onRemove,
    onMoveUp,
    onMoveDown,
    labels,
}: ManagePinnedProjectsModalProps) => {
    const [tab, setTab] = useState<ManagePinsTab>("manage")
    const backToManage = () => setTab("manage")

    const manageBody = isSkeleton ? (
        <ManagePinnedListSkeleton />
    ) : isEmpty ? (
        <AsyncContentEmpty
            title={labels.emptyOwnerTitle}
            description={labels.emptyManage}
        />
    ) : (
        <StackV
            gap={4}
            items={[
                ...(isFull ? [() => (
                    <Typography size="xs" color="muted" text={labels.full} />
                )] : []),
                ...pins.map((pin, index) => () => (
                    <PinnedProjectCard
                        key={pin.id}
                        pin={pin}
                        manage
                        isBusy={isBusy}
                        canMoveUp={index > 0}
                        canMoveDown={index < pins.length - 1}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                        onRemove={onRemove}
                        labels={labels.pinCard}
                    />
                )),
            ]}
        />
    )

    return (
        <ModalShell
            identity={{ tier: "overlay", component: "ManagePinnedProjectsModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            title={labels.manageTitle}
            body={() => (
                <StackV
                    gap={5}
                    items={[
                        () => (
                            <Tabs
                                items={[
                                    { key: "manage", label: labels.tabManage },
                                    { key: "external", label: labels.tabExternal, isDisabled: isFull },
                                    { key: "course", label: labels.tabCourse, isDisabled: isFull },
                                ]}
                                selectedKey={tab}
                                onSelectionChange={(key) => setTab(key as ManagePinsTab)}
                                ariaLabel={labels.manageTitle}
                            />
                        ),
                        () => {
                            if (tab === "external") {
                                return <ExternalProjectForm onSuccess={backToManage} />
                            }
                            if (tab === "course") {
                                return <CourseProjectForm onSuccess={backToManage} />
                            }
                            return manageBody
                        },
                    ]}
                />
            )}
        />
    )
}
