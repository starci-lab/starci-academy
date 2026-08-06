"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { ChoiceCheckbox } from "@/components/atoms/forms"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"

/** Props for {@link RememberMeRow}. */
export interface RememberMeRowProps {
    /** Whether the "remember me" box is checked. */
    isSelected: boolean
    /** Fired with the new checked state. */
    onChangeSelected: (selected: boolean) => void
}

/**
 * "Remember me" checkbox paired with the "forgot password" link.
 *
 * Presentational: checked state is driven by props; the forgot-password link
 * is display-only (no handler in the original). No business logic.
 * Spacing is justify-between (push apart), not a gap seam — Box carries the
 * distribution without a false step-1 principle.
 * @param props - selected state and the change callback
 */
export const RememberMeRow = ({
    isSelected,
    onChangeSelected,
}: RememberMeRowProps) => {
    const t = useTranslations()
    return (
        <Box className="flex items-center justify-between">
            <ChoiceCheckbox
                isSelected={isSelected}
                onValueChange={onChangeSelected}
                label={<Typography size="xs" color="muted" text={t("auth.signIn.rememberMe")} />}
            />
            <Typography size="xs" isLink text={t("auth.signIn.forgotPassword")} />
        </Box>
    )
}
