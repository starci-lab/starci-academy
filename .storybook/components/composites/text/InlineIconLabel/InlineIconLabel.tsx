import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographyColor, TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import type { AllowedClassName, SkeletonWidth } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — InlineIconLabel: a leading icon + an inline text
 * label as ONE composite. An "icon + text" row (a count, an eyebrow, a tab label,
 * a toned caption) is a semantic UNIT — so it is a single component that OWNS the
 * icon size (§5 icon-ownership: it sits with the text scale) instead of every
 * call-site hand-rolling `flex items-center gap-1` + a bare icon + a Typography.
 *
 * Second most-recurring composite in the app (≥15 call-sites, 5 lanes: CourseCard
 * count, GradeModelDropdown/GradingByline/GradeCreditCaption, Toolbar tab label,
 * ChatToolResult/UpNextCard eyebrow, PhaseScarcityNote notice…). NO `@/components`
 * imports.
 *
 * TONE — neutral (`default`) flows through Typography's `color="muted"` prop
 * (§9-clean, Typography's OWN vocabulary — not this tone's name); `accent`/`success`
 * flow through `color="accent-soft"`/`"success-soft"` (real Typography colour
 * tokens, mirrors PriceTag). `warning`/`danger`/`info` have no matching SOFT
 * Typography colour token (only accent-soft/success-soft exist), so those three
 * ride Typography's own full-strength `warning`/`danger`/`info` colour instead —
 * ATOM GAP: a `warning-soft`/`danger-soft`/`info-soft` trio doesn't exist yet. The
 * leading icon gets the SAME tone via a className on its own plain span
 * (currentColor), so icon + text stay in lockstep.
 */

/**
 * Semantic tone — colours icon + text together. Omit for foreground (inherits currentColor).
 *
 * Alias, not a redeclaration (teacher's call, 2026-07-29): the same five values
 * {@link AlertStatus} already carries — neutral is `default`, matching every
 * other status-driven prop in the system instead of this composite's own `muted`.
 */
export type InlineIconLabelTone = AlertStatus

/** Text scale — `xs` (body-xs) · `sm` (body-sm). Icon stays size-4 (the app's
 * inline-meta glyph size, used with BOTH text scales — count/eyebrow/caption/notice). */
export type InlineIconLabelSize = "xs" | "sm"

interface SizeConfig {
    /** Gap between icon and text. */
    gap: string
    /**
     * `data-principles` token for this size's gap — both sizes now render at `gap-1` (4px,
     * gap-scale step 2) and carry the same `icon-text` token (`patterns.mjs`): an icon
     * beside its text is one thing with a joint, whether or not it is clickable.
     */
    pattern?: string
}

// Icon is always size-4 (inline-meta convention across the app); only text + gap scale.
const ICON_BOX = "[&_svg]:size-4"
const SKELETON_ICON = "size-4"

const SIZE_CONFIG: Record<InlineIconLabelSize, SizeConfig> = {
    // gap-1 = 4px = the step-2 joint; an icon + its text as ONE thing — `icon-text`.
    xs: { gap: "gap-1", pattern: "icon-text" },
    // `affordance` (gap-2, 8px) is retired: an icon next to text is `icon-text`, step 2, 4px,
    // whether or not it is clickable (teacher's ruling, 2026-08-01).
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
    children?: string
    /** Semantic tone colouring icon + text. Omit → foreground (inherits currentColor). */
    tone?: InlineIconLabelTone
    /** Text scale (icon follows). Defaults to `"xs"`. */
    size?: InlineIconLabelSize
    /** Truncate the label to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → render the skeleton mirror (icon dot + text bar). */
    isSkeleton?: boolean
    /**
     * Width of the label's shimmer, as a fraction of the row. Narrowed from `string` on
     * 2026-07-31: this value is handed straight to `Typography`, whose `classNames` is a closed
     * union, so an unconstrained string here would only fail one tier down.
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
 * caller passes the icon bare and the label as children.
 *
 * @param props - {@link InlineIconLabelProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "InlineIconLabel" } as const

export const InlineIconLabel = ({
    icon: Icon,
    children,
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
    // label text always goes through `Typography`'s own `isSkeleton` (§12c: the atom
    // draws its own bar, sized to ITS OWN value). The leading icon is the one
    // exception: no bare icon-shaped shimmer atom exists yet, so there is nothing to
    // forward `isSkeleton` into for it — a documented ATOM GAP, kept here as a single
    // conditional rather than a second copy of the wrapper `<span>`.
    return (
        <span
            className={cn("inline-flex items-center", cfg.gap, classNames)}

            data-tier="composite"
            data-component="InlineIconLabel"
            data-principles={cfg.pattern}
        >
            {isSkeleton ? (
                <HeroSkeleton className={cn(SKELETON_ICON, "shrink-0 rounded-full")} />
            ) : (
                // icon-ownership: the composite forces the svg box; tone via currentColor on this span
                <span className={cn("shrink-0", ICON_BOX, toneClass)}>
                    <Icon aria-hidden focusable="false" />
                </span>
            )}
            <Typography
                size={size}
                color={isSkeleton ? undefined : textColor}
                classNames={isSkeleton ? [skeletonWidth] : undefined}
                truncate={truncate}
                isSkeleton={isSkeleton}
                text={children}
            />
        </span>
    )
}
