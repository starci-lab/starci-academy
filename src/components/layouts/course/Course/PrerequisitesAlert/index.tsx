"use client"

import React from "react"
import {
    Alert,
    Skeleton,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import type {
    WithClassNames,
} from "@/modules/types"

/**
 * PrerequisitesAlert props — only class-name plumbing (self-contained section).
 */
export type PrerequisitesAlertProps = WithClassNames<undefined>

/**
 * Warning alert listing the course prerequisites.
 *
 * Self-contained section (single-use): reads its own load flag (course SWR
 * singleton) and prerequisites (redux), so the course container renders
 * `<PrerequisitesAlert />` with no props. Renders a skeleton while loading,
 * otherwise the prerequisite bullet list. `"use client"` because HeroUI
 * `Alert`/`Skeleton` are client components and it reads redux.
 */
export const PrerequisitesAlert = (props: PrerequisitesAlertProps) => {
    const t = useTranslations()
    const { isLoading } = useQueryCourseSwr()
    const prerequisites = useAppSelector((state) => state.course.entity?.prerequisites)
    return (
        <Alert status="warning" className={cn("text-sm", props.className)}>
            <Alert.Indicator />
            <Alert.Content className="gap-1.5">
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
