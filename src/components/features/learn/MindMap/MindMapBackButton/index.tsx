"use client"

import React from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Panel } from "@xyflow/react"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"

/**
 * Floating back-affordance for the full-bleed mind-map canvas — the canvas has
 * no chrome/breadcrumb of its own, so without this button a learner has no way
 * to leave except by clicking a lesson node (a forward action, not back).
 */
export const MindMapBackButton = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)

    const onPress = () => {
        if (!displayId) {
            return
        }
        router.push(pathConfig().locale(locale).course(displayId).learn().build())
    }

    return (
        <Panel className="!m-4" position="top-left">
            <Button
                isIconOnly
                variant="secondary"
                aria-label={t("mindMap.backToCourse")}
                onPress={onPress}
                className="rounded-full shadow-lg"
            >
                <ArrowLeftIcon className="size-5" />
            </Button>
        </Panel>
    )
}
