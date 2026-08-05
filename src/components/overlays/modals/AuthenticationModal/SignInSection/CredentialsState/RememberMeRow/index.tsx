"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { ChoiceCheckbox } from "@/components/atoms/forms"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

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
 * @param props - selected state and the change callback
 */
export const RememberMeRow = ({
    isSelected,
    onChangeSelected,
}: RememberMeRowProps) => {
    const t = useTranslations()
    const items = [
        () => (
            <ChoiceCheckbox
                isSelected={isSelected}
                onValueChange={onChangeSelected}
                label={<Typography size="xs" color="muted" text={t("auth.signIn.rememberMe")} />}
            />
        ),
        () => (
            <Typography size="xs" isLink text={t("auth.signIn.forgotPassword")} />
        ),
    ]
    return <StackH gap={1} justify="between" items={items} />
}
