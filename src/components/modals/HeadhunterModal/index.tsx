"use client"

import { Button, Link, Modal } from "@heroui/react"
import { BuildingsIcon, LinkedinLogoIcon, PhoneIcon } from "@phosphor-icons/react"
import { ConsultantAvatar } from "@/components/layouts/Headhuntings/ConsultantAvatar"
import { useHeadhunterOverlayState } from "@/hooks/singleton"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import React from "react"
/**
 * Headhunter profile modal with bio and links to company, LinkedIn, and Zalo.
 */
export const HeadhunterModal = () => {
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

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container--narrow" scroll="inside">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-center text-xl font-bold">
                                {t("headhuntings.modalTitle")}
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            {headhunter ? (
                                <div className="flex flex-col items-center gap-4 px-2 pb-4">
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
                                            <BuildingsIcon className="size-4" aria-hidden />
                                            {headhunter.company.title}
                                        </Button>
                                    ) : null}
                                    {headhunter.description ? (
                                        <p className="text-muted mt-4 w-full text-left text-sm leading-relaxed">
                                            {headhunter.description}
                                        </p>
                                    ) : null}
                                    <div className="mt-2 flex w-full flex-wrap justify-center gap-3">
                                        {headhunter.linkedinUrl ? (
                                            <Link
                                                href={headhunter.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-accent"
                                            >
                                                <LinkedinLogoIcon className="size-4" aria-hidden />
                                                {t("headhuntings.linkedin")}
                                            </Link>
                                        ) : null}
                                        {headhunter.zaloPhone ? (
                                            <Link
                                                href={`https://zalo.me/${headhunter.zaloPhone.replace(/\D/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-accent"
                                            >
                                                <PhoneIcon className="size-4" aria-hidden />
                                                {t("headhuntings.zalo")}: {headhunter.zaloPhone}
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
