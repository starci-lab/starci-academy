"use client"

import React, { useEffect, useState } from "react"
import { Button, Input, Label, TextField, Typography } from "@heroui/react"
import { BuildingsIcon, XIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { UseFormSetValue } from "react-hook-form"
import { useQueryHeadhuntingCompanySuggestionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntingCompanySuggestionsSwr"
import type { SubmitJobPostingFormValues } from "@/hooks/rhf/useSubmitJobPostingForm"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SearchInput } from "@/components/reuseable/SearchInput"

/** Debounce window (ms) before a typed search hits the suggestions backend. */
const SEARCH_DEBOUNCE_MS = 350
/** Max length of a new-company title (mirrors the `title` column cap used elsewhere). */
const COMPANY_TITLE_MAX = 255

/** Props for {@link CompanySection}. */
export interface CompanySectionProps {
    /** Chosen existing company id (empty = none picked yet). */
    companyId: string
    /** Chosen existing company's display label. */
    companyLabel: string
    /** New-company field values (used when no existing company is picked). */
    newCompanyTitle: string
    newCompanyLogoUrl: string
    newCompanyWebsiteUrl: string
    /** Sets a single form field. */
    setValue: UseFormSetValue<SubmitJobPostingFormValues>
}

/**
 * "Công ty" section of the job-post form: an ES-backed company typeahead to pick
 * an EXISTING {@link import("@/modules/types/entities/headhunting-company").HeadhuntingCompanyEntity},
 * or — when nothing is picked — a fallback set of fields to register a brand-new
 * company inline. Exactly one of the two paths feeds `submitJobPosting` (enforced
 * in {@link import("@/hooks/rhf/useSubmitJobPostingForm").useSubmitJobPostingForm}).
 *
 * @param props - {@link CompanySectionProps}
 */
export const CompanySection = ({
    companyId,
    companyLabel,
    newCompanyTitle,
    newCompanyLogoUrl,
    newCompanyWebsiteUrl,
    setValue,
}: CompanySectionProps) => {
    const t = useTranslations()

    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    const { data: suggestionItems } = useQueryHeadhuntingCompanySuggestionsSwr(debouncedQuery)
    const suggestions = suggestionItems ?? []

    const hasPickedCompany = Boolean(companyId)

    return (
        <LabeledCard
            label={t("jobs.post.sections.company")}
            icon={<BuildingsIcon aria-hidden focusable="false" className="size-5" />}
        >
            <div className="flex flex-col gap-3">
                {hasPickedCompany ? (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-default px-4 py-3">
                        <Typography type="body-sm" weight="medium">
                            {companyLabel}
                        </Typography>
                        <Button
                            variant="tertiary"
                            size="sm"
                            onPress={() => {
                                setValue("companyId", "")
                                setValue("companyLabel", "")
                                setQuery("")
                            }}
                        >
                            <XIcon aria-hidden focusable="false" className="size-4" />
                            {t("jobs.post.company.change")}
                        </Button>
                    </div>
                ) : (
                    <>
                        <SearchInput
                            value={query}
                            onValueChange={setQuery}
                            placeholder={t("jobs.post.company.searchPlaceholder")}
                            suggestions={suggestions}
                            onSelectSuggestion={(suggestion) => {
                                setValue("companyId", suggestion.id)
                                setValue("companyLabel", suggestion.label)
                                setQuery("")
                            }}
                        />
                        <Typography type="body-xs" color="muted">
                            {t("jobs.post.company.notFoundHint")}
                        </Typography>

                        <div className="flex flex-col gap-3 border-t border-default pt-3">
                            <TextField variant="secondary">
                                <Label htmlFor="job-post-new-company-title">
                                    {t("jobs.post.company.newTitle")}
                                </Label>
                                <Input
                                    id="job-post-new-company-title"
                                    placeholder={t("jobs.post.company.newTitlePlaceholder")}
                                    maxLength={COMPANY_TITLE_MAX}
                                    value={newCompanyTitle}
                                    onChange={(event) => setValue("newCompanyTitle", event.target.value)}
                                />
                            </TextField>
                            <TextField variant="secondary">
                                <Label htmlFor="job-post-new-company-logo">
                                    {t("jobs.post.company.newLogoUrl")}
                                </Label>
                                <Input
                                    id="job-post-new-company-logo"
                                    type="url"
                                    placeholder={t("jobs.post.company.newLogoUrlPlaceholder")}
                                    value={newCompanyLogoUrl}
                                    onChange={(event) => setValue("newCompanyLogoUrl", event.target.value)}
                                />
                            </TextField>
                            <TextField variant="secondary">
                                <Label htmlFor="job-post-new-company-website">
                                    {t("jobs.post.company.newWebsiteUrl")}
                                </Label>
                                <Input
                                    id="job-post-new-company-website"
                                    type="url"
                                    placeholder={t("jobs.post.company.newWebsiteUrlPlaceholder")}
                                    value={newCompanyWebsiteUrl}
                                    onChange={(event) => setValue("newCompanyWebsiteUrl", event.target.value)}
                                />
                            </TextField>
                        </div>
                    </>
                )}
            </div>
        </LabeledCard>
    )
}
