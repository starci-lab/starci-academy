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
} from "@/hooks"
import { usePersonalProjectGithubForm } from "@/hooks/zustand"
/**
 * GitHub URL (debounced sync) + branch field for the personal project.
 */
export const PersonalProjectSubmission = () => {
    const t = useTranslations()
    // Component CHỦ → enableSync: true (chạy debounced sync url/branch).
    const {
        githubUrl,
        branch,
        errors,
        touched,
        setGithubUrl,
        setBranch,
        setTouchedGithubUrl,
        setTouchedBranch,
        setBranchError,
    } = usePersonalProjectGithubForm({ enableSync: true })
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const urlInvalid =
        Boolean(touched.githubUrl && errors.githubUrl)
    const branchInvalid =
        Boolean(touched.branch && errors.branch)

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
                        value={githubUrl}
                        onChange={(event) => setGithubUrl(event.target.value)}
                        onBlur={() => setTouchedGithubUrl(true)}
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
                <FieldError>{errors.githubUrl}</FieldError>
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
                        value={branch}
                        onChange={(event) => setBranch(event.target.value)}
                        onBlur={() => setTouchedBranch(true)}
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
                <FieldError>{errors.branch}</FieldError>
            </TextField>
            <div className="h-3" />
            <Button
                variant="secondary"
                isDisabled={syncBranchSwr.isMutating}
                onPress={() => {
                    setBranch("main")
                    setBranchError(null)
                }}
            >
                {t("finalProject.page.submitGithub.resetButton")}
            </Button>
        </div>
    )
}
