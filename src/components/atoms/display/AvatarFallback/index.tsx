/** @noSkeleton fallback chrome inside an avatar ring — text is handed in. */
import type { ComponentProps, ReactNode } from "react"
import { AvatarFallback as HeroAvatarFallback } from "@heroui/react"

/** Props for {@link AvatarFallback}. */
export interface AvatarFallbackProps extends Omit<ComponentProps<typeof HeroAvatarFallback>, "className" | "classNames"> {
    /** Fallback contents (initials, overflow count). */
    children?: ReactNode
}

/** House avatar fallback over HeroUI `AvatarFallback`. */
export const AvatarFallback = ({ children, ...props }: AvatarFallbackProps) => (
    <HeroAvatarFallback data-tier="atom" data-component="AvatarFallback" {...props}>{children}</HeroAvatarFallback>
)

/** Tier metadata for `AvatarFallback`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "AvatarFallback" } as const
