/** @noSkeleton a caption for a control — not a fetched value. */
import type { ComponentProps, ReactNode } from "react"
import { Label as HeroLabel } from "@heroui/react"

/** Props for {@link Label}. */
export interface LabelProps extends Omit<ComponentProps<typeof HeroLabel>, "className" | "classNames"> {
    /** Caption text. */
    children?: ReactNode
}

/** House label over HeroUI `Label`. */
export const Label = ({ children, ...props }: LabelProps) => (
    <HeroLabel data-tier="atom" data-component="Label" {...props}>{children}</HeroLabel>
)

/** Tier metadata for `Label`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Label" } as const
