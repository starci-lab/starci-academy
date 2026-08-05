import { InputTextarea, SelectSingle } from "@/components/atoms/forms"
import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"


import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { Form } from "@/components/composites/form/Form"
import { StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { StatusChip } from "@/components/blocks/chips/StatusChip"

/** One capstone the signed-in user can pin — already resolved from the connected `CourseProjectForm`. */
export interface CourseProjectFormOption {
    /** Enrollment id — the value submitted and selected. */
    enrollmentId: string
    /** Course title shown in the picker. */
    courseTitle: string
    /** Whether the capstone is graded/verified — shows a "Verified" chip beside the title. */
    isVerified: boolean
}

/** Already-translated strings {@link _CourseProjectForm} renders — resolved by the connected `CourseProjectForm`, never `t()` itself. */
export interface CourseProjectFormLabels {
    selectLabel: string
    loading: string
    selectPlaceholder: string
    verified: string
    description: string
    descriptionPlaceholder: string
    submit: string
    errorTitle: string
    errorDescription: string
    retry: string
    noCourses: string
}

/** Props for {@link _CourseProjectForm}. */
export interface CourseProjectFormProps {
    /** The user's pinnable capstones (enrollments with a project repo). */
    options: Array<CourseProjectFormOption>
    /** Currently selected enrollment id, or `null`. */
    selectedEnrollmentId: string | null
    /** Fires when the user picks a capstone. */
    onSelectedEnrollmentIdChange: (id: string) => void
    /** Optional description the user typed. */
    description: string
    /** Fires on every keystroke in the description field. */
    onDescriptionChange: (value: string) => void
    /** True while the capstones query is first loading — the select shows a loading placeholder. */
    isLoading?: boolean
    /** True while the pin mutation is in flight — locks every field + the submit button. */
    isSubmitting?: boolean
    /** True when the capstones query failed — shows a retry row under the select. */
    isError?: boolean
    /** Retry the failed capstones query. */
    onRetry?: () => void
    /** Already-translated strings — see {@link CourseProjectFormLabels}. */
    labels: CourseProjectFormLabels
    /** Submit the form (the connected half runs the mutation). */
    onSubmit: () => void
}

/**
 * Presentational form for pinning one of the signed-in user's capstone
 * projects: a capstone picker (label = course title + a verified chip when
 * {@link CourseProjectFormOption.isVerified}), an optional description, and a
 * submit button. Loading/error/empty for the capstones query render as a row
 * under the picker — error → empty → the picker itself stays interactive
 * throughout, matching the original layout (this region never blocks the
 * whole form, only the picker's own placeholder/disabled state changes).
 *
 * All data — the capstones list, the mutation, i18n — lives in the connected
 * {@link CourseProjectForm}; this half only binds the fields.
 *
 * @param props - {@link CourseProjectFormProps}
 */
export const _CourseProjectForm = ({
    options,
    selectedEnrollmentId,
    onSelectedEnrollmentIdChange,
    description,
    onDescriptionChange,
    isLoading = false,
    isSubmitting = false,
    isError = false,
    onRetry,
    labels,
    onSubmit,
}: CourseProjectFormProps) => (
    <Form
        onSubmit={onSubmit}
        isDisabled={isSubmitting}
        gap={4}
        body={() => (
            <StackV
                gap={4}
                items={[
                    () => (
                        <SelectSingle
                            label={labels.selectLabel}
                            ariaLabel={labels.selectLabel}
                            placeholder={isLoading ? labels.loading : labels.selectPlaceholder}
                            isDisabled={isLoading || isSubmitting}
                            value={selectedEnrollmentId}
                            onValueChange={onSelectedEnrollmentIdChange}
                            options={options.map((option) => ({
                                value: option.enrollmentId,
                                label: option.isVerified ? (
                                    <Cluster
                                        gap={2}
                                        items={[
                                            () => <Typography size="sm" text={option.courseTitle} />,
                                            () => (
                                                <StatusChip
                                                    tone="success"
                                                    icon={<CheckCircleIcon className="size-3" aria-hidden="true" focusable="false" />}
                                                >
                                                    {labels.verified}
                                                </StatusChip>
                                            ),
                                        ]}
                                    />
                                ) : option.courseTitle,
                            }))}
                        />
                    ),
                    ...(isError ? [() => (
                        <AsyncContentError
                            title={labels.errorTitle}
                            description={labels.errorDescription}
                            onRetry={onRetry}
                            retryLabel={labels.retry}
                        />
                    )] : []),
                    ...(!isLoading && !isError && options.length === 0 ? [() => (
                        <AsyncContentEmpty title={labels.noCourses} />
                    )] : []),
                    () => (
                        <InputTextarea
                            label={labels.description}
                            placeholder={labels.descriptionPlaceholder}
                            rows={3}
                            isDisabled={isSubmitting}
                            value={description}
                            onValueChange={onDescriptionChange}
                        />
                    ),
                ]}
            />
        )}
        actions={() => (
            <Button
                variant="primary"
                classNames={["w-full"]}
                isDisabled={!selectedEnrollmentId || isSubmitting}
                isPending={isSubmitting}
                label={labels.submit}
                onPress={onSubmit}
            />
        )}
    />
)
