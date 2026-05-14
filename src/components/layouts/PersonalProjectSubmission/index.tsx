"use client"

import React from "react"
import {
    Button,
    FieldError,
    Input,
    Spinner,
    TextField,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
    usePersonalProjectGithubFormik,
} from "@/hooks/singleton"
/**
 * GitHub URL (debounced sync) + branch field for the personal project.
 */
export const PersonalProjectSubmission = () => {
    const t = useTranslations()
    const formik = usePersonalProjectGithubFormik()
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const urlInvalid =
        Boolean(formik.touched.githubUrl && formik.errors.githubUrl)
    const branchInvalid =
        Boolean(formik.touched.branch && formik.errors.branch)

    return (
        <div className="p-3">
            <div className="text-2xl font-bold">{t("finalProject.page.title")}</div>
            <div className="h-3" />
            <div className="text-sm text-muted">{t("finalProject.page.description")}</div>
            <div className="h-6" />
            <div className="mb-2 text-base font-semibold">
                {t("finalProject.page.submitGithub.repoFieldTitle")}
            </div>
            <TextField isInvalid={urlInvalid}>
                <div className="flex flex-col gap-2">
                    <Input
                        className="flex-1"
                        variant="secondary"
                        placeholder={t("finalProject.page.submitGithub.placeholder")}
                        name="githubUrl"
                        value={formik.values.githubUrl}
                        onChange={(event) => formik.setFieldValue("githubUrl", event.target.value)}
                        onBlur={() => formik.setFieldTouched("githubUrl", true)}
                    />
                    {
                        syncGithubSwr.isMutating
                            ? (
                                <div className="flex items-center gap-2">
                                    <Spinner size="sm" />
                                    <div className="text-sm text-muted">{t("finalProject.page.submitGithub.syncing")}</div>
                                </div>
                            )
                            : null
                    }
                </div>
                <FieldError>{formik.errors.githubUrl}</FieldError>
            </TextField>
            <div className="h-6" />
            <div className="mb-2 text-base font-semibold">
                {t("finalProject.page.submitGithub.branchFieldTitle")}
            </div>
            <TextField isInvalid={branchInvalid}>
                <div className="flex flex-col gap-2">
                    <Input
                        variant="secondary"
                        placeholder={t("finalProject.page.submitGithub.branchPlaceholder")}
                        name="branch"
                        value={formik.values.branch}
                        onChange={(event) => formik.setFieldValue("branch", event.target.value)}
                        onBlur={() => formik.setFieldTouched("branch", true)}
                    />
                    {
                        syncBranchSwr.isMutating
                            ? (
                                <div className="flex items-center gap-2">
                                    <Spinner size="sm" />
                                    <div className="text-sm text-muted">{t("finalProject.page.submitGithub.syncing")}</div>
                                </div>
                            )
                            : null
                    }
                </div>
                <FieldError>{formik.errors.branch}</FieldError>
            </TextField>
            <div className="h-3" />
            <Button
                variant="secondary"
                isDisabled={syncBranchSwr.isMutating}
                onPress={() => {
                    void formik.setFieldValue("branch", "main")
                    formik.setFieldError("branch", undefined)
                }}
            >
                {t("finalProject.page.submitGithub.resetButton")}
            </Button>
        </div>
    )
}
