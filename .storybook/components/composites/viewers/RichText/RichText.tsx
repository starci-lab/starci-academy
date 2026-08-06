"use client"

import React, { type ReactNode } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographySize as AtomTypographySize } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Box } from "@sb-components/frames/Box/Box"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "RichText" } as const

/** Empty `text` → renders nothing (Typography with no children), takes no unexpected space. */

/**
 * Typography scale token — kept as the VENDOR HeroUI `Typography`'s own `type`
 * vocabulary (`typography.styles.d.ts`: `body`/`body-sm`/`body-xs`/`h1`…`h6`/
 * `code`) so existing callers (`SurfaceCard`, this component's own stories)
 * don't have to change. Spelled out here rather than derived from the vendor
 * via `typeof` so this file never imports it at all — only the internal
 * rendering (below) maps this onto the house `Typography` ATOM's `size` scale
 * (a composite may not import the vendor to show content — COMPOSITE-3).
 */
type TypographySize = "body" | "body-sm" | "body-xs" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
/** Typography color token (mirrors HeroUI `Typography` `color`: `default`/`muted`). */
type TypographyColor = "default" | "muted"

/**
 * Maps {@link TypographySize} (the vendor's `type` vocabulary this composite's
 * public API keeps) onto the house `Typography` atom's `size` scale.
 *
 * ATOM GAP: the atom has no `h6` — nothing in this design system currently asks
 * for a 6th heading level, so `h6` folds to the atom's smallest heading (`h5`)
 * rather than inventing a new atom size for an unused case.
 */
const SIZE_MAP: Record<NonNullable<TypographySize>, AtomTypographySize> = {
    body: "base",
    "body-sm": "sm",
    "body-xs": "xs",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h5",
}

interface RichTextOwnProps {
    /** Typography scale; defaults to `"body-sm"`. */
    size?: TypographySize
    /** Typography color; defaults to the Typography default (omit for inherited). */
    color?: TypographyColor
    /** Where this sits inside its parent, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for {@link RichText}. `text` is REQUIRED unless `isSkeleton` (§12b) —
 * a shimmer line has no real copy to show yet.
 */
export type RichTextProps = RichTextOwnProps &
    (
        | { isSkeleton: true; text?: string }
        | {
            isSkeleton?: false
            /**
             * Raw text with a SMALL inline-markdown subset:
             * `` `code` `` · `**bold**` · `_italic_` · `[label](url)` · line breaks (`\n`).
             * Anything else renders as plain text — this is NOT a full markdown renderer.
             */
            text: string
        }
    )

/** One inline marker → its rendered node. `recurse` = re-parse the captured label (code never does). */
interface InlineRule {
    /** Pattern; capture 1 = label (capture 2 = href for the link rule). */
    re: RegExp
    /** Re-parse the captured label for nested markers (false = literal, e.g. code). */
    recurse: boolean
    /** Build the node from the match + already-rendered children. */
    render: (match: RegExpExecArray, children: ReactNode) => ReactNode
}

/** The supported inline markers, tried earliest-match-wins (ties: this order). */
const RULES: Array<InlineRule> = [
    {
        re: /`([^`]+)`/,
        recurse: false,
        render: (match) => (
            <Box as="code" principle="control-pad" className="rounded-md bg-default px-2 py-0 font-mono text-[0.9em] text-accent-soft-foreground"
                explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.">
                {match[1]}
            </Box>
        ),
    },
    {
        re: /\*\*([^*]+)\*\*/,
        recurse: true,
        render: (match, children) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
    },
    {
        re: /\[([^\]]+)\]\(([^)\s]+)\)/,
        recurse: true,
        render: (match, children) => (
            <a
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
            >
                {children}
            </a>
        ),
    },
    {
        re: /_([^_]+)_/,
        recurse: true,
        render: (match, children) => <em>{children}</em>,
    },
]

/** Render plain text, turning `\n` into `<br/>`. */
const renderText = (text: string): ReactNode => {
    if (!text) {
        return null
    }
    const lines = text.split("\n")
    return lines.map((line, index) => (
        <React.Fragment key={index}>
            {index > 0 ? <br /> : null}
            {line}
        </React.Fragment>
    ))
}

/**
 * Render the inline-markdown subset to React nodes: find the earliest marker, split
 * `before | marker | after`, render the marker, and recurse on `after` (and on the
 * marker's label unless it is a literal code span). No marker left → plain text.
 */
const renderInline = (text: string): ReactNode => {
    let best: { rule: InlineRule, match: RegExpExecArray } | null = null
    for (const rule of RULES) {
        const match = rule.re.exec(text)
        if (match && (!best || match.index < best.match.index)) {
            best = { rule, match }
        }
    }
    if (!best) {
        return renderText(text)
    }
    const { rule, match } = best
    const before = text.slice(0, match.index)
    const after = text.slice(match.index + match[0].length)
    const children = rule.recurse ? renderInline(match[1]) : match[1]
    return (
        <>
            {renderText(before)}
            {rule.render(match, children)}
            {renderInline(after)}
        </>
    )
}

/**
 * Lightweight rich-text typography — a tiny inline-markdown renderer for short copy
 * (descriptions, captions, hints) where `MarkdownContent` (full react-markdown +
 * remark plugins, block elements) is overkill. NOT for `title`/headline fields —
 * a title identifies a block and stays plain (at most `` `backtick` `` code via
 * `Typography.parseInlineCode`), it never carries bold/italic/link.
 *
 * Renders ONLY a small inline subset (`code` · **bold** · _italic_ · `[link](url)` ·
 * line breaks) inside one house `Typography` ATOM, so it carries the house size
 * scale (mapped from this composite's own vendor-shaped `size` vocabulary via
 * {@link SIZE_MAP}) and the atom's own shimmer when `isSkeleton`. Presentational,
 * no data/i18n.
 * @param props - {@link RichTextProps}
 */
export const RichText = ({
    text,
    size = "body-sm",
    color,
    isSkeleton = false,
    classNames,
}: RichTextProps) => {
    // One render path (COMPOSITE-10): the atom decides its own shimmer shape via
    // `isSkeleton`; this composite only decides size/color and renders a thin `<span>`.
    return (
        <span
            className={classNames?.join(" ")}
            data-tier="composite"
            data-component="RichText"
        >
            <Typography
                size={SIZE_MAP[size]}
                color={color}
                isSkeleton={isSkeleton}
                text={renderInline(text ?? "")}
            />
        </span>
    )
}
