"use client"

import React from "react"
import { Breadcrumbs } from "@heroui/react"
import { useHeadhuntingsBreadcrumbs } from "../../hooks"

/**
 * Breadcrumb trail for the headhuntings list page.
 *
 * Self-contained section (single-use): builds its own trail from the active
 * course in Redux + i18n + router via {@link useHeadhuntingsBreadcrumbs}, so the
 * container just renders `<HeadhuntingsBreadcrumbs />`.
 */
export const HeadhuntingsBreadcrumbs = () => {
    const items = useHeadhuntingsBreadcrumbs()

    return (
        <Breadcrumbs>
            {items.map((item) => (
                <Breadcrumbs.Item
                    key={item.key}
                    onPress={item.onPress}
                >
                    {item.label}
                </Breadcrumbs.Item>
            ))}
        </Breadcrumbs>
    )
}
