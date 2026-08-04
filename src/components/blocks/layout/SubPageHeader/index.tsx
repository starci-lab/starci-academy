"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _SubPageHeader, type SubPageHeaderProps } from "./component"

/** Props the connected {@link SubPageHeader} takes from its caller. */
export type SubPageHeaderConnectedProps = Omit<SubPageHeaderProps, "backAriaLabel"> & {
    /** Accessible label for the back button (defaults to `common.back`). */
    backAriaLabel?: string
}

/**
 * Reusable sub-page header — the CONNECTED half: resolves the default
 * back-button aria-label via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link SubPageHeaderConnectedProps}
 */
export const SubPageHeader = ({ backAriaLabel, ...props }: SubPageHeaderConnectedProps) => {
    const t = useTranslations()
    return <_SubPageHeader {...props} backAriaLabel={backAriaLabel ?? t("common.back")} />
}
