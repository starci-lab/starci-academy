"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _SelfHostGpuMark } from "./component"

/** Props the connected {@link SelfHostGpuMark} takes from its caller. */
export type SelfHostGpuMarkConnectedProps = Record<string, never>
/**
 * Accent GPU icon with a tooltip — the CONNECTED half: resolves the aria/tooltip
 * labels via `t()`. See `design/storybook/architecture/split.md`.
 */
export const SelfHostGpuMark = () => {
    const t = useTranslations("aiSettings")
    return (
        <_SelfHostGpuMark
            ariaLabel={t("selfHostGpuAria")}
            tooltipLabel={t("selfHostGpuTooltip")}
        />
    )
}
