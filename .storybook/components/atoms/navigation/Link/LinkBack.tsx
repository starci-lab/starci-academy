import React from "react"
import { Link as HeroUILink, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { SkeletonWidth } from "@sb-components/atoms/_allowed-class-name"
import { SKELETON_TEXT_BAR_SM } from "@sb-components/atoms/_skeleton-bar"


/**
 * ATOM — `LinkBack`: the only "← Back" button in the system, wrapping HeroUI `Link`
 * directly. A leaf atom — it builds on no other atom, but the HeroUI `Link` it renders is a
 * real import, so its root is tagged `"Link"` and declared `tier: "heroui"` in `ANNOTATE`,
 * no `storyId`. Lives in the `Link.*` namespace alongside `LinkSeeMore` — two shapes of the
 * same "text-link + arrow" concept.
 * 
 * 1 PROP = 1 LEAF. No prop earns its own leaf: `label`/`target` only swap the text inside
 * one existing `<span>` (no element added or removed), and `onPress`/`className` produce no
 * visual. Result: one leaf, `Default`, which demonstrates all three call shapes (bare /
 * `target` / `label`) in one frame.
 */

/** Props shared by both variants — excludes `onPress`, see {@link LinkBackProps}. */
interface LinkBackOwnProps {
    /** Full label override; omit to compose from `target` / the generic "Back". */
    label?: string
    /** Destination name appended to the generic label — "Back to {target}" (e.g. "Back to preview"). */
    target?: string
    /**
     * Render the leaf shimmer instead of the real link — same icon + text row, so
     * the row does not move once the label resolves. Width is the only axis left
     * to the caller (ATOM-4): only the atom knows its own line box / icon box.
     */
    isSkeleton?: boolean
    /**
     * Shimmer width for the label bar, as a fraction of the row — never a fixed
     * length, since the real label wraps/reflows with whatever box holds it.
     * Defaults to `"w-1/4"`, matching the short generic "Back" most callers show
     * before `target` is known.
     */
    skeletonWidth?: SkeletonWidth
}

/**
 * `onPress` is required when rendering the real link, not needed when
 * `isSkeleton` — the shimmer has nowhere to navigate yet.
 */
export type LinkBackProps = LinkBackOwnProps &
    (
        | { isSkeleton: true; onPress?: () => void }
        | { isSkeleton?: false; onPress: () => void }
    )

/**
 * The single back affordance of a leaf / sub-view page ("← Back",
 * "← Back to challenge"…), rendered top-left — typically into `PageHeader`'s
 * `breadcrumb` slot. A quiet text link (muted), NOT a pill/button. Hover =
 * the arrow slides left + the label underlines (go-there affordance); the
 * atom owns the look so every back link reads the same.
 *
 * @param props - {@link LinkBackProps}
 */
export const LinkBack = ({
    label,
    target,
    onPress,
    isSkeleton = false,
    skeletonWidth,
}: LinkBackProps) => {
    if (isSkeleton) {
        // Same `flex items-center gap-1` (icon-text) row as the real render; icon box
        // matches `size-3.5`, and the label bar rides `SKELETON_TEXT_BAR_SM`
        // (14px bar in the 20px `text-sm` line box) so the row's height does
        // not change when the real label lands. No ``
        // here since nothing HeroUI-Link-shaped renders in this branch.
        return (
            <div data-tier="atom" data-component="LinkBack" data-principle="icon-text" className="flex w-fit items-center gap-1">
                <HeroSkeleton className="size-3.5 rounded-full" />
                <HeroSkeleton
                    className={cn(SKELETON_TEXT_BAR_SM, skeletonWidth ?? "w-1/4")}

                />
            </div>
        )
    }

    const text = label ?? (target ? `Back to ${target}` : "Back")

    return (
        <HeroUILink
            data-tier="atom"
            data-component="LinkBack"
            onPress={onPress}

            data-principle="icon-text"
            className={cn(
                "group flex w-fit cursor-pointer items-center gap-1 text-sm text-muted no-underline transition-colors hover:text-foreground",
            )}
        >
            {/*
              Icon sized `size-3.5` to match `text-sm`; smaller than `size-5`
              so `weight="bold"` compensates the stroke. Tailwind v4 treats
              `translate` as its own property, so the transition must target
              `[translate]` — `transition-transform` doesn't animate it (the
              arrow would jump instead of sliding).
            */}
            <ArrowLeftIcon
                aria-hidden
                focusable="false"
                weight="bold"
                className="size-3.5 transition-[translate] group-hover:-translate-x-1"
            />
            <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{text}</span>
        </HeroUILink>
    )
}

/** Tier metadata for `LinkBack`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "LinkBack" } as const
