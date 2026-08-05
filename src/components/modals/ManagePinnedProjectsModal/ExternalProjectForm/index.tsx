"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { usePinExternalProjectForm } from "@/hooks/rhf/usePinExternalProjectForm"
import { _ExternalProjectForm, type ExternalProjectFormValues } from "./component"

/** Props for {@link ExternalProjectForm}. */
export interface ExternalProjectFormProps {
    /** Called after a pin succeeds (close the modal / switch to the list). */
    onSuccess?: () => void
}

/**
 * Form for pinning a free-form external project — the CONNECTED half. All form
 * state, validation, and the `pinExternalProject` mutation live in the
 * {@link usePinExternalProjectForm} RHF hook; this half resolves i18n and adapts
 * RHF's `watch`/`setValue` into the controlled `values`/`onValueChange` contract
 * the presentational {@link _ExternalProjectForm} takes. See `tiers/split.md`.
 *
 * @param props - {@link ExternalProjectFormProps}
 */
export const ExternalProjectForm = ({
    onSuccess,
}: ExternalProjectFormProps) => {
    const t = useTranslations()
    const {
        setValue,
        watch,
        onSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = usePinExternalProjectForm({ onSuccess })

    const values: ExternalProjectFormValues = watch()

    return (
        <_ExternalProjectForm
            values={values}
            onValueChange={(field, value) => setValue(field, value)}
            errors={{
                title: Boolean(errors.title),
                url: Boolean(errors.url),
            }}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            labels={{
                title: t("pinnedProjects.form.title"),
                titlePlaceholder: t("pinnedProjects.form.titlePlaceholder"),
                titleRequired: t("pinnedProjects.form.titleRequired"),
                url: t("pinnedProjects.form.url"),
                urlPlaceholder: t("pinnedProjects.form.urlPlaceholder"),
                urlInvalid: t("pinnedProjects.form.urlInvalid"),
                techStack: t("pinnedProjects.form.techStack"),
                techStackPlaceholder: t("pinnedProjects.form.techStackPlaceholder"),
                techStackHint: t("pinnedProjects.form.techStackHint"),
                description: t("pinnedProjects.form.description"),
                descriptionPlaceholder: t("pinnedProjects.form.descriptionPlaceholder"),
                submit: t("pinnedProjects.form.submit"),
            }}
        />
    )
}
