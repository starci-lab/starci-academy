"use client"

import React from "react"
import {
    Alert,
    Skeleton,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryCourseSwr,
} from "@/hooks/singleton"
import {
    useAppSelector,
} from "@/redux"

/**
 * Warning alert listing the course prerequisites.
 *
 * Self-contained section (single-use): reads its own load flag (course SWR
 * singleton) and prerequisites (redux), so the course container renders
 * `<PrerequisitesAlert />` with no props. Renders a skeleton while loading,
 * otherwise the prerequisite bullet list. `"use client"` because HeroUI
 * `Alert`/`Skeleton` are client components and it reads redux.
 */
export const PrerequisitesAlert = () => {
    const t = useTranslations()
    const { isLoading } = useQueryCourseSwr()
    const prerequisites = useAppSelector((state) => state.course.entity?.prerequisites)
    return (
        <Alert status="warning" className="text-sm">
            <Alert.Indicator />
            <Alert.Content className="gap-1">
                {isLoading ? (
                    <Alert.Description className="w-full">
                        <Skeleton className="h-[14px] w-[60%] !bg-warning-500/10 my-[3px]" />
                        <Skeleton className="h-[14px] w-[50%] !bg-warning-500/10 my-[3px]" />
                    </Alert.Description>
                ) : (
                    <>
                        <Alert.Title>{t("course.prerequisites")}</Alert.Title>
                        <Alert.Description>
                            <ul className="list-disc list-inside text-start w-full">
                                {prerequisites?.map((prerequisite) => (
                                    <li key={prerequisite.id} className="text-sm">
                                        <span dangerouslySetInnerHTML={{ __html: prerequisite.text ?? "" }} />
                                    </li>
                                ))}
                            </ul>
                        </Alert.Description>
                    </>
                )}
            </Alert.Content>
        </Alert>
    )
}
