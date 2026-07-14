"use client"

import React from "react"
import {
    Button,
    Card,
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ListChecksIcon,
    TerminalWindowIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PlaygroundCard}. */
export interface PlaygroundCardProps extends WithClassNames<undefined> {
    /** Display title of the exercise. */
    title: string
    /** Number of guided steps in the exercise. */
    stepCount: number
    /** Fired when the CTA is pressed — routes to the exercise's session route. */
    onOpen: () => void
}

/**
 * A hands-on Playground exercise summarised for the hub grid: icon tile +
 * title + step count + a "Vào playground" CTA. Modeled on
 * {@link import("@/components/blocks/cards/CourseCard").CourseCard}'s roomy
 * grid layout at a much smaller scope (no price/cover — just enough to pick
 * an exercise).
 *
 * @param props - {@link PlaygroundCardProps}
 */
export const PlaygroundCard = ({
    title,
    stepCount,
    onOpen,
    className,
}: PlaygroundCardProps) => {
    const t = useTranslations()

    return (
        <Card className={cn("flex flex-col overflow-hidden rounded-3xl", className)}>
            <Card.Content className="flex flex-col gap-3">
                <IconTile icon={<TerminalWindowIcon aria-hidden focusable="false" />} tone="accent" size="lg" />
                <div className="flex flex-col gap-1">
                    <Typography type="h6" weight="bold" truncate>
                        {title}
                    </Typography>
                    <Chip size="sm" variant="secondary" className="w-fit">
                        <ListChecksIcon aria-hidden focusable="false" className="size-4" />
                        <Chip.Label>
                            {t("playground.hub.stepCount", { count: stepCount })}
                        </Chip.Label>
                    </Chip>
                </div>
            </Card.Content>
            <Card.Footer className="mt-auto">
                <Button variant="primary" className="w-full" onPress={onOpen}>
                    {t("playground.hub.cta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                </Button>
            </Card.Footer>
        </Card>
    )
}
