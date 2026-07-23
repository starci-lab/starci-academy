import React from "react"
import {
    Card,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ListChecksIcon,
    TerminalWindowIcon,
} from "@phosphor-icons/react"
import { IconTile } from "../../identity/IconTile/IconTile"
import { Button } from "../../buttons/Button/Button"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/cards/PlaygroundCard`. Composed from the local primitive
 * `IconTile` (branded terminal avatar) atop a HeroUI `Card`. The `next-intl`
 * strings (`playground.hub.*`) are inlined locally so the port is `@/`-free.
 * Synced to `src` later.
 */

/** Inlined VI copy for `playground.hub.*` (mirrors `src/messages/vi.json`). */
const stepCountLabel = (count: number) => `${count} bước`
const CTA_LABEL = "Vào playground"

/** Props for {@link PlaygroundCard}. */
export interface PlaygroundCardProps {
    /** Display title of the exercise. */
    title: string
    /** Number of guided steps in the exercise. */
    stepCount: number
    /** Fired when the CTA is pressed — routes to the exercise's session route. */
    onOpen: () => void
    /** Extra classes on the card root. */
    className?: string
    /** When on, emit `data-anat-part` on each anatomy part for the anatomy panel. */
    showAnatomy?: boolean
}

/**
 * A hands-on Playground exercise summarised for the hub grid: icon tile +
 * title + step count + a "Vào playground" CTA. Modeled on `CourseCard`'s roomy
 * grid layout at a much smaller scope (no price/cover — just enough to pick an
 * exercise).
 *
 * @param props - {@link PlaygroundCardProps}
 */
export const PlaygroundCard = ({
    title,
    stepCount,
    onOpen,
    className,
    showAnatomy,
}: PlaygroundCardProps) => {
    return (
        <Card className={cn("flex flex-col overflow-hidden rounded-3xl", className)}>
            <Card.Content className="flex flex-col gap-3">
                <IconTile
                    icon={<TerminalWindowIcon aria-hidden focusable="false" data-anat-part={showAnatomy ? "TerminalWindowIcon" : undefined} />}
                    tone="accent"
                    size="lg"
                    anatPart={showAnatomy ? "IconTile" : undefined}
                />
                <div className="flex flex-col gap-1">
                    <Typography type="h6" weight="bold" truncate data-anat-part={showAnatomy ? "Typography" : undefined}>
                        {title}
                    </Typography>
                    <StatusChip
                        tone="neutral"
                        icon={<ListChecksIcon aria-hidden focusable="false" data-anat-part={showAnatomy ? "ListChecksIcon" : undefined} />}
                        anatPart={showAnatomy ? "StatusChip" : undefined}
                    >
                        {stepCountLabel(stepCount)}
                    </StatusChip>
                </div>
            </Card.Content>
            <Card.Footer className="mt-auto">
                <Button
                    variant="primary"
                    className="w-full"
                    onPress={onOpen}
                    icon={<ArrowRightIcon aria-hidden focusable="false" data-anat-part={showAnatomy ? "ArrowRightIcon" : undefined} />}
                >
                    {CTA_LABEL}
                </Button>
            </Card.Footer>
        </Card>
    )
}
