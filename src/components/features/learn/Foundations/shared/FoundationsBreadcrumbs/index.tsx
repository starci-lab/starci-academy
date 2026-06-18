"use client"

import React from "react"
import {
    Breadcrumbs,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"
import type {
    FoundationsBreadcrumbItem,
} from "../../types"

/** Props for {@link FoundationsBreadcrumbs}. */
export interface FoundationsBreadcrumbsProps extends WithClassNames<undefined> {
    /** Breadcrumb rows to render, in order. */
    items: Array<FoundationsBreadcrumbItem>
}

/**
 * Renders the foundations page breadcrumb trail.
 *
 * Presentational: maps the supplied items to HeroUI breadcrumb rows, no logic.
 * Shared across the foundations hub, category and detail pages — each supplies
 * its own trail — so it stays prop-driven.
 * @param props - the ordered breadcrumb items
 */
export const FoundationsBreadcrumbs = ({
    items,
    className,
}: FoundationsBreadcrumbsProps) => {
    return (
        <Breadcrumbs className={cn(className)}>
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
