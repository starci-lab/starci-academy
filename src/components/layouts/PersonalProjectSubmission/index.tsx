"use client"

import React from "react"
import { Button, FieldError, Input, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { usePersonalProjectGithubUrlFormik } from "@/hooks/singleton"

/**
 * GitHub URL submission form for the personal project.
 * Extracted from the personal-project layout so the layout
 * stays clean and only handles breadcrumbs + grid structure.
 */
export const PersonalProjectSubmission = () => {
    const t = useTranslations()
    const githubUrlFormik = usePersonalProjectGithubUrlFormik()

    return (
        <div className="p-3">
            <div className="text-2xl font-bold">{t("finalProject.page.title")}</div>
            <div className="h-3" />
            <div className="text-sm text-muted">{t("finalProject.page.description")}</div>
            <div className="h-6" />
            <div className="mb-3 text-base font-medium">{t("finalProject.page.submitGithub.title")}</div>
            <TextField isInvalid={!!(githubUrlFormik.touched.githubUrl && githubUrlFormik.errors.githubUrl)}>
                <Input
                    variant="secondary"
                    placeholder={t("finalProject.page.submitGithub.placeholder")}
                    name="githubUrl"
                    value={githubUrlFormik.values.githubUrl}
                    onChange={(event) => githubUrlFormik.setFieldValue("githubUrl", event.target.value)}
                    onBlur={() => githubUrlFormik.setFieldTouched("githubUrl", true)}
                />
                <FieldError>{githubUrlFormik.errors.githubUrl || githubUrlFormik.status?.error}</FieldError>
            </TextField>
            <div className="flex items-center gap-2 mt-3">
                <Button
                    isPending={githubUrlFormik.isSubmitting}
                    isDisabled={!githubUrlFormik.isValid}
                    onPress={() => githubUrlFormik.submitForm()}
                >
                    {t("finalProject.page.submitGithub.cta")}
                </Button>
            </div>
        </div>
    )
}
