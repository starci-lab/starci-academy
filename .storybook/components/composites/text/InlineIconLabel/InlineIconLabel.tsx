import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographyColor } from "@sb-components/atoms/text/Typography/Typography"
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
 * TONE — trung lập (`default`) flows through Typography's `color="muted"` prop
 * (§9-clean, Typography's OWN vocabulary — not this tone's name); `accent`/`success`
 * flow through `color="accent-soft"`/`"success-soft"` (real Typography colour
 * tokens, mirrors PriceTag). `warning`/`danger`/`info` have NO matching Typography
 * colour token (only accent-soft/success-soft exist), so those three still ride the
 * repo's accepted `text-*-soft-foreground` className on the Typography. The leading
 * icon gets the SAME tone via a className on its own plain span (currentColor), so
 * icon + text stay in lockstep.
 */

/**
 * Semantic tone — colours icon + text together. Omit for foreground (inherits currentColor).
 *
 * Alias, not a redeclaration (thầy chốt 2026-07-29): the same five values
 * {@link AlertStatus} already carries — trung lập is `default`, matching every
 * other status-driven prop in the system instead of this composite's own `muted`.
 */
export type InlineIconLabelTone = AlertStatus

/** Text scale — `xs` (body-xs) · `sm` (body-sm). Icon stays size-4 (the app's
 * inline-meta glyph size, used with BOTH text scales — count/eyebrow/caption/notice). */
export type InlineIconLabelSize = "xs" | "sm"

interface SizeConfig {
    /** Gap between icon and text. */
    gap: string
}

// Icon is always size-4 (inline-meta convention across the app); only text + gap scale.
const ICON_BOX = "[&_svg]:size-4"
const SKELETON_ICON = "size-4"

const SIZE_CONFIG: Record<InlineIconLabelSize, SizeConfig> = {
    xs: { gap: "gap-1" },
    sm: { gap: "gap-2" },
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
    /** Leading icon (a Phosphor `*Icon`, passed BARE — the composite owns its size). */
    icon: ReactNode
    /** The inline label text. */
    children: ReactNode
    /** Semantic tone colouring icon + text. Omit → foreground (inherits currentColor). */
    tone?: InlineIconLabelTone
    /** Text scale (icon follows). Defaults to `"xs"`. */
    size?: InlineIconLabelSize
    /** Truncate the label to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → render the skeleton mirror (icon dot + text bar). */
    isSkeleton?: boolean
    /** Skeleton text-bar width (Tailwind class). Defaults to `"w-16"`. */
    /**
     * Width of the label's shimmer, as a fraction of the row. Narrowed from `string` on
     * 2026-07-31: this value is handed straight to `Typography`, whose `classNames` is a closed
     * union, so an unconstrained string here would only fail one tier down.
     */
    skeletonWidth?: SkeletonWidth
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Extra classes on the root. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
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
export const InlineIconLabel = ({
    icon,
    children,
    tone,
    size = "xs",
    truncate = false,
    isSkeleton = false,
    skeletonWidth = "w-1/4",
    anatPart,
    className,
    classNames,
}: InlineIconLabelProps) => {
    const cfg = SIZE_CONFIG[size]
    // Icon span always gets its tone via className (currentColor) — no atom involved there.
    const toneClass = tone ? TONE_CLASS[tone] : undefined
    // Typography's `color` prop covers default/accent/success (muted/accent-soft/success-soft
    // are real tokens on the atom); warning/danger/info have no matching token, so those three
    // still fall back to the raw className (see the TONE doc comment above).
    const textColor: TypographyColor | undefined =
        tone === "default" ? "muted"
            : tone === "accent" ? "accent-soft"
                : tone === "success" ? "success-soft"
                    : undefined
    const textClassNameFallback =
        tone === "warning" || tone === "danger" || tone === "info" ? TONE_CLASS[tone] : undefined

    if (isSkeleton) {
        return (
            <span className={cn("inline-flex items-center", cfg.gap, className, classNames)} data-anat-part={anatPart}>
                <HeroSkeleton className={cn(SKELETON_ICON, "shrink-0 rounded-full")} />
                {/* §12c: chủ của hình là chủ của skeleton — Typography atom TỰ vẽ gạch của chính nó */}
                <Typography size={size} isSkeleton classNames={[skeletonWidth]} />
            </span>
        )
    }

    return (
        <span className={cn("inline-flex items-center", cfg.gap, className)} data-anat-part={anatPart}>
            {/* icon-ownership: the composite forces the svg box; tone via currentColor on this span */}
            <span className={cn("shrink-0", ICON_BOX, toneClass)}>{icon}</span>
            <Typography
                size={size}
                color={textColor}
                className={textClassNameFallback}
                truncate={truncate}
                text={children}
            />
        </span>
    )
}
