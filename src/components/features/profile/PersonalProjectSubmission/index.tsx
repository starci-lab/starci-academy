"use client"

import React from "react"
import {
    Button,
    cn,
    FieldError,
    Input,
    Label,
    Spinner,
    Tabs,
    TextField,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
} from "@/hooks"
import { usePersonalProjectGithubForm } from "@/hooks/zustand"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PersonalProjectSubmission}. */
export type PersonalProjectSubmissionProps = WithClassNames<undefined>

/**
 * GitHub URL (debounced sync) + branch field for the personal project.
 * @param props - {@link PersonalProjectSubmissionProps}
 */
export const PersonalProjectSubmission = ({ className }: PersonalProjectSubmissionProps) => {
    const t = useTranslations()
    const tAutosave = useTranslations("autosave")
    // Owner component → enableSync: true (runs the debounced url/branch sync).
    const {
        githubUrl,
        branch,
        lang,
        errors,
        touched,
        autosaveStatus,
        setGithubUrl,
        setBranch,
        setLang,
        setTouchedGithubUrl,
        setTouchedBranch,
        setBranchError,
    } = usePersonalProjectGithubForm({ enableSync: true })
    /** Map an autosave status to its inline status text (idle renders nothing). */
    const autosaveText = (status: "idle" | "saving" | "saved" | "failed") => {
        if (status === "saving") {
            return tAutosave("saving")
        }
        if (status === "saved") {
            return tAutosave("saved")
        }
        if (status === "failed") {
            return tAutosave("failed")
        }
        return null
    }
    /** Languages the submission can be graded against (V2 per-language approach criteria). */
    const langOptions = [
        { id: "typescript", label: t("programmingLanguage.typescript") },
        { id: "java", label: t("programmingLanguage.java") },
        { id: "csharp", label: t("programmingLanguage.csharp") },
        { id: "go", label: t("programmingLanguage.go") },
    ]
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const urlInvalid =
        Boolean(touched.githubUrl && errors.githubUrl)
    const branchInvalid =
        Boolean(touched.branch && errors.branch)

    return (
        <div className={cn("flex flex-col gap-6 p-3", className)}>
            <div className="flex flex-col gap-3">
                <Typography type="h2" weight="bold">{t("finalProject.page.title")}</Typography>
                <Typography type="body-sm" color="muted">{t("finalProject.page.description")}</Typography>
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("finalProject.page.submitGithub.langFieldTitle")}</Label>
                <Tabs
                    selectedKey={lang}
                    variant="primary"
                    className="w-fit"
                    onSelectionChange={(key) => setLang(String(key))}
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("finalProject.page.submitGithub.langFieldTitle")}>
                            {langOptions.map((option) => (
                                <Tabs.Tab key={option.id} id={option.id}>
                                    {option.label}
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
                <Typography type="body-sm" color="muted">
                    {t("finalProject.page.submitGithub.langFieldHint")}
                </Typography>
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("finalProject.page.submitGithub.repoFieldTitle")}</Label>
                <TextField isInvalid={urlInvalid}>
                    <div className="flex flex-col gap-2">
                        <Input
                            className="flex-1"
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
                                        <Typography type="body-sm" color="muted">{t("finalProject.page.submitGithub.syncing")}</Typography>
                                    </div>
                                )
                                : autosaveText(autosaveStatus.githubUrl)
                                    ? <Typography type="body-sm" color="muted">{autosaveText(autosaveStatus.githubUrl)}</Typography>
                                    : null
                        }
                    </div>
                    <FieldError>{errors.githubUrl}</FieldError>
                </TextField>
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("finalProject.page.submitGithub.branchFieldTitle")}</Label>
                <TextField isInvalid={branchInvalid}>
                    <div className="flex flex-col gap-2">
                        <Input
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
                                        <Typography type="body-sm" color="muted">{t("finalProject.page.submitGithub.syncing")}</Typography>
                                    </div>
                                )
                                : autosaveText(autosaveStatus.branch)
                                    ? <Typography type="body-sm" color="muted">{autosaveText(autosaveStatus.branch)}</Typography>
                                    : null
                        }
                    </div>
                    <FieldError>{errors.branch}</FieldError>
                </TextField>
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
        </div>
    )
}
