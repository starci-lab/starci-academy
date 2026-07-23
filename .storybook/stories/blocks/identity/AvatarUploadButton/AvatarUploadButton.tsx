"use client"

import React from "react"
import { cn } from "@heroui/react"
import { CameraIcon } from "@phosphor-icons/react"
import { Button } from "../../buttons/Button/Button"
import { UserAvatar } from "../UserAvatar/UserAvatar"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/AvatarUploadButton`. Authored in Storybook (not
 * `src`); synced to `src` later. Composes the local {@link UserAvatar} port
 * (sibling folder) instead of `@/components`.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for {@link AvatarUploadButton}. */
export interface AvatarUploadButtonProps extends WithClassNames<undefined> {
    /** Currently shown avatar URL (the saved image or a freshly-picked preview). */
    avatar?: string | null
    /** Display name; drives the avatar fallback initials + image alt text. */
    displayName?: string | null
    /** Stable identity used to seed the generated default avatar (email preferred). */
    seed?: string | null
    /** Accessible label for the icon-only trigger (e.g. "Change avatar"). */
    label: string
    /** Fired when the user activates the trigger to pick a new avatar. */
    onPress: () => void
}

/**
 * Circular avatar trigger that opens an avatar picker. Shows the current (or
 * preview) face inside a round frame and dims it with a centred camera icon on
 * hover/focus, hinting that the image is editable.
 *
 * Owns the full visual treatment (circular clip, hover-dim overlay, camera icon,
 * focus ring) so feature code only places it and wires {@link AvatarUploadButtonProps.onPress}.
 * Props-only — no store or data access; the caller supplies the avatar + identity.
 *
 * @param props - {@link AvatarUploadButtonProps}
 */
export const AvatarUploadButton = ({
    avatar,
    displayName,
    seed,
    label,
    onPress,
    className,
}: AvatarUploadButtonProps) => (
    <Button
        iconOnly
        // size="lg" is chosen for its §5a icon-scale (size-6), NOT for footprint —
        // the explicit `size-20 ... p-0` below overrides the port's own button
        // dimensions, so this only preserves the camera icon's original size-6.
        size="lg"
        variant="ghost"
        onPress={onPress}
        ariaLabel={label}
        icon={
            <>
                <UserAvatar
                    username={displayName}
                    avatar={avatar}
                    seed={seed}
                    size="lg"
                    className="size-20 text-2xl"
                />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <CameraIcon aria-hidden focusable="false" className="text-white" />
                </span>
            </>
        }
        className={cn(
            "group relative size-20 shrink-0 overflow-hidden rounded-full p-0",
            className,
        )}
    />
)
