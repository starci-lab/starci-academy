"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _SelfHostGpuMark } from "./component"

/** Props the connected {@link SelfHostGpuMark} takes from its caller. */
export type SelfHostGpuMarkConnectedProps = WithClassNames<undefined>

/**
 * Accent GPU icon with a tooltip — the CONNECTED half: resolves the aria/tooltip
 * labels via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link SelfHostGpuMarkConnectedProps}
 */
export const SelfHostGpuMark = ({ className }: SelfHostGpuMarkConnectedProps) => {
    const t = useTranslations("aiSettings")
    return (
        <_SelfHostGpuMark
            className={className}
            ariaLabel={t("selfHostGpuAria")}
            tooltipLabel={t("selfHostGpuTooltip")}
        />
    )
}
