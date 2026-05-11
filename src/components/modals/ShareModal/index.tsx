"use client"

import React, { useMemo } from "react"
import { Modal, Button, Tooltip } from "@heroui/react"
import { useShareOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { QRCode } from "@/components/reuseable"
import { pathConfig } from "@/resources/path"
import { toast } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    CopyIcon,
    FacebookLogoIcon,
    TwitterLogoIcon,
    TelegramLogoIcon,
    LinkedinLogoIcon,
} from "@phosphor-icons/react"

export const ShareModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useShareOverlayState()
    const content = useAppSelector((state) => state.content.entity)

    const shareUrl = useMemo(() => {
        if (!content?.displayId) return ""
        return `${typeof window !== "undefined" ? window.location.origin : ""}${pathConfig().locale().publicContent(content.displayId).build()}`
    }, [content?.displayId])

    const shareTitle = content?.title ?? ""

    const socialLinks = useMemo(() => [
        {
            label: "Facebook",
            icon: <FacebookLogoIcon weight="fill" className="size-6 text-[#1877F2]" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "Twitter",
            icon: <TwitterLogoIcon weight="fill" className="size-6 text-[#1DA1F2]" />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        },
        {
            label: "Telegram",
            icon: <TelegramLogoIcon weight="fill" className="size-6 text-[#0088cc]" />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        },
        {
            label: "LinkedIn",
            icon: <LinkedinLogoIcon weight="fill" className="size-6 text-[#0A66C2]" />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ], [shareUrl, shareTitle])

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="md">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-lg font-bold">
                                {t("content.share")}
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col items-center gap-6 pb-4">
                                {/* QR Code */}
                                {shareUrl && (
                                    <div className="flex flex-col items-center gap-2">
                                        <QRCode size={160} data={shareUrl} />
                                        <span className="text-xs text-muted">
                                            {t("content.scanQr")}
                                        </span>
                                    </div>
                                )}

                                {/* Copy link */}
                                <div className="flex w-full items-center gap-2 rounded-xl border bg-default-100 px-3 py-2">
                                    <span className="flex-1 truncate text-sm text-muted">
                                        {shareUrl}
                                    </span>
                                    <Tooltip content={t("content.copyLink")}>
                                        <Button
                                            size="sm"
                                            variant="soft"
                                            color="accent"
                                            onPress={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(shareUrl)
                                                    toast.success(t("content.linkCopied"))
                                                } catch {
                                                    toast.danger("Failed to copy")
                                                }
                                            }}
                                            id="share-copy-btn"
                                        >
                                            <CopyIcon className="size-4" />
                                        </Button>
                                    </Tooltip>
                                </div>

                                {/* Social share buttons */}
                                <div className="flex items-center gap-4">
                                    {socialLinks.map((s) => (
                                        <Tooltip key={s.label} content={s.label}>
                                            <Button
                                                size="sm"
                                                variant="soft"
                                                color="default"
                                                onPress={() => window.open(s.url, "_blank", "noopener,noreferrer")}
                                                id={`share-${s.label.toLowerCase()}-btn`}
                                            >
                                                {s.icon}
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
