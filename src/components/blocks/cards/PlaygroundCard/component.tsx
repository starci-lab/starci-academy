"use client"

import React from "react"
import {
    ArrowRightIcon,
    ListChecksIcon,
    TerminalWindowIcon,
} from "@phosphor-icons/react"
import { IdentityTile } from "@/components/atoms/display/IdentityTile"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link _PlaygroundCard} — presentational; all labels already resolved. */
export interface PlaygroundCardProps {
    /** Display title of the exercise. */
    title: string
    /** Already-localized "N steps" chip label. */
    stepCountLabel: string
    /** Already-localized CTA label ("Enter playground"). */
    ctaLabel: string
    /** Fired when the CTA is pressed — routes to the exercise's session route. */
    onOpen: () => void
}

/**
 * A hands-on Playground exercise summarised for the hub grid: identity tile +
 * title + step count + a "Enter playground" CTA. Modeled on
 * {@link import("@/components/blocks/cards/CourseCard").CourseCard}'s roomy
 * grid layout at a much smaller scope (no price/cover — just enough to pick
 * an exercise).
 *
 * @param props - {@link PlaygroundCardProps}
 */
export const _PlaygroundCard = ({
    title,
    stepCountLabel,
    ctaLabel,
    onOpen,
}: PlaygroundCardProps) => {
    return (
        <SurfaceCard
            identity={{ tier: "block", component: "PlaygroundCard" }}
            body={() => (
                <StackV
                    principle="card-caption"
                    explain="Stacks the exercise identity tile above its title and step chip so the card lead stays one vertical band."
                    items={[
                        () => (
                            <IdentityTile
                                icon={TerminalWindowIcon}
                                tone="accent"
                                size="lg"
                            />
                        ),
                        () => (
                            <StackV
                                principle="title-subtitle"
                                explain="Title over a step-count chip is a heading-plus-supporting-line pair, not label-field (no form control), not name-handle (no @handle), not icon-text (the chip is not a glyph glued to a label)."
                                items={[
                                    () => (
                                        <Typography
                                            size="h5"
                                            weight="bold"
                                            truncate
                                            text={title}
                                        />
                                    ),
                                    () => (
                                        <Chip
                                            icon={ListChecksIcon}
                                            text={stepCountLabel}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <Button
                    label={ctaLabel}
                    variant="primary"
                    suffixIcon={ArrowRightIcon}
                    align="between"
                    onPress={onOpen}
                />
            )}
        />
    )
}
