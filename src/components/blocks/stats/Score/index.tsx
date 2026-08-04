"use client"

import React, { useMemo } from "react"
import { useFormatter, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _Score, type ScoreProps } from "./component"

/** Props the connected {@link Score} takes from its caller. */
export type ScoreConnectedProps = Omit<ScoreProps, "label" | "ariaLabel"> & WithClassNames<undefined>

/**
 * Renders `current/max` — the CONNECTED half: formats the numbers via
 * `useFormatter` and resolves the fraction/aria text via `t()`. See
 * `design/storybook/architecture/split.md`.
 * @param props - {@link ScoreConnectedProps}
 */
export const Score = (props: ScoreConnectedProps) => {
    const { current, max } = props
    const t = useTranslations()
    const format = useFormatter()

    const currentLabel = format.number(current, { maximumFractionDigits: 2 })
    const maxLabel = format.number(max, { maximumFractionDigits: 2 })

    const label = useMemo(
        () => t("score.fraction", { current: currentLabel, max: maxLabel }),
        [t, currentLabel, maxLabel],
    )

    const ariaLabel = useMemo(
        () => t("score.aria", { current: currentLabel, max: maxLabel }),
        [t, currentLabel, maxLabel],
    )

    return <_Score {...props} label={label} ariaLabel={ariaLabel} />
}
