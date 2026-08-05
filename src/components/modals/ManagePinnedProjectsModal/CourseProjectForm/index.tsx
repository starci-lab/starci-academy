"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { useSWRConfig } from "swr"
import { QUERY_USER_PINNED_PROJECTS_SWR } from "@/hooks/swr/api/graphql/queries/useQueryUserPinnedProjectsSwr"
import { useMutatePinCourseProjectSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePinCourseProjectSwr"
import { useQueryMyPinnableCapstonesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyPinnableCapstonesSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useAppSelector } from "@/redux/hooks"
import { _CourseProjectForm, type CourseProjectFormOption } from "./component"

/** Props for {@link CourseProjectForm}. */
export interface CourseProjectFormProps {
    /** Called after a successful pin (close the modal / switch to the list). */
    onSuccess?: () => void
}

/**
 * Form for pinning one of the signed-in user's capstone projects — the
 * CONNECTED half. Loads the pinnable capstones via
 * {@link useQueryMyPinnableCapstonesSwr}, owns the picker + description local
 * state, submits via {@link useMutatePinCourseProjectSwr} through
 * {@link useGraphQLWithToast}. On success: revalidates the viewer's
 * pinned-projects SWR key, resets state, and calls `onSuccess`. See
 * `tiers/split.md`.
 *
 * @param props - {@link CourseProjectFormProps}
 */
export const CourseProjectForm = ({
    onSuccess,
}: CourseProjectFormProps = {}) => {
    const t = useTranslations()
    const { mutate } = useSWRConfig()
    const runGraphQL = useGraphQLWithToast()

    // the signed-in viewer — needed to revalidate the correct SWR cache key
    const viewerId = useAppSelector((state) => state.user.user?.id)

    // load the user's pinnable capstones (enrollment rows that have a project repo)
    const { data: capstones, isLoading, error: capstonesError, mutate: mutateCapstones } = useQueryMyPinnableCapstonesSwr()
    const options: Array<CourseProjectFormOption> = (capstones ?? []).map((item) => ({
        enrollmentId: item.enrollmentId,
        courseTitle: item.courseTitle,
        isVerified: item.isVerified,
    }))

    // controlled selection: the enrollmentId of the chosen capstone, or null
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null)
    // optional description the user types in
    const [description, setDescription] = useState("")
    // in-flight submit guard
    const [isSubmitting, setIsSubmitting] = useState(false)

    // the SWR mutation that calls pinCourseProject on the backend
    const pinSwr = useMutatePinCourseProjectSwr()

    /** Submit the pin mutation and revalidate on success. */
    const onSubmit = async () => {
        // require a capstone to be selected before submitting
        if (!selectedEnrollmentId) return

        setIsSubmitting(true)
        await runGraphQL(
            async () => {
                // call the pinCourseProject GraphQL mutation
                const result = await pinSwr.trigger({
                    enrollmentId: selectedEnrollmentId,
                    description: description.trim() || undefined,
                })
                const env = result?.data?.pinCourseProject
                if (!env) {
                    throw new Error(t("toast.defaultError"))
                }
                // on success: revalidate the owner's pinned list, reset state, close
                if (env.success) {
                    if (viewerId) {
                        // bust the viewer's cached pinned-projects list
                        await mutate([QUERY_USER_PINNED_PROJECTS_SWR, viewerId])
                    }
                    // reset form state to blank
                    setSelectedEnrollmentId(null)
                    setDescription("")
                    onSuccess?.()
                }
                return env
            },
            {
                showErrorToast: true,
                showSuccessToast: true,
            },
        )
        setIsSubmitting(false)
    }

    return (
        <_CourseProjectForm
            options={options}
            selectedEnrollmentId={selectedEnrollmentId}
            onSelectedEnrollmentIdChange={setSelectedEnrollmentId}
            description={description}
            onDescriptionChange={setDescription}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            isError={Boolean(capstonesError)}
            onRetry={() => { void mutateCapstones() }}
            onSubmit={onSubmit}
            labels={{
                selectLabel: t("pinnedProjects.course.selectLabel"),
                loading: t("pinnedProjects.course.loading"),
                selectPlaceholder: t("pinnedProjects.course.selectPlaceholder"),
                verified: t("pinnedProjects.course.verified"),
                description: t("pinnedProjects.form.description"),
                descriptionPlaceholder: t("pinnedProjects.form.descriptionPlaceholder"),
                submit: t("pinnedProjects.form.submit"),
                errorTitle: t("pinnedProjects.errorTitle"),
                errorDescription: t("pinnedProjects.errorDescription"),
                retry: t("pinnedProjects.retry"),
                noCourses: t("pinnedProjects.course.noCourses"),
            }}
        />
    )
}
