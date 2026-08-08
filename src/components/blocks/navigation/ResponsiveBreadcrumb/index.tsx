"use client"

import React from "react"
import type { ReactNode } from "react"
import { Breadcrumbs, cn } from "@heroui/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { HideAbove } from "@/components/frames/HideAbove"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/** Collapse the full trail into a single "Back" once the path is this deep. */
const LONG_TRAIL_MIN = 4

/** One crumb in a {@link ResponsiveBreadcrumb} trail. */
export interface ResponsiveBreadcrumbItem {
    /** Stable key for the list. */
    key: string | number
    /** Crumb label. */
    label: ReactNode
    /** Navigate handler — omit on the current (last, read-only) crumb. */
    onPress?: () => void
}

/** Props for {@link ResponsiveBreadcrumb}. */
export interface ResponsiveBreadcrumbProps {
    /** The full trail, root → current (current last, usually without `onPress`). */
    items: Array<ResponsiveBreadcrumbItem>
    /**
     * Caller identity resolved on the always-mounted `Breadcrumbs` host (no wrapper).
     * The mobile/long-trail `BackLink` co-path does not accept CallerIdentity.
     */
    identity?: CallerIdentity
}

/**
 * Breadcrumb for a `PageHeader` `breadcrumb` slot. Shows the full
 * `Home › … › Current` trail on desktop when short; collapses to a single
 * {@link BackLink} ("Back") on mobile, or whenever the trail is long
 * (`>= {@link LONG_TRAIL_MIN}` crumbs) — a long trail wraps and eats vertical
 * space, and deep ancestors are already reachable from top nav. The back
 * target is the deepest clickable ancestor (last item with `onPress`). Pure
 * CSS for the mobile breakpoint; length check is render-time.
 *
 * @param props - {@link ResponsiveBreadcrumbProps}
 * @see Story: .storybook/stories/blocks/navigation/ResponsiveBreadcrumb/ResponsiveBreadcrumb.stories
 */
export const ResponsiveBreadcrumb = ({
    items,
    identity,
}: ResponsiveBreadcrumbProps) => {
    // back target = deepest ancestor we can navigate to (skips the current crumb)
    const parent = [...items].reverse().find((item) => item.onPress)
    const isLongTrail = items.length >= LONG_TRAIL_MIN
    const onBack = parent?.onPress

    return (
        <>
            {/* desktop + short trail: the full path — durable host for identity (always mounted) */}
            <Breadcrumbs
                {...resolveIdentity(identity, { tier: "block", name: "ResponsiveBreadcrumb" })}
                className={cn(isLongTrail ? "hidden" : "hidden @app-sm:flex")}
            >
                {items.map((item) => (
                    <Breadcrumbs.Item key={item.key} onPress={item.onPress}>
                        {item.label}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>

            {/* mobile, or long trail on any width: single "Back" */}
            {onBack ? (
                isLongTrail ? (
                    <BackLink onPress={onBack} />
                ) : (
                    <HideAbove at="sm" body={() => <BackLink onPress={onBack} />} />
                )
            ) : null}
        </>
    )
}

export default ResponsiveBreadcrumb
