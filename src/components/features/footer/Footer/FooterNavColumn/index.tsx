"use client"

import React from "react"
import {
    Link,
    Typography,
} from "@heroui/react"
import {
    useRouter,
} from "@/i18n/navigation"

/** A single footer link — internal (`path`, locale-routed) or external (`href`). */
export interface FooterNavLink {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Locale-aware in-app path (mutually exclusive with `href`). */
    path?: string
    /** External / protocol href like `mailto:` (mutually exclusive with `path`). */
    href?: string
}

/** Props for {@link FooterNavColumn}. */
export interface FooterNavColumnProps {
    /** Quiet column heading (e.g. "Khám phá"). */
    title: string
    /** Links rendered as a muted vertical list. */
    links: ReadonlyArray<FooterNavLink>
}

/**
 * One labeled column of footer links. Internal links self-navigate via the
 * locale-aware router; external links use a plain anchor. Links read at the
 * foreground tone (clear on the dark footer) and lift to accent on hover.
 *
 * @param props - {@link FooterNavColumnProps}
 */
export const FooterNavColumn = ({ title, links }: FooterNavColumnProps) => {
    const router = useRouter()
    return (
        <div className="flex flex-col gap-3">
            <Typography type="body-xs" color="muted">
                {title}
            </Typography>
            <div className="flex flex-col gap-2">
                {links.map((link) =>
                    link.href ? (
                        <Link
                            key={link.key}
                            href={link.href}
                            className="text-sm text-foreground transition-colors hover:text-accent"
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <Link
                            key={link.key}
                            onPress={() => router.push(link.path ?? "")}
                            className="cursor-pointer text-sm text-foreground transition-colors hover:text-accent"
                        >
                            {link.label}
                        </Link>
                    ),
                )}
            </div>
        </div>
    )
}
