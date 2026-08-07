"use client"

import React, { useState } from "react"
import { Button, Spinner, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { CompanySection } from "./CompanySection"
import { PositionSection } from "./PositionSection"
import { ApplyMethodSection } from "./ApplyMethodSection"
import { SubmitSuccess } from "./SubmitSuccess"
import { useSubmitJobPostingForm } from "@/hooks/rhf/useSubmitJobPostingForm"
import { useAppSelector } from "@/redux/hooks"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link JobPostFormPage}. */
export type JobPostFormPageProps = Record<string, never>
/**
 * Public job-post form — `/jobs/post`. Any signed-in user can submit an opening;
 * it goes live immediately (no approval queue). Sections are grouped by MEANING
 * (company · position · how to apply), each an independent `LabeledCard` — not
 * one card per field. On success, replaces the form with a persistent
 * confirmation screen ({@link SubmitSuccess}) rather than a toast, since this is
 * a full page the viewer navigated to, not a modal.
 *
 * @param props - {@link JobPostFormPageProps}
 */
export const JobPostFormPage = () => {
    const t = useTranslations()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const [submittedJobId, setSubmittedJobId] = useState<string | null>(null)

    const {
        watch,
        setValue,
        onSubmit,
        formState: { isSubmitting },
    } = useSubmitJobPostingForm({
        onSuccess: (jobPostingId) => setSubmittedJobId(jobPostingId),
    })

    const companyId = watch("companyId")
    const companyLabel = watch("companyLabel")
    const newCompanyTitle = watch("newCompanyTitle")
    const newCompanyLogoUrl = watch("newCompanyLogoUrl")
    const newCompanyWebsiteUrl = watch("newCompanyWebsiteUrl")
    const title = watch("title")
    const employmentType = watch("employmentType")
    const workMode = watch("workMode")
    const location = watch("location")
    const salaryMin = watch("salaryMin")
    const salaryMax = watch("salaryMax")
    const description = watch("description")
    const requirements = watch("requirements")
    const applyMethod = watch("applyMethod")
    const applyUrl = watch("applyUrl")
    const applyEmail = watch("applyEmail")

    if (submittedJobId) {
        return <SubmitSuccess jobDisplayId={submittedJobId} />
    }

    if (!authenticated) {
        return (
            <Box principle="center-measure"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
                className={"mx-auto max-w-2xl p-6 py-16 text-center"}>
                <StackV gap={3} principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    align="center" items={[
                        () => (
                            <Typography type="h5" weight="semibold" align="center">
                                {t("jobs.post.signedOut.title")}
                            </Typography>
                        ),
                        () => (
                            <Typography type="body-sm" color="muted" align="center">
                                {t("jobs.post.signedOut.description")}
                            </Typography>
                        ),
                    ]} />
            </Box>
        )
    }

    return (
        <Box principle="center-measure"
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            className={"mx-auto max-w-2xl p-6"}>
            <StackV gap={7} principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                items={[
                    () => (
                        <PageHeader
                            title={t("jobs.post.title")}
                            description={t("jobs.post.description")}
                        />
                    ),
                    () => (
                        <form onSubmit={onSubmit}>
                            <StackV gap={6} principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    () => (
                                        <CompanySection
                                            companyId={companyId}
                                            companyLabel={companyLabel}
                                            newCompanyTitle={newCompanyTitle}
                                            newCompanyLogoUrl={newCompanyLogoUrl}
                                            newCompanyWebsiteUrl={newCompanyWebsiteUrl}
                                            setValue={setValue}
                                        />
                                    ),
                                    () => (
                                        <PositionSection
                                            title={title}
                                            employmentType={employmentType}
                                            workMode={workMode}
                                            location={location}
                                            salaryMin={salaryMin}
                                            salaryMax={salaryMax}
                                            description={description}
                                            requirements={requirements}
                                            setValue={setValue}
                                        />
                                    ),
                                    () => (
                                        <ApplyMethodSection
                                            applyMethod={applyMethod}
                                            applyUrl={applyUrl}
                                            applyEmail={applyEmail}
                                            setValue={setValue}
                                        />
                                    ),
                                    () => (
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            isDisabled={isSubmitting}
                                            isPending={isSubmitting}
                                        >
                                            {({ isPending }) => (
                                                <>
                                                    {isPending ? <Spinner color="current" size="sm" /> : null}
                                                    {t("jobs.post.submit")}
                                                </>
                                            )}
                                        </Button>
                                    ),
                                ]} />
                        </form>
                    ),
                ]} />
        </Box>
    )
}
