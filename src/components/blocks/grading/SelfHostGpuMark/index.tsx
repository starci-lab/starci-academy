"use client"

import React from "react"
import { Tooltip, cn } from "@heroui/react"
import { CpuIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SelfHostGpuMark}. */
export type SelfHostGpuMarkProps = WithClassNames<undefined>

/**
 * Accent GPU icon with a tooltip — marks models self-hosted on StarCi hardware
 * (e.g. RTX 5060). Icon only on the row; detail lives in the tooltip (no extra chip).
 */
export const SelfHostGpuMark = ({ className }: SelfHostGpuMarkProps) => {
    const t = useTranslations("aiSettings")

    return (
        <Tooltip>
            <Tooltip.Trigger
                aria-label={t("selfHostGpuAria")}
                className={cn("inline-flex shrink-0 cursor-default", className)}
            >
                <CpuIcon aria-hidden focusable="false" className="size-4 text-accent-soft-foreground" />
            </Tooltip.Trigger>
            <Tooltip.Content>
                <span className="text-sm">{t("selfHostGpuTooltip")}</span>
            </Tooltip.Content>
        </Tooltip>
    )
}
