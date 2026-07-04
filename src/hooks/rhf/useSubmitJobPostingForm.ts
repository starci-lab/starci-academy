"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { useMutateSubmitJobPostingSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSubmitJobPostingSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { JobApplyMethod } from "@/modules/types/enums/job-apply-method"
import { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import { WorkMode } from "@/modules/types/enums/work-mode"

/** Max length of the job title (mirrors the `title` column). */
const TITLE_MAX = 255
/** Max length of the description / requirements markdown (generous, matches `text` columns). */
const BODY_MAX = 8000
/** Max length of the free-text location. */
const LOCATION_MAX = 100
/** Max length of a URL field. */
const URL_MAX = 2048
/** Max length of a new-company title. */
const COMPANY_TITLE_MAX = 255

/** Editable job-posting form values. */
export interface SubmitJobPostingFormValues {
    /** Chosen existing company id — empty string means "use `newCompanyTitle` instead". */
    companyId: string
    /** Label of the chosen existing company (display-only, mirrors the typeahead pick). */
    companyLabel: string
    /** New company title — used when no existing company was picked. */
    newCompanyTitle: string
    /** Optional new-company logo URL. */
    newCompanyLogoUrl: string
    /** Optional new-company website URL. */
    newCompanyWebsiteUrl: string
    /** Job title (required). */
    title: string
    /** Employment arrangement (empty string = unset). */
    employmentType: JobEmploymentType | ""
    /** Preferred work arrangement (empty string = unset). */
    workMode: WorkMode | ""
    /** Free-text location. */
    location: string
    /** Minimum salary as typed text (empty = unset → "negotiable" with `salaryMax`). */
    salaryMin: string
    /** Maximum salary as typed text (empty = unset → "negotiable" with `salaryMin`). */
    salaryMax: string
    /** Markdown job description (required). */
    description: string
    /** Optional markdown requirements. */
    requirements: string
    /** How a candidate applies. */
    applyMethod: JobApplyMethod
    /** External application URL — required when `applyMethod === ExternalUrl`. */
    applyUrl: string
    /** Application email — required when `applyMethod === Email`. */
    applyEmail: string
}

/** Parameters for {@link useSubmitJobPostingForm}. */
export interface UseSubmitJobPostingFormParams {
    /** Called with the new posting id after a successful submit. */
    onSuccess?: (jobPostingId: string) => void
}

/**
 * react-hook-form for the public `/jobs/post` submission form. Field-level shape
 * validation lives in the zod schema; the cross-field business rules the backend
 * also enforces (exactly one of company/new-company, `applyUrl` XOR `applyEmail`
 * matching `applyMethod`) are checked in `onSubmit` and surfaced as an error toast
 * via {@link useGraphQLWithToast} — mirroring `usePersonalProjectIdeaForm`'s style
 * of throwing inside the GraphQL callback rather than field-level `setError`.
 *
 * @param params - {@link UseSubmitJobPostingFormParams}
 * @returns the RHF methods + `onSubmit`.
 */
export const useSubmitJobPostingForm = ({
    onSuccess,
}: UseSubmitJobPostingFormParams = {}) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const submitJobPostingSwr = useMutateSubmitJobPostingSwr()

    const schema = useMemo(
        () => z.object({
            companyId: z.string(),
            companyLabel: z.string(),
            newCompanyTitle: z.string().trim().max(COMPANY_TITLE_MAX),
            newCompanyLogoUrl: z.union([z.literal(""), z.string().trim().url().max(URL_MAX)]),
            newCompanyWebsiteUrl: z.union([z.literal(""), z.string().trim().url().max(URL_MAX)]),
            title: z.string().trim().min(1).max(TITLE_MAX),
            employmentType: z.union([z.nativeEnum(JobEmploymentType), z.literal("")]),
            workMode: z.union([z.nativeEnum(WorkMode), z.literal("")]),
            location: z.string().trim().max(LOCATION_MAX),
            salaryMin: z.string().trim(),
            salaryMax: z.string().trim(),
            description: z.string().trim().min(1).max(BODY_MAX),
            requirements: z.string().trim().max(BODY_MAX),
            applyMethod: z.nativeEnum(JobApplyMethod),
            applyUrl: z.union([z.literal(""), z.string().trim().url().max(URL_MAX)]),
            applyEmail: z.union([z.literal(""), z.string().trim().email().max(URL_MAX)]),
        }),
        [],
    )

    const form = useForm<SubmitJobPostingFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyId: "",
            companyLabel: "",
            newCompanyTitle: "",
            newCompanyLogoUrl: "",
            newCompanyWebsiteUrl: "",
            title: "",
            employmentType: "",
            workMode: "",
            location: "",
            salaryMin: "",
            salaryMax: "",
            description: "",
            requirements: "",
            applyMethod: JobApplyMethod.ExternalUrl,
            applyUrl: "",
            applyEmail: "",
        },
    })

    const onSubmit = form.handleSubmit(async (value) => {
        return runGraphQL(
            async () => {
                const companyId = value.companyId.trim()
                const newCompanyTitle = value.newCompanyTitle.trim()

                // exactly one of companyId / newCompany, mirroring the backend guard
                if (!companyId && !newCompanyTitle) {
                    throw new Error(t("jobs.post.errors.companyRequired"))
                }
                if (companyId && newCompanyTitle) {
                    throw new Error(t("jobs.post.errors.companyEitherOr"))
                }

                const applyUrl = value.applyUrl.trim()
                const applyEmail = value.applyEmail.trim()
                if (value.applyMethod === JobApplyMethod.ExternalUrl && !applyUrl) {
                    throw new Error(t("jobs.post.errors.applyUrlRequired"))
                }
                if (value.applyMethod === JobApplyMethod.Email && !applyEmail) {
                    throw new Error(t("jobs.post.errors.applyEmailRequired"))
                }

                const parseSalary = (raw: string): number | undefined => {
                    const trimmed = raw.trim()
                    if (!trimmed) {
                        return undefined
                    }
                    const parsed = Number(trimmed)
                    return Number.isFinite(parsed) ? parsed : undefined
                }

                const result = await submitJobPostingSwr.trigger({
                    title: value.title.trim(),
                    description: value.description.trim(),
                    requirements: value.requirements.trim() || undefined,
                    location: value.location.trim() || undefined,
                    workMode: value.workMode === "" ? undefined : value.workMode,
                    employmentType: value.employmentType === "" ? undefined : value.employmentType,
                    salaryMin: parseSalary(value.salaryMin),
                    salaryMax: parseSalary(value.salaryMax),
                    applyMethod: value.applyMethod,
                    applyUrl: value.applyMethod === JobApplyMethod.ExternalUrl ? applyUrl : undefined,
                    applyEmail: value.applyMethod === JobApplyMethod.Email ? applyEmail : undefined,
                    companyId: companyId || undefined,
                    newCompany: newCompanyTitle
                        ? {
                            title: newCompanyTitle,
                            logoUrl: value.newCompanyLogoUrl.trim() || undefined,
                            websiteUrl: value.newCompanyWebsiteUrl.trim() || undefined,
                        }
                        : undefined,
                })
                const env = result?.data?.submitJobPosting
                if (!env) {
                    throw new Error(t("toast.defaultError"))
                }
                if (env.success && env.data) {
                    onSuccess?.(env.data)
                }
                return env
            },
            {
                showErrorToast: true,
                showSuccessToast: false,
            },
        )
    })

    return {
        ...form,
        onSubmit,
    }
}
