"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    ProjectCard,
} from "./ProjectCard"
import { pathConfig } from "@/resources/path"
import { useQueryUserCapstoneProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCapstoneProgressSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/** Placeholder capstone rows shown while the projection loads. */
const SKELETON_ROWS = 3

/**
 * Projects tab — the profile owner's verified capstone work, framed as
 * "project = one narrative showcase per course". Each personal-project capstone
 * course is one compact {@link ProjectCard} ROW inside a single
 * {@link LabeledCard} (label outside, content in one card — no nested card-in-card),
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

    // resolved-empty + no error → hide the whole section (sparse profiles stay clean).
    if (projectsData && projects.length === 0 && !projectsError) {
        return null
    }

    return (
        <LabeledCard
            identity={{ tier: "block", component: "ProfileCapstone" }}
            label={t("publicProfile.capstone.projectsHeading")}
            frameless
        >
            {projectsError && !projectsData ? (
                <AsyncContentError
                    title={t("publicProfile.capstone.loadErrorTitle")}
                    description={t("publicProfile.capstone.loadErrorDescription")}
                    onRetry={() => { void reloadProjects() }}
                    retryLabel={t("publicProfile.capstone.loadErrorRetry")}
                />
            ) : (
                <SurfaceListCard>
                    {isSkeleton
                        ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                            <SurfaceListCardItem key={index}>
                                <ProjectCard isSkeleton />
                            </SurfaceListCardItem>
                        ))
                        : projects.map((project) => (
                            <SurfaceListCardItem
                                key={project.courseGlobalId}
                                hover="underline"
                                href={username
                                    ? pathConfig().locale(locale).profile(username).projects().course(project.courseGlobalId).build()
                                    : undefined}
                            >
                                <ProjectCard project={project} />
                            </SurfaceListCardItem>
                        ))}
                </SurfaceListCard>
            )}
        </LabeledCard>
    )
}
