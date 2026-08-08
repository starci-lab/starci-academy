"use client"

import { cn } from "@heroui/react"
import { Button } from "@/components/atoms/buttons/Button"
import type { IconComponent } from "@/components/atoms/buttons/Button/button-tokens"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * `FloatingActionButton` — a bottom-right floating action button: a round, shadowed accent
 * circle composing the icon-only `Button`, pinned to the corner with `fixed`. Leaves: `icon`,
 * `isSkeleton`. `onPress`/`ariaLabel` carry the press handler and accessible name only.
 */

/** Props for the {@link FloatingActionButton} block. */
export interface FloatingActionButtonProps {
    /** Press handler (open the target overlay / action). */
    onPress: () => void
    /** Accessible name for the icon-only button. */
    ariaLabel: string
    /**
     * The single icon (§13b: named slot, not `children` — this block wraps no
     * caller content, it just carries one icon), passed as a COMPONENT reference
     * (not built JSX) — this block calls it itself, centered and sized by the
     * base `Button` (icon-size §5a).
     */
    icon?: IconComponent
    /** `true` → skeleton mirror (round FAB box, same placement) while loading. */
    isSkeleton?: boolean
    /** Caller identity resolved on the placement root (not the inner Button). */
    identity?: CallerIdentity
}

/**
 * A bottom-right floating action button — a round, shadowed accent circle. COMPOSES
 * the base `<Button iconOnly>` atom (§6): the atom owns the icon-only look,
 * native icon sizing (§5a) and interaction; this block only layers the fixed
 * placement, round shape, shadow and z-index. Pure + props-only.
 *
 * @param props - {@link FloatingActionButtonProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "FloatingActionButton" } as const

/** A bottom-right floating action button that composes the icon-only `Button` atom. */
export const FloatingActionButton = ({
    onPress,
    ariaLabel,
    icon: Icon,
    isSkeleton = false,
    identity,
}: FloatingActionButtonProps) => {
    return (
        <div
            {...resolveIdentity(identity, { tier: "composite", name: "FloatingActionButton" })}
            className={cn("fixed bottom-6 right-[calc(var(--app-rail-w,0px)+1.5rem)] z-40")}
        >
            <Button
                isIconOnly
                variant="primary"
                ariaLabel={ariaLabel}
                onPress={onPress}
                // `icon` is optional (the "icon unset" state is a bare circle); the atom
                // renders no glyph when `prefixIcon` is undefined (guarded), so the cast
                // only bridges the isIconOnly type which demands a definite component.
                prefixIcon={Icon as IconComponent}
                isSkeleton={isSkeleton}
                isElevated
            />
        </div>
    )
}
