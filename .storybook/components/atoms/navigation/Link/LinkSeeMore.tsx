import React from "react"
import type { ReactNode } from "react"
import { Link as HeroUILink, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { AllowedClassName, SkeletonWidth } from "@sb-components/atoms/_allowed-class-name"
import { SKELETON_TEXT_BAR_SM } from "@sb-components/atoms/_skeleton-bar"

/**
 * Storybook-local port of `@/components/blocks/navigation/SeeMoreLink`.
 * Authored here, synced to `src` separately.
 *
 * Reused by the surface-card header ("See more →") and by ContinueCard's item
 * CTA (`decorative`), so both read as the same control.
 */

/**
 * Visual size for {@link LinkSeeMore} — mirrors the label row it sits beside
 * (`sm` next to a section label, `xs` next to a subtle eyebrow).
 */
export type LinkSeeMoreSize = "sm" | "xs"

/** Props shared by both variants — excludes `label`, see {@link LinkSeeMoreProps}. */
interface LinkSeeMoreOwnProps {
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
     * class: opacity fade + arrow slide.
     */
    decorative?: boolean
    /** Text size. Defaults to `sm`. */
    size?: LinkSeeMoreSize
    /**
     * Render the leaf shimmer instead of the real link — same text + arrow row, so
     * the row does not move once the label resolves (ATOM-4). Shape follows `size`
     * the same way the real render does.
     */
    isSkeleton?: boolean
    /**
     * Shimmer width for the label bar, as a fraction of the row — never a fixed
     * length, since the real label wraps/reflows with whatever box holds it.
     * Defaults to `"w-1/4"`, matching short labels like "See more".
     */
    skeletonWidth?: SkeletonWidth
    /** Position within the parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
}

/**
 * `label` is required when rendering the real link, not needed when
 * `isSkeleton` — the shimmer has no content to centre.
 */
export type LinkSeeMoreProps = LinkSeeMoreOwnProps &
    (
        | { isSkeleton: true; label?: ReactNode }
        | { isSkeleton?: false; label: ReactNode }
    )

/** Shared look — semibold accent text with `gap-1` (icon-text) to the arrow, matching {@link LinkBack}. */
const baseClassName = (size: LinkSeeMoreSize, classNames?: Array<AllowedClassName>) =>
    cn(
        "inline-flex w-fit shrink-0 items-center gap-1 font-semibold text-accent-soft-foreground no-underline",
        TEXT_CLASS[size],
        classNames,
    )

/** `size` → text size. Kept as its own table next to {@link ARROW_CLASS} so the two can't drift apart. */
const TEXT_CLASS: Record<LinkSeeMoreSize, string> = {
    sm: "text-sm",
    xs: "text-xs",
}

/**
 * `size` → arrow icon size. A function of `size` — callers cannot set it
 * independently. Scaled against font-size (not line-height): `text-sm` 14px →
 * `size-3.5`, `text-xs` 12px → `size-3`; both smaller than `size-5`, so both
 * need `weight="bold"` to compensate the stroke.
 */
const ARROW_CLASS: Record<LinkSeeMoreSize, string> = {
    sm: "size-3.5",
    xs: "size-3",
}

/**
 * `size` → label-bar shimmer, sized to the same line box the real text sits
 * in. `sm` reuses `SKELETON_TEXT_BAR_SM` (`text-sm`'s 20px line box, same as
 * `LinkBack`). `text-xs`'s line box is 16px (12px font / 1rem line-height): a
 * 10px bar centred with `my-[3px]` fills it (3 + 10 + 3 = 16).
 */
const SKEL_TEXT_BAR: Record<LinkSeeMoreSize, string> = {
    sm: SKELETON_TEXT_BAR_SM,
    xs: "my-[3px] h-[10px] rounded",
}

/**
 * Label underline on hover, matching {@link LinkBack}. Applied to the label
 * only, not the whole cluster, so the arrow doesn't get underlined too.
 */
const LABEL_HOVER = "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"

/**
 * The shared "See more →" / "Continue →" affordance: semibold accent text with
 * an arrow that slides right on hover, and the label underlines on hover — the
 * same go-there signal as {@link LinkBack}, mirrored (its arrow slides left).
 * Used by `SurfaceCardHeader`'s `onSeeMore` and ContinueCard's item CTA so both
 * read as the same control.
 *
 * @param props - {@link LinkSeeMoreProps}
 */
export const LinkSeeMore = ({
    label,
    onPress,
    href,
    decorative = false,
    size = "sm",
    isSkeleton = false,
    skeletonWidth,
    classNames,
}: LinkSeeMoreProps) => {
    if (isSkeleton) {
        // Same `inline-flex items-center gap-1` (icon-text) row as the real render; arrow
        // box matches `ARROW_CLASS[size]` and the label bar rides
        // `SKEL_TEXT_BAR[size]` so the row's height never moves once the real
        // label lands. `decorative`/`href`/`onPress` don't affect this shape —
        // they only change what happens on press — so no ``
        // here: this branch renders neither the HeroUI `Link` nor the plain
        // `<a>`/`<span>` the other branches produce.
        return (
            <span data-tier="atom" data-component="LinkSeeMore" data-principles="icon-text" className={cn("inline-flex w-fit shrink-0 items-center gap-1", classNames)}>
                <HeroSkeleton
                    className={cn(SKEL_TEXT_BAR[size], skeletonWidth ?? "w-1/4")}

                />
                <HeroSkeleton className={cn(ARROW_CLASS[size], "rounded-full")} />
            </span>
        )
    }

    // The arrow wrapper isn't tagged — it's an internal span around the
    // Phosphor glyph, not a real component of ours or HeroUI's.
    const arrow = (
        <span aria-hidden className="inline-flex shrink-0">
            {/*
              Icon sized `size-3.5` to match `text-sm`; smaller than `size-5`
              so `weight="bold"` compensates the stroke. Tailwind v4 treats
              `translate` as its own property, so the transition must target
              `[translate]` — `transition-transform` won't animate it. Same
              pattern as `LinkBack` / `Breadcrumbs`, mirrored to slide right.
            */}
            <ArrowRightIcon
                focusable="false"
                weight="bold"
                className={cn(ARROW_CLASS[size], "shrink-0 transition-[translate] group-hover:translate-x-1")}
            />
        </span>
    )

    // Label is its own span so the underline only applies to the text, not the arrow.
    const text = <span className={LABEL_HOVER}>{label}</span>

    if (decorative) {
        // Parent supplies `group` (e.g. ContinueCard wrapper) — hover fires from
        // anywhere on that surface, not a hover zone of this span alone. Untagged:
        // this is a plain `<span>`, not the HeroUI `Link`, so "Link" would be inaccurate here.
        return (
            <span data-tier="atom" data-component="LinkSeeMore" data-principles="icon-text" className={baseClassName(size, classNames)}>
                {text}
                {arrow}
            </span>
        )
    }

    const interactiveClassName = cn(baseClassName(size, classNames), "group cursor-pointer")

    if (href) {
        // Untagged for the same reason as the `decorative` branch above: a plain
        // `<a>`, not the HeroUI `Link`.
        return (
            <a data-tier="atom" data-component="LinkSeeMore" data-principles="icon-text" href={href} className={interactiveClassName}>
                {text}
                {arrow}
            </a>
        )
    }

    // The only branch that actually renders the HeroUI `Link` component (no
    // `href`, no `decorative`), so it's the only one that can accurately claim
    // the "Link" tag.
    return (
        <HeroUILink
            data-tier="atom"
            data-component="LinkSeeMore"

            data-principles="icon-text"
            onPress={onPress}
            className={interactiveClassName}
        >
            {text}
            {arrow}
        </HeroUILink>
    )
}

export const meta = { tier: "atom", name: "LinkSeeMore" } as const
