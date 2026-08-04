"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _PlaygroundCard, type PlaygroundCardProps } from "./component"

/** Props the connected {@link PlaygroundCard} takes from its caller. */
export type PlaygroundCardConnectedProps = Omit<PlaygroundCardProps, "stepCountLabel" | "ctaLabel"> & {
    /** Number of guided steps in the exercise. */
    stepCount: number
}

/**
 * A hands-on Playground exercise summarised for the hub grid — the CONNECTED
 * half: resolves the step-count and CTA labels via `t()` and hands them to
 * the presentational {@link _PlaygroundCard}. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link PlaygroundCardConnectedProps}
 */
export const PlaygroundCard = ({ stepCount, ...props }: PlaygroundCardConnectedProps) => {
    const t = useTranslations()

    return (
        <_PlaygroundCard
            {...props}
            stepCountLabel={t("playground.hub.stepCount", { count: stepCount })}
            ctaLabel={t("playground.hub.cta")}
        />
    )
}
