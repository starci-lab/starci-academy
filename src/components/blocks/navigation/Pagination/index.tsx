"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _Pagination, type PaginationProps } from "./component"

/** Props the connected {@link Pagination} takes from its caller. */
export type PaginationConnectedProps = Omit<
    PaginationProps,
    "navAriaLabel" | "previousAriaLabel" | "nextAriaLabel"
>

/**
 * Generic, reusable page-based pagination control — the CONNECTED half:
 * resolves the nav/previous/next aria-labels via `t()`. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link PaginationConnectedProps}
 */
export const Pagination = (props: PaginationConnectedProps) => {
    const t = useTranslations()

    return (
        <_Pagination
            {...props}
            navAriaLabel={t("common.pagination.navAria")}
            previousAriaLabel={t("common.pagination.previous")}
            nextAriaLabel={t("common.pagination.next")}
        />
    )
}
