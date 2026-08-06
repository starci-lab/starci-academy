/** @noSkeleton surface chrome — content is handed in by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { Card as HeroCard, CardContent as HeroCardContent } from "@heroui/react"

/** Props for {@link Card}. */
export interface CardProps extends Omit<ComponentProps<typeof HeroCard>, "className" | "classNames" | "children"> {
    /** Card contents. */
    children?: ReactNode
}

/** House card root over HeroUI `Card`. */
export const Card = ({ children, ...props }: CardProps) => (
    <HeroCard data-tier="atom" data-component="Card" {...props}>{children}</HeroCard>
)

/** Props for {@link CardContent}. */
export interface CardContentProps extends Omit<ComponentProps<typeof HeroCardContent>, "className" | "classNames" | "children"> {
    /** Inner card contents. */
    children?: ReactNode
}

/** House card body over HeroUI `CardContent`. */
export const CardContent = ({ children, ...props }: CardContentProps) => (
    <HeroCardContent data-tier="atom" data-component="CardContent" {...props}>{children}</HeroCardContent>
)

/** Tier metadata for `component`, used by the component registry/Storybook lookup. */
export const meta = [
    { tier: "atom", name: "Card" },
    { tier: "atom", name: "CardContent" },
] as const
