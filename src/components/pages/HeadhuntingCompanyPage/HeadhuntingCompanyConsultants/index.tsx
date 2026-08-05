"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    ChatCircleDotsIcon,
    EnvelopeSimpleIcon,
    LinkedinLogoIcon,
    PhoneIcon,
} from "@phosphor-icons/react"
import { useAppSelector } from "@/redux/hooks"
import { useQueryHeadhunterCompaniesSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhunterCompaniesSwr"
import { useQueryHeadhuntersSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntersSwr"
import { pathConfig } from "@/resources/path"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import {
    ConsultantProfileBody,
    type ConsultantProfileBodyContactLink,
} from "@/components/blocks/consultant/ConsultantProfileBody"
import type { ConsultantCardConsultant } from "@/components/blocks/consultant/ConsultantCard"
import { _HeadhuntingCompanyConsultants } from "./component"

/**
 * `HeadhuntingCompanyConsultants` — the CONNECTED half: grid of consultant
 * cards for one headhunting company. Self-contained section (single-use): it
 * reads all consultants and the active company id from the `headhunter` redux
 * slice (synced by the parent hook), computes the skeleton/empty/error state,
 * and hands them to the presentational {@link _HeadhuntingCompanyConsultants}
 * — so the container renders `<HeadhuntingCompanyConsultants />` with no
 * props. See `design/storybook/architecture/split.md`.
 *
 * Pressing a tile opens that consultant's profile MODAL, and the modal lives
 * HERE rather than inside the card. The card is one tile: it reports a press
 * and nothing else. Owning the open state one level up is what lets a single
 * `ConsultantCard` serve this page and the directory page, whose press means
 * something different (it selects into redux).
 */
export const HeadhuntingCompanyConsultants = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const companyId = useAppSelector((state) => state.headhunter.companyId)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // read the loader queries' error/retry so a failed query surfaces error+retry
    // rather than a perpetual skeleton (Redux stays `undefined` on failure). SWR
    // dedupes with the container's own calls.
    const { error: companiesError, mutate: mutateCompanies } = useQueryHeadhunterCompaniesSwr()
    const { error: consultantsError, mutate: mutateConsultants } = useQueryHeadhuntersSwr()
    const error = companiesError ?? consultantsError

    /** Which consultant's profile is open; `null` = the modal is closed. */
    const [openedId, setOpenedId] = useState<string | null>(null)

    const companyConsultants = useMemo(() => {
        if (!consultants?.length || !companyId) {
            return []
        }
        return consultants
            .filter((entry) => (entry.company?.id ?? entry.companyId) === companyId)
            .sort((a, b) => a.sortIndex - b.sortIndex)
    }, [companyId, consultants])

    /** The tile's own shape — the card names exactly the fields it draws. */
    const cardConsultants = useMemo<Array<ConsultantCardConsultant>>(
        () => companyConsultants.map((entry) => ({
            id: entry.id,
            fullName: entry.fullName,
            jobTitle: entry.jobTitle ?? undefined,
            companyTitle: entry.company?.title ?? undefined,
            description: entry.description ?? undefined,
            avatarUrl: entry.avatarUrl ?? undefined,
        })),
        [companyConsultants],
    )

    const opened = useMemo(
        () => companyConsultants.find((entry) => entry.id === openedId) ?? null,
        [companyConsultants, openedId],
    )
    const openedCompanyTitle = opened?.company?.title ?? ""

    // real contact rows — only meaningful once unlocked (the BE nulls these
    // fields server-side while locked, so an absent field simply drops its row)
    const contactLinks = useMemo<Array<ConsultantProfileBodyContactLink>>(() => {
        if (!opened?.contactUnlocked) {
            return []
        }
        const rows: Array<ConsultantProfileBodyContactLink> = []
        if (opened.email) {
            rows.push({ key: "email", label: opened.email, href: `mailto:${opened.email}`, icon: EnvelopeSimpleIcon })
        }
        if (opened.phoneNumber) {
            rows.push({ key: "phone", label: opened.phoneNumber, href: `tel:${opened.phoneNumber}`, icon: PhoneIcon })
        }
        if (opened.zaloNumber) {
            rows.push({
                key: "zalo",
                label: `${t("headhuntings.zalo")}: ${opened.zaloNumber}`,
                href: `https://zalo.me/${opened.zaloNumber}`,
                icon: ChatCircleDotsIcon,
            })
        }
        if (opened.linkedinUrl) {
            rows.push({ key: "linkedin", label: t("headhuntings.linkedin"), href: opened.linkedinUrl, icon: LinkedinLogoIcon })
        }
        return rows
    }, [opened, t])

    /** Navigate to the consultant's company page (from inside the profile modal). */
    const onOpenCompany = useCallback(() => {
        const targetId = opened?.company?.id ?? opened?.companyId
        if (!targetId || !courseDisplayId) {
            return
        }
        setOpenedId(null)
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .headhuntingCompanies(targetId)
                .build(),
        )
    }, [courseDisplayId, locale, opened, router])

    /** Send the viewer to their own CV gallery to raise their score + unlock contact. */
    const onImproveCv = useCallback(() => {
        setOpenedId(null)
        router.push(pathConfig().locale(locale).profile().cv().build())
    }, [locale, router])

    return (
        <>
            <_HeadhuntingCompanyConsultants
                // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
                isSkeleton={!consultants}
                isEmpty={companyConsultants.length === 0}
                error={error}
                onRetry={() => {
                    void mutateCompanies()
                    void mutateConsultants()
                }}
                consultants={cardConsultants}
                onOpenConsultant={setOpenedId}
                labels={{
                    emptyTitle: t("headhuntings.empty"),
                    errorTitle: t("headhuntings.error"),
                    retry: t("common.retry"),
                }}
            />

            <ModalShell
                isOpen={Boolean(opened)}
                onOpenChange={(next) => { if (!next) { setOpenedId(null) } }}
                title={t("headhuntings.modalTitle")}
                scroll="inside"
                body={() => opened ? (
                    <ConsultantProfileBody
                        consultant={{
                            fullName: opened.fullName,
                            jobTitle: opened.jobTitle ?? undefined,
                            companyTitle: openedCompanyTitle || undefined,
                            description: opened.description ?? undefined,
                            avatarUrl: opened.avatarUrl ?? undefined,
                            contactUnlocked: opened.contactUnlocked,
                            contactLinks,
                        }}
                        onOpenCompany={openedCompanyTitle ? onOpenCompany : undefined}
                        onImproveCv={onImproveCv}
                        lockedTitle={t("headhuntings.contactLockedTitle")}
                        lockedDescription={t("headhuntings.contactLocked", { score: opened.cvScoreUnlockThreshold })}
                        lockedCtaLabel={t("headhuntings.improveCv")}
                    />
                ) : null}
            />
        </>
    )
}
