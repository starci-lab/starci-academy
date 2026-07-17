"use client"

import {
    BuildingsIcon,
    ChatCircleIcon,
    EnvelopeIcon,
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
import { Callout, STATUS_ACTION_CLASS } from "@/components/blocks/feedback/Callout"

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
        >
            {headhunter ? (
                <div className="flex flex-col items-center gap-6">
                    <ConsultantAvatar
                        avatarUrl={headhunter.avatarUrl}
                        fullName={headhunter.fullName}
                        size="detail"
                    />
                    <div className="flex w-full flex-col items-center gap-2 text-center">
                        <Typography type="h4" weight="semibold">
                            {headhunter.fullName}
                        </Typography>
                        {headhunter.jobTitle ? (
                            <Typography type="body-sm" color="muted">
                                {headhunter.jobTitle}
                            </Typography>
                        ) : null}
                    </div>
                    {headhunter.company?.title ? (
                        <Button
                            variant="tertiary"
                            onPress={onOpenCompany}
                        >
                            <BuildingsIcon className="size-4" aria-hidden />
                            {headhunter.company.title}
                        </Button>
                    ) : null}
                    {headhunter.description ? (
                        <Typography
                            type="body-sm"
                            color="muted"
                            className="w-full text-left leading-relaxed"
                        >
                            {headhunter.description}
                        </Typography>
                    ) : null}
                    {headhunter.contactUnlocked ? (
                        <div className="flex w-full flex-wrap justify-center gap-3">
                            {headhunter.linkedinUrl ? (
                                <Link
                                    href={headhunter.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                >
                                    <LinkedinLogoIcon className="size-4" aria-hidden />
                                    {t("headhuntings.linkedin")}
                                </Link>
                            ) : null}
                            {headhunter.phoneNumber ? (
                                <Link
                                    href={`tel:${headhunter.phoneNumber.replace(/\D/g, "")}`}
                                    className="inline-flex items-center gap-2 text-sm text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                >
                                    <PhoneIcon className="size-4" aria-hidden />
                                    {t("headhuntings.phone")}: {headhunter.phoneNumber}
                                </Link>
                            ) : null}
                            {headhunter.zaloNumber ? (
                                <Link
                                    href={`https://zalo.me/${headhunter.zaloNumber.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                >
                                    <ChatCircleIcon className="size-4" aria-hidden />
                                    {t("headhuntings.zalo")}: {headhunter.zaloNumber}
                                </Link>
                            ) : null}
                            {headhunter.email ? (
                                <Link
                                    href={`mailto:${headhunter.email}`}
                                    className="inline-flex items-center gap-2 text-sm text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                >
                                    <EnvelopeIcon className="size-4" aria-hidden />
                                    {t("headhuntings.email")}: {headhunter.email}
                                </Link>
                            ) : null}
                        </div>
                    ) : (
                        <Callout
                            className="w-full"
                            icon={<LockIcon aria-hidden focusable="false" className="size-5" />}
                            title={t("headhuntings.contactLocked", {
                                score: headhunter.cvScoreUnlockThreshold,
                            })}
                            action={
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className={STATUS_ACTION_CLASS.default}
                                    onPress={onImproveCv}
                                >
                                    {t("headhuntings.improveCv")}
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : null}
        </ModalShell>
    )
}
