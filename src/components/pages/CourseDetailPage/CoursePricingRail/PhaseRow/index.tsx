"use client"

import React from "react"
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
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link PhaseRow}. */
export interface PhaseRowProps {
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
export const PhaseRow = ({ row }: PhaseRowProps) => {
    const t = useTranslations()

    return (
        <Box identity={{ tier: "page", component: "PhaseRow" }}>
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                justify="between" align="center" items={[
                    () => (
                        <StackH gap={3} principle="identity"
                            explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                            classNames={["min-w-0"]} align="center" items={[
                                () => (row.soldOut ? (
                                    <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                                ) : row.isActive ? (
                                    <CircleIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent-soft-foreground" />
                                ) : (
                                    <CircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-foreground" />
                                )),
                                () => (
                                    <Typography
                                        size="sm"
                                        weight={row.isActive ? "semibold" : undefined}
                                        color={row.soldOut ? "muted" : row.isActive ? "accent-soft" : "default"}
                                        truncate
                                        text={t(PHASE_LABEL_KEY[row.phase])}
                                    />
                                ),
                            ]} />
                    ),
                    () => (row.soldOut ? (
                        <Typography size="xs" color="muted" text={t("courseLanding.soldOut")} />
                    ) : row.isActive ? (
                        <Typography size="xs" color="accent-soft" text={t("courseLanding.currentOpen")} />
                    ) : (
                        <Typography size="sm" weight="medium" text={row.formattedPrice} />
                    )),
                ]} />
        </Box>
    )
}
