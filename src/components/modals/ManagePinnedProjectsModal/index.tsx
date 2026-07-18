"use client"

import React, { useState } from "react"
import {
    Card,
    CardContent,
    Tabs,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    MAX_PINNED_PROJECTS,
    usePinnedProjectsManager,
} from "./hooks/usePinnedProjectsManager"
import { PinnedProjectCard } from "./PinnedProjectCard"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ExternalProjectForm } from "./ExternalProjectForm"
import { CourseProjectForm } from "./CourseProjectForm"
import { usePinnedProjectsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/** Tabs inside the manage-pinned-projects modal. */
type ManagePinsTab = "manage" | "external" | "course"

/**
 * Owner-only modal to manage pinned projects: a "Pinned" tab listing the current
 * pins with reorder + remove controls, an "External" tab with the add-external
 * form, and a "Course" tab for capstone pins. Open-state lives in the shared
 * zustand overlay (`pinnedProjects` key); the list + unpin/reorder mutations are
 * owned by {@link usePinnedProjectsManager} (the form owns its own mutation).
 * Mounted once in `ModalContainer`.
 *
 * @param props - optional className threaded to the dialog.
 */
export const ManagePinnedProjectsModal = ({
    className,
}: WithClassNames<undefined>) => {
    const t = useTranslations()
    const { isOpen, setOpen } = usePinnedProjectsOverlayState()
    const {
        pins,
        isLoading,
        isFull,
        isBusy,
        onRemove,
        onMoveUp,
        onMoveDown,
    } = usePinnedProjectsManager()
    const [tab, setTab] = useState<ManagePinsTab>("manage")

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            size="lg"
            bodyStartsWithTabs
            header={(
                <Typography type="body" weight="semibold" className="pr-8">
                    {t("pinnedProjects.manageTitle")}
                </Typography>
            )}
        >
            <Tabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(String(key) as ManagePinsTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("pinnedProjects.manageTitle")}>
                        <Tabs.Tab id="manage">
                            {t("pinnedProjects.tabs.manage", { count: pins.length, max: MAX_PINNED_PROJECTS })}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="external" isDisabled={isFull}>
                            {t("pinnedProjects.tabs.external")}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="course" isDisabled={isFull}>
                            {t("pinnedProjects.tabs.course")}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
                {/* tabs→panel = gap-4; list/form internals stay gap-3 */}
                <Tabs.Panel id="manage" className="pt-4">
                    <AsyncContent
                        isLoading={isLoading && pins.length === 0}
                        skeleton={(
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    // mirror MediaCard (manage mode): cover · title · meta chip row ·
                                    // description · footer of 4 icon-only action buttons
                                    <Card key={index} className="gap-0 overflow-hidden p-0">
                                        <Skeleton className="aspect-video w-full" />
                                        <CardContent className="flex flex-col gap-3 px-4 pb-4 pt-3">
                                            <Skeleton.Typography width="1/2" />
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Skeleton.Chip />
                                                <Skeleton.Chip />
                                            </div>
                                            <Skeleton.Typography type="body-sm" width="full" />
                                            <Skeleton.Typography type="body-sm" width="2/3" />
                                            <div className="flex items-center gap-2">
                                                {Array.from({ length: 4 }).map((__, buttonIndex) => (
                                                    <Skeleton key={buttonIndex} className="size-9 shrink-0 rounded-lg" />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        isEmpty={pins.length === 0}
                        emptyContent={{
                            title: t("pinnedProjects.emptyOwnerTitle"),
                            description: t("pinnedProjects.emptyManage"),
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            {isFull ? (
                                <Typography type="body-xs" color="muted">
                                    {t("pinnedProjects.full", { max: MAX_PINNED_PROJECTS })}
                                </Typography>
                            ) : null}
                            {pins.map((pin, index) => (
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
                                />
                            ))}
                        </div>
                    </AsyncContent>
                </Tabs.Panel>
                {/* external: free-form add form (switches back to manage on success) */}
                <Tabs.Panel id="external" className="pt-4">
                    <ExternalProjectForm onSuccess={() => setTab("manage")} />
                </Tabs.Panel>
                {/* course: capstone pin (switches back to manage on success) */}
                <Tabs.Panel id="course" className="pt-4">
                    <CourseProjectForm onSuccess={() => setTab("manage")} />
                </Tabs.Panel>
            </Tabs>
        </ModalShell>
    )
}
