"use client"

import { ArrowLeft as ArrowLeftIcon, Cpu as CpuIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    useRouter,
} from "next/navigation"
import {
    useTranslations,
} from "next-intl"

/**
 * Top navigation bar holding the "Back to admin" button.
 *
 * Self-contained section (single-use): owns its own back-navigation handler via
 * the router, so the container renders `<TopBar />` with no props. "use client"
 * for the HeroUI interactive Button and the router.
 */
export const TopBar = () => {
    const router = useRouter()
    const t = useTranslations("admin.aiBalancer")

    /** Navigate back to the admin page. */
    const onBack = useCallback(
        () => {
            router.push("../../admin")
        },
        [router],
    )

    /** Open the AI balancer health dashboard. */
    const onOpenAiBalancer = useCallback(
        () => {
            router.push("../ai-balancer")
        },
        [
            router,
        ],
    )

    return (
        <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
                id="admin-back-button"
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
                onPress={onOpenAiBalancer}
            >
                <CpuIcon className="h-4 w-4" />
                {t("title")}
            </Button>
        </div>
    )
}
