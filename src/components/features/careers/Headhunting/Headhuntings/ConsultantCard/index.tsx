"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Typography } from "@heroui/react"
import {
    BuildingsIcon,
    ChatCircleDotsIcon,
    EnvelopeSimpleIcon,
    LinkedinLogoIcon,
    PhoneIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ConsultantAvatar } from "../ConsultantAvatar"
import type { ConsultantEntity } from "@/modules/types/entities/consultant"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { PressableCard } from "@/components/blocks/cards/PressableCard"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import {
    ConsultantProfileBody,
    type ConsultantProfileBodyContactLink,
} from "@/components/starci/blocks/consultant/ConsultantProfileBody"

/** Props for {@link ConsultantCard}. */
export interface ConsultantCardProps extends WithClassNames<undefined> {
    /** Consultant row from API / Redux. */
    consultant: ConsultantEntity
}

/**
 * Card for one consultant: the whole card opens the profile modal
 * ({@link ConsultantProfileBody}), which renders the per-viewer contact-reveal
 * gate — the real contact links once `contactUnlocked`, or a locked callout
 * naming the required CV score otherwise. Company navigation lives inside the
 * modal (a single whole-card press target keeps the card valid + accessible).
 * List-item block — the parent passes the entity via props.
 * @param props - {@link ConsultantCardProps}
 */
export const ConsultantCard = ({ consultant, className }: ConsultantCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const [isOpen, setIsOpen] = useState(false)

    const companyTitle = useMemo(
        () => consultant.company?.title ?? "",
        [consultant.company?.title],
    )

    /** Navigate to the consultant's company page (from inside the profile modal). */
    const onOpenCompany = useCallback(() => {
        const companyId = consultant.company?.id ?? consultant.companyId
        if (!companyId || !courseDisplayId) {
            return
        }
        setIsOpen(false)
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .headhuntingCompanies(companyId)
                .build(),
        )
    }, [
        consultant.company?.id,
        consultant.companyId,
        courseDisplayId,
        locale,
        router,
    ])

    /** Send the viewer to their own CV gallery to raise their score + unlock contact. */
    const onImproveCv = useCallback(() => {
        setIsOpen(false)
        router.push(pathConfig().locale(locale).profile().cv().build())
    }, [locale, router])

    // real contact rows — only meaningful once unlocked (the BE nulls these
    // fields server-side while locked, so an absent field simply drops its row)
    const contactLinks = useMemo<Array<ConsultantProfileBodyContactLink>>(() => {
        if (!consultant.contactUnlocked) {
            return []
        }
        const rows: Array<ConsultantProfileBodyContactLink> = []
        if (consultant.email) {
            rows.push({
                key: "email",
                label: consultant.email,
                href: `mailto:${consultant.email}`,
                icon: EnvelopeSimpleIcon,
            })
        }
        if (consultant.phoneNumber) {
            rows.push({
                key: "phone",
                label: consultant.phoneNumber,
                href: `tel:${consultant.phoneNumber}`,
                icon: PhoneIcon,
            })
        }
        if (consultant.zaloNumber) {
            rows.push({
                key: "zalo",
                label: `${t("headhuntings.zalo")}: ${consultant.zaloNumber}`,
                href: `https://zalo.me/${consultant.zaloNumber}`,
                icon: ChatCircleDotsIcon,
            })
        }
        if (consultant.linkedinUrl) {
            rows.push({
                key: "linkedin",
                label: t("headhuntings.linkedin"),
                href: consultant.linkedinUrl,
                icon: LinkedinLogoIcon,
            })
        }
        return rows
    }, [
        consultant.contactUnlocked,
        consultant.email,
        consultant.phoneNumber,
        consultant.zaloNumber,
        consultant.linkedinUrl,
        t,
    ])

    return (
        <>
            <PressableCard
                className={className}
                onPress={() => setIsOpen(true)}
                label={t("headhuntings.viewProfile")}
            >
                <div className="flex flex-col gap-3">
                    <ConsultantAvatar
                        avatarUrl={consultant.avatarUrl}
                        fullName={consultant.fullName}
                        size="card"
                        className="rounded-2xl"
                    />
                    <div className="flex flex-col gap-2">
                        <Typography type="h5" weight="semibold">{consultant.fullName}</Typography>
                        {consultant.jobTitle ? (
                            <Typography type="body-sm" color="muted">{consultant.jobTitle}</Typography>
                        ) : null}
                        {companyTitle ? (
                            <span className="inline-flex w-fit items-center gap-2 text-accent-soft-foreground">
                                <BuildingsIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                <Typography type="body-sm" weight="medium" className="text-accent-soft-foreground">{companyTitle}</Typography>
                            </span>
                        ) : null}
                        {consultant.description ? (
                            <Typography type="body-sm" color="muted" className="line-clamp-3">
                                {consultant.description}
                            </Typography>
                        ) : null}
                    </div>
                </div>
            </PressableCard>

            <ModalShell
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title={t("headhuntings.modalTitle")}
                scroll="inside"
            >
                <ConsultantProfileBody
                    consultant={{
                        fullName: consultant.fullName,
                        jobTitle: consultant.jobTitle ?? undefined,
                        companyTitle: companyTitle || undefined,
                        description: consultant.description ?? undefined,
                        avatarUrl: consultant.avatarUrl ?? undefined,
                        contactUnlocked: consultant.contactUnlocked,
                        contactLinks,
                    }}
                    onOpenCompany={companyTitle ? onOpenCompany : undefined}
                    onImproveCv={onImproveCv}
                    lockedTitle={t("headhuntings.contactLockedTitle")}
                    lockedDescription={t("headhuntings.contactLocked", { score: consultant.cvScoreUnlockThreshold })}
                    lockedCtaLabel={t("headhuntings.improveCv")}
                />
            </ModalShell>
        </>
    )
}
