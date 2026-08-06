"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CheckCircleIcon,
    CircleIcon,
} from "@phosphor-icons/react"
import {
    PHASE_LABEL_KEY,
} from "../../constants"
import type {
    CoursePriceRow,
} from "@/components/pages/CourseDetailPage/types"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Box } from "@/components/frames/Box"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link PhaseRow}. */
export interface PhaseRowProps extends WithClassNames<undefined> {
    /** One formatted pricing-phase row (list-item data prop). */
    row: CoursePriceRow
}

/**
 * One step in the price ladder — a single signal per row, no chip soup: a state
 * dot (sold-out ✓ / current ● / upcoming ○) + the phase name, and on the right
 * either a state label (sold-out / open now) or the phase price. The current
 * price + scarcity + discount live ONCE in the rail headline, so the current row
 * shows no price here.
 *
 * @param props - {@link PhaseRowProps}
 */
export const PhaseRow = ({ row, className }: PhaseRowProps) => {
    const t = useTranslations()

    return (
        <Box className={className}>
            <StackH gap={4} principle="content-row" justify="between" align="center" items={[
                () => (
                    <StackH gap={3} principle="identity" classNames={["min-w-0"]} align="center" items={[
                        () => (row.soldOut ? (
                            <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                        ) : row.isActive ? (
                            <CircleIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent-soft-foreground" />
                        ) : (
                            <CircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-foreground" />
                        )),
                        () => (
                            <Typography
                                type="body-sm"
                                weight={row.isActive ? "semibold" : "normal"}
                                color={row.soldOut ? "muted" : "default"}
                                className={row.isActive ? "text-accent-soft-foreground" : undefined}
                                truncate
                            >
                                {t(PHASE_LABEL_KEY[row.phase])}
                            </Typography>
                        ),
                    ]} />
                ),
                () => (row.soldOut ? (
                    <Typography type="body-xs" color="muted">
                        {t("courseLanding.soldOut")}
                    </Typography>
                ) : row.isActive ? (
                    <Typography type="body-xs" className="text-accent-soft-foreground">
                        {t("courseLanding.currentOpen")}
                    </Typography>
                ) : (
                    <Typography type="body-sm" weight="medium">
                        {row.formattedPrice}
                    </Typography>
                )),
            ]} />
        </Box>
    )
}
