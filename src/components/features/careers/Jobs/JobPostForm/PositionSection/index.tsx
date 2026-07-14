"use client"

import React from "react"
import {
    Input,
    Label,
    ListBox,
    Select,
    TextArea,
    TextField,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { UseFormSetValue } from "react-hook-form"
import type { SubmitJobPostingFormValues } from "@/hooks/rhf/useSubmitJobPostingForm"
import { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import { WorkMode } from "@/modules/types/enums/work-mode"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"

/** Max length of the job title. */
const TITLE_MAX = 255
/** Max length of the free-text location. */
const LOCATION_MAX = 100
/** Sentinel key for "no selection" in the employment-type / work-mode selects. */
const NONE_KEY = "none"

/** Employment-type options + their i18n label keys. */
const EMPLOYMENT_TYPE_OPTIONS = [
    { value: JobEmploymentType.Fulltime, labelKey: "jobs.employmentType.fulltime" },
    { value: JobEmploymentType.Parttime, labelKey: "jobs.employmentType.parttime" },
    { value: JobEmploymentType.Internship, labelKey: "jobs.employmentType.internship" },
    { value: JobEmploymentType.Contract, labelKey: "jobs.employmentType.contract" },
] as const

/** Work-mode options + their i18n label keys (reuses the existing profile labels). */
const WORK_MODE_OPTIONS = [
    { value: WorkMode.Remote, labelKey: "publicProfile.workMode.remote" },
    { value: WorkMode.Hybrid, labelKey: "publicProfile.workMode.hybrid" },
    { value: WorkMode.Onsite, labelKey: "publicProfile.workMode.onsite" },
] as const

/** Props for {@link PositionSection}. */
export interface PositionSectionProps {
    title: string
    employmentType: JobEmploymentType | ""
    workMode: WorkMode | ""
    location: string
    salaryMin: string
    salaryMax: string
    description: string
    requirements: string
    /** Sets a single form field. */
    setValue: UseFormSetValue<SubmitJobPostingFormValues>
}

/**
 * "Vị trí tuyển dụng" section of the job-post form — title, employment type,
 * work mode, location, salary range (blank + blank = negotiable), and the
 * markdown description / requirements.
 *
 * @param props - {@link PositionSectionProps}
 */
export const PositionSection = ({
    title,
    employmentType,
    workMode,
    location,
    salaryMin,
    salaryMax,
    description,
    requirements,
    setValue,
}: PositionSectionProps) => {
    const t = useTranslations()

    return (
        <LabeledCard
            label={t("jobs.post.sections.position")}
        >
            <div className="flex flex-col gap-3">
                <TextField variant="secondary">
                    <Label htmlFor="job-post-title">{t("jobs.post.position.title")}</Label>
                    <Input
                        id="job-post-title"
                        placeholder={t("jobs.post.position.titlePlaceholder")}
                        maxLength={TITLE_MAX}
                        value={title}
                        onChange={(event) => setValue("title", event.target.value)}
                    />
                </TextField>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="job-post-employment-type">{t("jobs.post.position.employmentType")}</Label>
                        <Select.Root<{ id: string }, "single">
                            id="job-post-employment-type"
                            aria-label={t("jobs.post.position.employmentType")}
                            selectedKey={employmentType === "" ? NONE_KEY : employmentType}
                            onSelectionChange={(key) =>
                                setValue(
                                    "employmentType",
                                    key === NONE_KEY ? "" : (String(key) as JobEmploymentType),
                                )
                            }
                        >
                            <Select.Trigger aria-label={t("jobs.post.position.employmentType")}>
                                <Select.Value>
                                    {() => {
                                        const found = EMPLOYMENT_TYPE_OPTIONS.find(
                                            (option) => option.value === employmentType,
                                        )
                                        return (
                                            <Typography type="body-sm">
                                                {found ? t(found.labelKey) : t("jobs.post.position.employmentTypeNone")}
                                            </Typography>
                                        )
                                    }}
                                </Select.Value>
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox.Root aria-label={t("jobs.post.position.employmentType")}>
                                    <ListBox.Item id={NONE_KEY} textValue={t("jobs.post.position.employmentTypeNone")}>
                                        {t("jobs.post.position.employmentTypeNone")}
                                    </ListBox.Item>
                                    {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                                        <ListBox.Item key={option.value} id={option.value} textValue={t(option.labelKey)}>
                                            {t(option.labelKey)}
                                        </ListBox.Item>
                                    ))}
                                </ListBox.Root>
                            </Select.Popover>
                        </Select.Root>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="job-post-work-mode">{t("jobs.post.position.workMode")}</Label>
                        <Select.Root<{ id: string }, "single">
                            id="job-post-work-mode"
                            aria-label={t("jobs.post.position.workMode")}
                            selectedKey={workMode === "" ? NONE_KEY : workMode}
                            onSelectionChange={(key) =>
                                setValue("workMode", key === NONE_KEY ? "" : (String(key) as WorkMode))
                            }
                        >
                            <Select.Trigger aria-label={t("jobs.post.position.workMode")}>
                                <Select.Value>
                                    {() => {
                                        const found = WORK_MODE_OPTIONS.find(
                                            (option) => option.value === workMode,
                                        )
                                        return (
                                            <Typography type="body-sm">
                                                {found ? t(found.labelKey) : t("jobs.post.position.workModeNone")}
                                            </Typography>
                                        )
                                    }}
                                </Select.Value>
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox.Root aria-label={t("jobs.post.position.workMode")}>
                                    <ListBox.Item id={NONE_KEY} textValue={t("jobs.post.position.workModeNone")}>
                                        {t("jobs.post.position.workModeNone")}
                                    </ListBox.Item>
                                    {WORK_MODE_OPTIONS.map((option) => (
                                        <ListBox.Item key={option.value} id={option.value} textValue={t(option.labelKey)}>
                                            {t(option.labelKey)}
                                        </ListBox.Item>
                                    ))}
                                </ListBox.Root>
                            </Select.Popover>
                        </Select.Root>
                    </div>
                </div>

                <TextField variant="secondary">
                    <Label htmlFor="job-post-location">{t("jobs.post.position.location")}</Label>
                    <Input
                        id="job-post-location"
                        placeholder={t("jobs.post.position.locationPlaceholder")}
                        maxLength={LOCATION_MAX}
                        value={location}
                        onChange={(event) => setValue("location", event.target.value)}
                    />
                </TextField>

                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextField variant="secondary">
                            <Label htmlFor="job-post-salary-min">{t("jobs.post.position.salaryMin")}</Label>
                            <Input
                                id="job-post-salary-min"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                placeholder={t("jobs.post.position.salaryPlaceholder")}
                                value={salaryMin}
                                onChange={(event) => setValue("salaryMin", event.target.value)}
                            />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="job-post-salary-max">{t("jobs.post.position.salaryMax")}</Label>
                            <Input
                                id="job-post-salary-max"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                placeholder={t("jobs.post.position.salaryPlaceholder")}
                                value={salaryMax}
                                onChange={(event) => setValue("salaryMax", event.target.value)}
                            />
                        </TextField>
                    </div>
                    <Typography type="body-xs" color="muted">
                        {t("jobs.post.position.salaryHint")}
                    </Typography>
                </div>

                <TextField variant="secondary">
                    <Label htmlFor="job-post-description">{t("jobs.post.position.description")}</Label>
                    <TextArea
                        id="job-post-description"
                        rows={6}
                        placeholder={t("jobs.post.position.descriptionPlaceholder")}
                        className="resize-none"
                        value={description}
                        onChange={(event) => setValue("description", event.target.value)}
                    />
                </TextField>

                <TextField variant="secondary">
                    <Label htmlFor="job-post-requirements">{t("jobs.post.position.requirements")}</Label>
                    <TextArea
                        id="job-post-requirements"
                        rows={5}
                        placeholder={t("jobs.post.position.requirementsPlaceholder")}
                        className="resize-none"
                        value={requirements}
                        onChange={(event) => setValue("requirements", event.target.value)}
                    />
                </TextField>
            </div>
        </LabeledCard>
    )
}
