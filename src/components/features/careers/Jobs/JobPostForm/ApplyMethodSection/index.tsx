"use client"

import React from "react"
import { Input, Label, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { UseFormSetValue } from "react-hook-form"
import type { SubmitJobPostingFormValues } from "@/hooks/rhf/useSubmitJobPostingForm"
import { JobApplyMethod } from "@/modules/types/enums/job-apply-method"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"

/** Max length of a URL field. */
const URL_MAX = 2048

/** Props for {@link ApplyMethodSection}. */
export interface ApplyMethodSectionProps {
    applyMethod: JobApplyMethod
    applyUrl: string
    applyEmail: string
    /** Sets a single form field. */
    setValue: UseFormSetValue<SubmitJobPostingFormValues>
}

/**
 * "Cách ứng tuyển" section of the job-post form — a 2-option toggle between an
 * external application link and an email address, showing only the matching
 * input.
 *
 * @param props - {@link ApplyMethodSectionProps}
 */
export const ApplyMethodSection = ({
    applyMethod,
    applyUrl,
    applyEmail,
    setValue,
}: ApplyMethodSectionProps) => {
    const t = useTranslations()

    return (
        <LabeledCard
            label={t("jobs.post.sections.applyMethod")}
        >
            <div className="flex flex-col gap-3">
                <TabsCard
                    variant="primary"
                    leftTabs={{
                        selectedKey: applyMethod,
                        ariaLabel: t("jobs.post.applyMethod.toggleAria"),
                        onSelectionChange: (key) => setValue("applyMethod", String(key) as JobApplyMethod),
                        items: [
                            { key: JobApplyMethod.ExternalUrl, label: t("jobs.post.applyMethod.externalUrl") },
                            { key: JobApplyMethod.Email, label: t("jobs.post.applyMethod.email") },
                        ],
                    }}
                />

                {applyMethod === JobApplyMethod.ExternalUrl ? (
                    <TextField variant="secondary">
                        <Label htmlFor="job-post-apply-url">{t("jobs.post.applyMethod.urlLabel")}</Label>
                        <Input
                            id="job-post-apply-url"
                            type="url"
                            placeholder={t("jobs.post.applyMethod.urlPlaceholder")}
                            maxLength={URL_MAX}
                            value={applyUrl}
                            onChange={(event) => setValue("applyUrl", event.target.value)}
                        />
                    </TextField>
                ) : (
                    <TextField variant="secondary">
                        <Label htmlFor="job-post-apply-email">{t("jobs.post.applyMethod.emailLabel")}</Label>
                        <Input
                            id="job-post-apply-email"
                            type="email"
                            placeholder={t("jobs.post.applyMethod.emailPlaceholder")}
                            value={applyEmail}
                            onChange={(event) => setValue("applyEmail", event.target.value)}
                        />
                    </TextField>
                )}
            </div>
        </LabeledCard>
    )
}
