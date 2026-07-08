"use client"

import {
    BuildingsIcon,
    LinkedinLogoIcon,
    LockIcon,
    PhoneIcon,
} from "@phosphor-icons/react"
import { Button, Link, Typography } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import React from "react"
import { ConsultantAvatar } from "@/components/features/careers/Headhunting/Headhuntings/ConsultantAvatar"
import { useHeadhunterOverlayState } from "@/hooks/zustand/overlay/hooks"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/**
 * Props for {@link HeadhunterModal}.
 */
export type HeadhunterModalProps = WithClassNames<undefined>

/**
 * Headhunter profile modal with bio and links to company, LinkedIn, and Zalo.
 *
 * @param props - Optional styling props.
 */
export const HeadhunterModal = (props: HeadhunterModalProps) => {
    const { className } = props
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { isOpen, setOpen } = useHeadhunterOverlayState()
    const headhunter = useAppSelector((state) => state.headhunter.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const onOpenCompany = () => {
        const companyId = headhunter?.company?.id ?? headhunter?.companyId
        if (!companyId || !courseDisplayId) {
            return
        }
        setOpen(false)
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .headhuntingCompanies(companyId)
                .build(),
        )
    }

    /** Route to the CV review page so the viewer can raise their score past the unlock threshold. */
    const onImproveCv = () => {
        setOpen(false)
        router.push(pathConfig().locale(locale).profile().cv().build())
    }

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            containerClassName="modal__container--narrow"
            scroll="inside"
            title={t("headhuntings.modalTitle")}
            titleClassName="text-center text-xl font-bold"
        >
            {headhunter ? (
                <div className="flex flex-col items-center gap-6 px-2 pb-4">
                    <ConsultantAvatar
                        avatarUrl={headhunter.avatarUrl}
                        fullName={headhunter.fullName}
                        size="detail"
                    />
                    <div className="w-full text-center">
                        <div className="text-2xl font-semibold">{headhunter.fullName}</div>
                        {headhunter.jobTitle ? (
                            <p className="text-muted mt-1 text-sm">{headhunter.jobTitle}</p>
                        ) : null}
                    </div>
                    {headhunter.company?.title ? (
                        <Button
                            className="mt-2"
                            onPress={onOpenCompany}
                        >
                            <BuildingsIcon className="size-5" aria-hidden />
                            {headhunter.company.title}
                        </Button>
                    ) : null}
                    {headhunter.description ? (
                        <p className="text-muted mt-4 w-full text-left text-sm leading-relaxed">
                            {headhunter.description}
                        </p>
                    ) : null}
                    {headhunter.contactUnlocked ? (
                        <div className="mt-2 flex w-full flex-wrap justify-center gap-3">
                            {headhunter.linkedinUrl ? (
                                <Link
                                    href={headhunter.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-accent"
                                >
                                    <LinkedinLogoIcon className="size-5" aria-hidden />
                                    {t("headhuntings.linkedin")}
                                </Link>
                            ) : null}
                            {headhunter.phoneNumber ? (
                                <Link
                                    href={`tel:${headhunter.phoneNumber.replace(/\D/g, "")}`}
                                    className="inline-flex items-center gap-1.5 text-sm text-accent"
                                >
                                    <PhoneIcon className="size-5" aria-hidden />
                                    {t("headhuntings.phone")}: {headhunter.phoneNumber}
                                </Link>
                            ) : null}
                            {headhunter.zaloNumber ? (
                                <Link
                                    href={`https://zalo.me/${headhunter.zaloNumber.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-accent"
                                >
                                    <PhoneIcon className="size-5" aria-hidden />
                                    {t("headhuntings.zalo")}: {headhunter.zaloNumber}
                                </Link>
                            ) : null}
                            {headhunter.email ? (
                                <Link
                                    href={`mailto:${headhunter.email}`}
                                    className="inline-flex items-center gap-1.5 text-sm text-accent"
                                >
                                    {t("headhuntings.email")}: {headhunter.email}
                                </Link>
                            ) : null}
                        </div>
                    ) : (
                        <div className="mt-2 flex w-full flex-col items-center gap-3 rounded-2xl border border-default px-4 py-4 text-center">
                            <LockIcon aria-hidden focusable="false" className="size-6 text-muted" />
                            <Typography type="body-sm" color="muted">
                                {t("headhuntings.contactLocked", { score: headhunter.cvScoreUnlockThreshold })}
                            </Typography>
                            <Button
                                variant="secondary"
                                size="sm"
                                onPress={onImproveCv}
                            >
                                {t("headhuntings.improveCv")}
                            </Button>
                        </div>
                    )}
                </div>
            ) : null}
        </ModalShell>
    )
}
