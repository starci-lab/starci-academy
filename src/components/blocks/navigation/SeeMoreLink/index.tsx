"use client"

import { createElement, type ReactNode } from "react"
import {
    LinkSeeMore,
    type LinkSeeMoreSize,
} from "@/components/atoms/navigation/Link/LinkSeeMore"

/**
 * Visual size for {@link SeeMoreLink} — mirrors the label row it sits beside
 * (`sm` next to a section label, `xs` next to a subtle eyebrow).
 */
export type SeeMoreLinkSize = LinkSeeMoreSize

/** Props for the {@link SeeMoreLink} block — thin sentence-tier redirect to the `LinkSeeMore` atom. */
export interface SeeMoreLinkProps {
    /** Link label — e.g. "See more", "Continue", "View all". */
    children: ReactNode
    /**
     * Press handler. Ignored when {@link href} is set, and when
     * {@link decorative} is true (the parent owns the press target).
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link onPress}. */
    href?: string
    /**
     * When true, render plain markup (no own `<a>`/`<button>`) — for use inside
     * an already-interactive surface (e.g. ContinueCard `item`, where the whole
     * card is the one press target). Hover still rides on a parent `group`
     * class.
     */
    decorative?: boolean
    /** Text size. Defaults to `sm`. */
    size?: SeeMoreLinkSize
}

/**
 * Sentence-tier alias for the vocabulary `LinkSeeMore` atom. Keeps the historical
 * `children` prop for existing block callers; appearance lives in the atom.
 *
 * @param props - {@link SeeMoreLinkProps}
 */
export const SeeMoreLink = ({
    children,
    onPress,
    href,
    decorative = false,
    size = "sm",
}: SeeMoreLinkProps) =>
    createElement(LinkSeeMore, {
        label: children,
        onPress,
        href,
        decorative,
        size,
    })
