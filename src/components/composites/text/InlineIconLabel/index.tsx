import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { TypographyColor, TypographyIcon } from "@/components/atoms/text/Typography"
import type { AlertStatus } from "@/components/atoms/feedback/Alert"
import type { AllowedClassName, SkeletonWidth } from "@/components/atoms/_allowed-class-name"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "InlineIconLabel" } as const

/**
 * `InlineIconLabel` — a leading icon + an inline text label as one unit (a count, an eyebrow, a
 * tab label, a toned caption). Owns the icon size (per the text scale) and the tone colour, so a
 * call-site never hand-rolls `flex items-center gap-1` + a bare icon + a `Typography`. Leaves:
 * `icon`, `tone`, `size`, `truncate`, `isSkeleton`, `skeletonWidth`.
 */

/**
 * Semantic tone — colours icon + text together. Omit for foreground (inherits currentColor).
 *
 * Alias, not a redeclaration: the same five values {@link AlertStatus} already
 * carries — neutral is `default`, matching every other status-driven prop in
 * the system.
 */
export type InlineIconLabelTone = AlertStatus

/** Text scale — `xs` (body-xs) · `sm` (body-sm). Icon stays size-4 (the app's
 * inline-meta glyph size, used with BOTH text scales — count/eyebrow/caption/notice). */
export type InlineIconLabelSize = "xs" | "sm"

interface SizeConfig {
    /** Gap between icon and text. */
    gap: string
    /**
     * `data-principle` token for this size's gap — both sizes now render at `gap-1` (4px,
     * gap-scale step 2) and carry the same `icon-text` token (`patterns.mjs`): an icon
     * beside its text is one thing with a joint, whether or not it is clickable.
     */
    pattern?: string
}

// Icon is always size-4 (inline-meta convention across the app); only text + gap scale.
const ICON_BOX = "[&_svg]:size-4"

const SIZE_CONFIG: Record<InlineIconLabelSize, SizeConfig> = {
    // gap-1 = 4px = the step-2 joint; an icon + its text as ONE thing — `icon-text`.
    xs: { gap: "gap-1", pattern: "icon-text" },
    // An icon next to text is `icon-text`, step 2, 4px, whether or not it is
    // clickable.
    sm: { gap: "gap-1", pattern: "icon-text" },
}

/** Tone → wrapper text-colour class (icon + `color="current"` text both inherit it). */
const TONE_CLASS: Record<InlineIconLabelTone, string> = {
    default: "text-muted",
    warning: "text-warning-soft-foreground",
    danger: "text-danger-soft-foreground",
    success: "text-success-soft-foreground",
    accent: "text-accent-soft-foreground",
    info: "text-info-soft-foreground",
}

/** Props for the {@link InlineIconLabel} composite. */
export interface InlineIconLabelProps {
    /**
     * Leading icon, passed as a COMPONENT reference (a Phosphor `*Icon`, never
     * already-built JSX) — the composite renders it and owns its size via a CSS
     * descendant selector, not a prop threaded into the icon itself.
     */
    icon: TypographyIcon
    /** The inline label text, rendered through `Typography`. Omit only while `isSkeleton`. */
    label?: string
    /** Semantic tone colouring icon + text. Omit → foreground (inherits currentColor). */
    tone?: InlineIconLabelTone
    /** Text scale (icon follows). Defaults to `"xs"`. */
    size?: InlineIconLabelSize
    /** Truncate the label to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → shimmer the label via `Typography`; the icon stays (caller-supplied, not fetched). */
    isSkeleton?: boolean
    /**
     * Width of the label's shimmer, as a fraction of the row. This value is
     * handed straight to `Typography`, whose `classNames` is a closed union, so
     * an unconstrained string here would only fail one tier down.
     */
    skeletonWidth?: SkeletonWidth
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * InlineIconLabel renders a leading icon beside an inline text label as one unit.
 * The composite OWNS the icon size (per the text scale) and the tone colour; the
 * caller passes the icon bare and the label as a string.
 *
 * @param props - {@link InlineIconLabelProps}
 */
export const InlineIconLabel = ({
    icon: Icon,
    label,
    tone,
    size = "xs",
    truncate = false,
    isSkeleton = false,
    skeletonWidth = "w-1/4",
    classNames,
}: InlineIconLabelProps) => {
    const cfg = SIZE_CONFIG[size]
    // Icon span always gets its tone via className (currentColor) — no atom involved there.
    const toneClass = tone ? TONE_CLASS[tone] : undefined
    // Typography's `color` prop covers default/accent/success/warning/danger/info at
    // full strength (muted/accent-soft/success-soft are the only SOFT tokens the atom
    // has) — see the TONE doc comment above for the `-soft` atom gap on the other three.
    const textColor: TypographyColor | undefined =
        tone === "default" ? "muted"
            : tone === "accent" ? "accent-soft"
                : tone === "success" ? "success-soft"
                    : tone === "warning" ? "warning"
                        : tone === "danger" ? "danger"
                            : tone === "info" ? "info"
                                : undefined

    // COMPOSITE-10: ONE render path — same wrapper, same gap, in both states. The
    // icon is caller-supplied (not fetched), so it stays mounted while loading; only
    // the label shimmers via `Typography`'s own `isSkeleton`.
    return (
        <span
            className={cn("inline-flex items-center", cfg.gap, classNames)}

            data-tier="composite"
            data-component="InlineIconLabel"
            data-principle={cfg.pattern}
        >
            {/* icon-ownership: the composite forces the svg box; tone via currentColor on this span */}
            <span className={cn("shrink-0", ICON_BOX, toneClass)}>
                <Icon aria-hidden focusable="false" />
            </span>
            <span className={isSkeleton ? skeletonWidth : undefined}>
                <Typography
                    size={size}
                    color={isSkeleton ? undefined : textColor}
                    truncate={truncate}
                    isSkeleton={isSkeleton}
                    text={label}
                />
            </span>
        </span>
    )
}
