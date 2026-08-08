"use client"

import React from "react"
import { useRouter } from "@/i18n/navigation"
import { InlineLink } from "@/components/atoms/navigation/Link"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/** A single footer link: an internal `path` (locale-aware push) OR an external
 *  `href` (mailto / off-site) — exactly one is set. */
export interface FooterNavLink {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Internal route, locale-aware — pushed through the i18n router. */
    path?: string
    /** External / mailto href — rendered as a plain anchor press. */
    href?: string
}

/** Props for {@link FooterNavColumn}. */
export interface FooterNavColumnProps {
    /** Quiet column heading (e.g. "Explore", "Support"). */
    title: string
    /** Links stacked under the heading. */
    links: ReadonlyArray<FooterNavLink>
}

/**
 * FooterNavColumn — one quiet column of the global {@link Footer}: a small muted
 * heading over a vertical stack of links. Internal links (`path`) route through
 * the locale-aware router; external / mailto links (`href`) open via `onPress`.
 *
 * Kept as a layout helper for callers that still want the connected column
 * shape; the live {@link Footer} now composes the starci `FooterLinkColumn`.
 */
export const FooterNavColumn = ({
    title,
    links,
}: FooterNavColumnProps) => {
    const router = useRouter()

    const rows = links.map((link) => () => (
        <InlineLink
            key={link.key}
            label={link.label}
            size="sm"
            onPress={() => {
                if (link.href) {
                    window.location.href = link.href
                    return
                }
                if (link.path) {
                    router.push(link.path)
                }
            }}
        />
    ))

    return (
        <StackV
            identity={{ tier: "layout", component: "FooterNavColumn" }}
            principle="label-field"
            explain="Column title over its link list — not title-subtitle, because the title names the group of controls below rather than continuing in one voice."
            items={[
                () => <Typography size="sm" weight="bold" text={title} />,
                () => (
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack of link rows — not group-boundary, because these are repeating siblings rather than section groups."
                        items={rows}
                    />
                ),
            ]}
        />
    )
}
