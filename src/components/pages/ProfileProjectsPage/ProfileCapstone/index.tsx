"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "@/hooks/profile/useProfileUsername"
import {
    ProjectCard,
} from "./ProjectCard"
import { pathConfig } from "@/resources/path"
import { useQueryUserCapstoneProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCapstoneProgressSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import {
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"

/** Placeholder capstone rows shown while the projection loads. */
const SKELETON_ROWS = 3

/**
 * Projects tab — the profile owner's verified capstone work, framed as
 * "project = one narrative showcase per course". Each personal-project capstone
 * course is one compact {@link ProjectCard} ROW inside a single
 * {@link SurfaceCardList} (label + surface + rows owned together — Decision A),
 * separated by dividers. Self-contained container: reads username → entity id,
 * then drives its own projection-backed SWR.
 *
 * The placeholder rows are the SAME `ProjectCard` resting, in the SAME list, so the
 * row's shape has one description (`loading-and-skeleton.md`).
 */
export const ProfileCapstone = () => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data: projectsData,
        isLoading,
        error: projectsError,
        mutate: reloadProjects,
    } = useQueryUserCapstoneProgressSwr(userId)

    const projects = projectsData ?? []
    const isSkeleton = (isLoading || !userId) && !projectsData
    const loadError = projectsError && !projectsData ? projectsError : undefined

    // resolved-empty + no error → hide the whole section (sparse profiles stay clean).
    if (projectsData && projects.length === 0 && !projectsError) {
        return null
    }

    const items: ReadonlyArray<SurfaceCardListItem> = isSkeleton
        ? Array.from({ length: SKELETON_ROWS }, (_row, index) => ({
            key: `skeleton-${index}`,
            content: () => <ProjectCard isSkeleton />,
        }))
        : projects.map((project) => ({
            key: project.courseGlobalId,
            hover: "underline" as const,
            href: username
                ? pathConfig().locale(locale).profile(username).projects().course(project.courseGlobalId).build()
                : undefined,
            content: () => <ProjectCard project={project} />,
        }))

    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "ProfileCapstone" }}
            label={t("publicProfile.capstone.projectsHeading")}
            items={items}
            isSkeleton={isSkeleton}
            error={loadError}
            errorState={() => (
                <AsyncContentError
                    title={t("publicProfile.capstone.loadErrorTitle")}
                    description={t("publicProfile.capstone.loadErrorDescription")}
                    onRetry={() => { void reloadProjects() }}
                    retryLabel={t("publicProfile.capstone.loadErrorRetry")}
                />
            )}
        />
    )
}
