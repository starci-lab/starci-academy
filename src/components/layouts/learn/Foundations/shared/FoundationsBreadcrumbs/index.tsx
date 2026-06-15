"use client"

import React from "react"
import {
    Breadcrumbs,
} from "@heroui/react"
import type {
    FoundationsBreadcrumbItem,
} from "../types"

/** Props for {@link FoundationsBreadcrumbs}. */
export interface FoundationsBreadcrumbsProps {
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
}: FoundationsBreadcrumbsProps) => {
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
