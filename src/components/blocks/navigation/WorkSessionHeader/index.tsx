"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _WorkSessionHeader, type WorkSessionHeaderProps } from "./component"

export type { WorkSessionHeaderIdentity } from "./component"

/** Props the connected {@link WorkSessionHeader} takes from its caller. */
export type WorkSessionHeaderConnectedProps = Omit<WorkSessionHeaderProps, "segmentAriaLabel">

/**
 * The shared WORK-SURFACE header band — the CONNECTED half: resolves the
 * per-segment aria-label via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link WorkSessionHeaderConnectedProps}
 */
export const WorkSessionHeader = (props: WorkSessionHeaderConnectedProps) => {
    const t = useTranslations()

    return (
        <_WorkSessionHeader
            {...props}
            segmentAriaLabel={(step) => t("common.workSessionHeaderSegmentAria", { step })}
        />
    )
}
