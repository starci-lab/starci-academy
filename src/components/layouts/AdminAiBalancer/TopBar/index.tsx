"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    ArrowLeftIcon,
    FilmStripIcon,
} from "@phosphor-icons/react"
import {
    useRouter,
} from "next/navigation"
import {
    useTranslations,
} from "next-intl"

/**
 * Admin tool navigation for the AI balancer health page.
 */
export const TopBar = () => {
    const router = useRouter()
    const t = useTranslations("admin.aiBalancer")

    const onBack = useCallback(
        () => {
            router.push("../../admin")
        },
        [
            router,
        ],
    )

    const onOpenUploadVideo = useCallback(
        () => {
            router.push("../upload-video")
        },
        [
            router,
        ],
    )

    return (
        <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onPress={onBack}
            >
                <ArrowLeftIcon className="h-4 w-4" />
                {t("backToAdmin")}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onPress={onOpenUploadVideo}
            >
                <FilmStripIcon className="h-4 w-4" />
                {t("uploadVideoTool")}
            </Button>
        </div>
    )
}
