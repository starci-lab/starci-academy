"use client"

import React from "react"
import { useTranslations } from "next-intl"
import {
    MAX_PINNED_PROJECTS,
    usePinnedProjectsManager,
} from "./hooks/usePinnedProjectsManager"
import { usePinnedProjectsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _ManagePinnedProjectsModal } from "./component"

/**
 * Owner-only modal to manage pinned projects — the CONNECTED half. Open-state
 * lives in the shared zustand overlay (`pinnedProjects` key); the list +
 * unpin/reorder mutations are owned by {@link usePinnedProjectsManager} (the
 * "External"/"Course" tabs own their own mutation — see `./ExternalProjectForm`
 * and `./CourseProjectForm`). Resolves every label — including the count/max
 * interpolation the "Pinned" tab and the full-banner need — and hands them to
 * the presentational {@link _ManagePinnedProjectsModal}. Mounted once, prop-less,
 * in `ModalContainer`. See `tiers/split.md`.
 */
export const ManagePinnedProjectsModal = () => {
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

    // first load, nothing in hand yet
    const isSkeleton = isLoading && pins.length === 0

    return (
        <_ManagePinnedProjectsModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            pins={pins}
            isSkeleton={isSkeleton}
            isEmpty={!isSkeleton && pins.length === 0}
            isFull={isFull}
            isBusy={isBusy}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            labels={{
                manageTitle: t("pinnedProjects.manageTitle"),
                tabManage: t("pinnedProjects.tabs.manage", { count: pins.length, max: MAX_PINNED_PROJECTS }),
                tabExternal: t("pinnedProjects.tabs.external"),
                tabCourse: t("pinnedProjects.tabs.course"),
                emptyOwnerTitle: t("pinnedProjects.emptyOwnerTitle"),
                emptyManage: t("pinnedProjects.emptyManage"),
                full: t("pinnedProjects.full", { max: MAX_PINNED_PROJECTS }),
                pinCard: {
                    verified: t("pinnedProjects.verified"),
                    moveUp: t("pinnedProjects.moveUp"),
                    moveDown: t("pinnedProjects.moveDown"),
                    open: t("pinnedProjects.open"),
                    remove: t("pinnedProjects.remove"),
                    untitled: t("pinnedProjects.untitled"),
                },
            }}
        />
    )
}
