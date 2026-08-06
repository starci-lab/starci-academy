"use client"

import { ArrowLeftIcon, FilmStripIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import { StackH } from "@/components/frames/Stack"

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
        <div className="pt-4">
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center" items={[
                    () => (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white"
                            onPress={onBack}
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            {t("backToAdmin")}
                        </Button>
                    ),
                    () => (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white"
                            onPress={onOpenUploadVideo}
                        >
                            <FilmStripIcon className="h-5 w-5" />
                            {t("uploadVideoTool")}
                        </Button>
                    ),
                ]} />
        </div>
    )
}
