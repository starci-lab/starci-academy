import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import type { SkeletonTypographyType } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — InlineIconLabel: a leading icon + an inline text
 * label as ONE primitive. An "icon + text" row (a count, an eyebrow, a tab label,
 * a toned caption) is a semantic UNIT — so it is a single component that OWNS the
 * icon size (§5 icon-ownership: it sits with the text scale) instead of every
 * call-site hand-rolling `flex items-center gap-1` + a bare icon + a Typography.
 *
 * Second most-recurring composite in the app (≥15 call-sites, 5 lanes: CourseCard
 * count, GradeModelDropdown/GradingByline/GradeCreditCaption, TabsCard tab label,
 * ChatToolResult/UpNextCard eyebrow, PhaseScarcityNote notice…). NO `@/components`
 * imports.
 *
 * TONE — `muted` flows through Typography's `color` prop (§9-clean); the other tones
 * (warning/danger/success/accent) have no Typography colour token, so they ride the
 * repo's accepted `text-*-soft-foreground` className on the Typography (mirrors
 * PriceTag/FieldShell/DeadlineCallout). The leading icon gets the SAME tone via a
 * className on its own plain span (currentColor), so icon + text stay in lockstep.
 */

/** Semantic tone — colours icon + text together. Omit for foreground (inherits currentColor). */
export type InlineIconLabelTone = "muted" | "warning" | "danger" | "success" | "accent"

/** Text scale — `xs` (body-xs) · `sm` (body-sm). Icon stays size-4 (the app's
 * inline-meta glyph size, used with BOTH text scales — count/eyebrow/caption/notice). */
export type InlineIconLabelSize = "xs" | "sm"

interface SizeConfig {
    /** Text Typography type. */
    text: "body-xs" | "body-sm"
    /** Gap between icon and text. */
    gap: string
}

// Icon is always size-4 (inline-meta convention across the app); only text + gap scale.
const ICON_BOX = "[&_svg]:size-4"
const SKELETON_ICON = "size-4"

const SIZE_CONFIG: Record<InlineIconLabelSize, SizeConfig> = {
    xs: { text: "body-xs", gap: "gap-1" },
    sm: { text: "body-sm", gap: "gap-2" },
}

/** Tone → wrapper text-colour class (icon + `color="current"` text both inherit it). */
const TONE_CLASS: Record<InlineIconLabelTone, string> = {
    muted: "text-muted",
    warning: "text-warning-soft-foreground",
    danger: "text-danger-soft-foreground",
    success: "text-success-soft-foreground",
    accent: "text-accent-soft-foreground",
}

/** Props for the {@link InlineIconLabel} primitive. */
export interface InlineIconLabelProps {
    /** Leading icon (a Phosphor `*Icon`, passed BARE — the primitive owns its size). */
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
    skeletonWidth?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Extra classes on the root. */
    className?: string
}

/**
 * InlineIconLabel renders a leading icon beside an inline text label as one unit.
 * The primitive OWNS the icon size (per the text scale) and the tone colour; the
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
    skeletonWidth = "w-16",
    anatPart,
    className,
}: InlineIconLabelProps) => {
    const cfg = SIZE_CONFIG[size]
    // muted → Typography color prop; other tones → className (no Typography token for them).
    const toneClass = tone ? TONE_CLASS[tone] : undefined
    const textToneClass = tone && tone !== "muted" ? TONE_CLASS[tone] : undefined

    if (isSkeleton) {
        return (
            <span className={cn("inline-flex items-center", cfg.gap, className)} data-anat-part={anatPart}>
                <Skeleton className={cn(SKELETON_ICON, "shrink-0 rounded-full")} />
                <Skeleton.Typography type={cfg.text as SkeletonTypographyType} width={skeletonWidth} />
            </span>
        )
    }

    return (
        <span className={cn("inline-flex items-center", cfg.gap, className)} data-anat-part={anatPart}>
            {/* icon-ownership: the primitive forces the svg box; tone via currentColor on this span */}
            <span className={cn("shrink-0", ICON_BOX, toneClass)}>{icon}</span>
            <Typography
                type={cfg.text}
                color={tone === "muted" ? "muted" : undefined}
                className={textToneClass}
                truncate={truncate}
            >
                {children}
            </Typography>
        </span>
    )
}
